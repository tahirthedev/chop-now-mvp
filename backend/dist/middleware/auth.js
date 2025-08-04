"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSession = exports.deleteSession = exports.createSession = exports.clearFailedAttempts = exports.handleFailedLogin = exports.checkAccountLockout = exports.authRateLimit = exports.blacklistToken = exports.optionalAuth = exports.requireRole = exports.authenticateToken = exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const redis_1 = require("../utils/redis");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const generateToken = (userId, email, role) => {
    return jsonwebtoken_1.default.sign({ userId, email, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const isBlacklisted = await redis_1.redisClient.get(`blacklist:${token}`);
        if (isBlacklisted) {
            res.status(401).json({
                success: false,
                message: 'Token has been invalidated'
            });
            return;
        }
        const decoded = (0, exports.verifyToken)(token);
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
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
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
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
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
exports.requireRole = requireRole;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const isBlacklisted = await redis_1.redisClient.get(`blacklist:${token}`);
            if (!isBlacklisted) {
                try {
                    const decoded = (0, exports.verifyToken)(token);
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
                }
                catch (tokenError) {
                    console.log('Optional auth: Invalid token, continuing without auth');
                }
            }
        }
        next();
    }
    catch (error) {
        console.error('Optional auth error:', error);
        next();
    }
};
exports.optionalAuth = optionalAuth;
const blacklistToken = async (token) => {
    try {
        const decoded = (0, exports.verifyToken)(token);
        const expiresIn = decoded.exp ? decoded.exp - Math.floor(Date.now() / 1000) : 3600;
        if (expiresIn > 0) {
            await redis_1.redisClient.setEx(`blacklist:${token}`, expiresIn, 'true');
        }
    }
    catch (error) {
        console.error('Error blacklisting token:', error);
    }
};
exports.blacklistToken = blacklistToken;
const authRateLimit = async (req, res, next) => {
    try {
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        const key = `auth_rate_limit:${clientIP}`;
        const attempts = await redis_1.redisClient.get(key);
        const maxAttempts = 5;
        const windowMs = 15 * 60 * 1000;
        if (attempts && parseInt(attempts) >= maxAttempts) {
            res.status(429).json({
                success: false,
                message: 'Too many authentication attempts. Please try again later.'
            });
            return;
        }
        const currentAttempts = attempts ? parseInt(attempts) + 1 : 1;
        await redis_1.redisClient.setEx(key, Math.floor(windowMs / 1000), currentAttempts.toString());
        next();
    }
    catch (error) {
        console.error('Rate limiting error:', error);
        next();
    }
};
exports.authRateLimit = authRateLimit;
const checkAccountLockout = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            next();
            return;
        }
        const lockoutKey = `lockout:${email}`;
        const isLocked = await redis_1.redisClient.get(lockoutKey);
        if (isLocked) {
            res.status(423).json({
                success: false,
                message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
            });
            return;
        }
        next();
    }
    catch (error) {
        console.error('Account lockout check error:', error);
        next();
    }
};
exports.checkAccountLockout = checkAccountLockout;
const handleFailedLogin = async (email) => {
    try {
        const failedAttemptsKey = `failed_attempts:${email}`;
        const lockoutKey = `lockout:${email}`;
        const attempts = await redis_1.redisClient.get(failedAttemptsKey);
        const currentAttempts = attempts ? parseInt(attempts) + 1 : 1;
        const maxAttempts = 5;
        const lockoutDuration = 30 * 60;
        const attemptWindow = 15 * 60;
        if (currentAttempts >= maxAttempts) {
            await redis_1.redisClient.setEx(lockoutKey, lockoutDuration, 'true');
            await redis_1.redisClient.del(failedAttemptsKey);
        }
        else {
            await redis_1.redisClient.setEx(failedAttemptsKey, attemptWindow, currentAttempts.toString());
        }
    }
    catch (error) {
        console.error('Error handling failed login:', error);
    }
};
exports.handleFailedLogin = handleFailedLogin;
const clearFailedAttempts = async (email) => {
    try {
        await redis_1.redisClient.del(`failed_attempts:${email}`);
    }
    catch (error) {
        console.error('Error clearing failed attempts:', error);
    }
};
exports.clearFailedAttempts = clearFailedAttempts;
const createSession = async (userId, token) => {
    try {
        const sessionKey = `session:${userId}`;
        const sessionData = {
            token,
            createdAt: new Date().toISOString(),
            lastAccessed: new Date().toISOString()
        };
        await redis_1.redisClient.setEx(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(sessionData));
    }
    catch (error) {
        console.error('Error creating session:', error);
    }
};
exports.createSession = createSession;
const deleteSession = async (userId) => {
    try {
        await redis_1.redisClient.del(`session:${userId}`);
    }
    catch (error) {
        console.error('Error deleting session:', error);
    }
};
exports.deleteSession = deleteSession;
const getSession = async (userId) => {
    try {
        const sessionData = await redis_1.redisClient.get(`session:${userId}`);
        return sessionData ? JSON.parse(sessionData) : null;
    }
    catch (error) {
        console.error('Error getting session:', error);
        return null;
    }
};
exports.getSession = getSession;
//# sourceMappingURL=auth.js.map