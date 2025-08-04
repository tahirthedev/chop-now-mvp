import { Request, Response, NextFunction } from 'express';
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
export declare const generateToken: (userId: string, email: string, role: string) => string;
export declare const verifyToken: (token: string) => JWTPayload;
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const requireRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const blacklistToken: (token: string) => Promise<void>;
export declare const authRateLimit: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const checkAccountLockout: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const handleFailedLogin: (email: string) => Promise<void>;
export declare const clearFailedAttempts: (email: string) => Promise<void>;
export declare const createSession: (userId: string, token: string) => Promise<void>;
export declare const deleteSession: (userId: string) => Promise<void>;
export declare const getSession: (userId: string) => Promise<any>;
export {};
//# sourceMappingURL=auth.d.ts.map