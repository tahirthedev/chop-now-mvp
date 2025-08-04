import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { redisClient } from '../utils/redis';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Generate JWT token
export const generateToken = (userId: string, email: string, role: string): string => {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );
};

// Verify JWT token
export const verifyToken = (token: string): JWTPayload => {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
};

// Authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required'
      });
      return;
    }

    // Check if token is blacklisted in Redis
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      res.status(401).json({
        success: false,
        message: 'Token has been invalidated'
      });
      return;
    }

    // Verify token
    const decoded = verifyToken(token);

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
      return;
    }

    // Add user to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
      return;
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Role-based authorization middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

// Optional authentication (allows both authenticated and unauthenticated requests)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      // Check if token is blacklisted
      const isBlacklisted = await redisClient.get(`blacklist:${token}`);
      if (!isBlacklisted) {
        try {
          const decoded = verifyToken(token);
          
          // Check if user exists
          const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
          });

          if (user && user.isActive) {
            req.user = {
              id: decoded.userId,
              email: decoded.email,
              role: decoded.role
            };
          }
        } catch (tokenError) {
          // Token is invalid, but we continue without authentication
          console.log('Optional auth: Invalid token, continuing without auth');
        }
      }
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    // Continue without authentication
    next();
  }
};

// Blacklist token in Redis
export const blacklistToken = async (token: string): Promise<void> => {
  try {
    const decoded = verifyToken(token);
    const expiresIn = decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600;
    
    if (expiresIn > 0) {
      await redisClient.setEx(`blacklist:${token}`, expiresIn, 'true');
    }
  } catch (error) {
    console.error('Error blacklisting token:', error);
  }
};

// Rate limiting for authentication endpoints
export const authRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const key = `auth_rate_limit:${clientIP}`;
    
    const attempts = await redisClient.get(key);
    const maxAttempts = 5;
    const windowMs = 15 * 60 * 1000; // 15 minutes

    if (attempts && parseInt(attempts) >= maxAttempts) {
      res.status(429).json({
        success: false,
        message: 'Too many authentication attempts. Please try again later.'
      });
      return;
    }

    // Increment attempts
    const currentAttempts = attempts ? parseInt(attempts) + 1 : 1;
    await redisClient.setEx(key, Math.floor(windowMs / 1000), currentAttempts.toString());

    next();
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue without rate limiting if Redis fails
    next();
  }
};

// Account lockout middleware
export const checkAccountLockout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    
    if (!email) {
      next();
      return;
    }

    const lockoutKey = `lockout:${email}`;
    const isLocked = await redisClient.get(lockoutKey);

    if (isLocked) {
      res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
      return;
    }

    next();
  } catch (error) {
    console.error('Account lockout check error:', error);
    next();
  }
};

// Handle failed login attempt
export const handleFailedLogin = async (email: string): Promise<void> => {
  try {
    const failedAttemptsKey = `failed_attempts:${email}`;
    const lockoutKey = `lockout:${email}`;
    
    const attempts = await redisClient.get(failedAttemptsKey);
    const currentAttempts = attempts ? parseInt(attempts) + 1 : 1;
    
    const maxAttempts = 5;
    const lockoutDuration = 30 * 60; // 30 minutes
    const attemptWindow = 15 * 60; // 15 minutes

    if (currentAttempts >= maxAttempts) {
      // Lock the account
      await redisClient.setEx(lockoutKey, lockoutDuration, 'true');
      await redisClient.del(failedAttemptsKey);
    } else {
      // Increment failed attempts
      await redisClient.setEx(failedAttemptsKey, attemptWindow, currentAttempts.toString());
    }
  } catch (error) {
    console.error('Error handling failed login:', error);
  }
};

// Clear failed login attempts on successful login
export const clearFailedAttempts = async (email: string): Promise<void> => {
  try {
    await redisClient.del(`failed_attempts:${email}`);
  } catch (error) {
    console.error('Error clearing failed attempts:', error);
  }
};

// Session management
export const createSession = async (userId: string, token: string): Promise<void> => {
  try {
    const sessionKey = `session:${userId}`;
    const sessionData = {
      token,
      createdAt: new Date().toISOString(),
      lastAccessed: new Date().toISOString()
    };
    
    await redisClient.setEx(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(sessionData)); // 7 days
  } catch (error) {
    console.error('Error creating session:', error);
  }
};

export const deleteSession = async (userId: string): Promise<void> => {
  try {
    await redisClient.del(`session:${userId}`);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
};

export const getSession = async (userId: string): Promise<any> => {
  try {
    const sessionData = await redisClient.get(`session:${userId}`);
    return sessionData ? JSON.parse(sessionData) : null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};
