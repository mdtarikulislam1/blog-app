import { auth as betterAuth } from ".././lib/auth";
import { NextFunction, Request, Response } from "express";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: string;
        emailVerified: boolean;
      };
    }
  }
}

const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });
      if (!session) {
        return res.status(401).json({
          success: false,
          message: "You are not authorized",
        });
      }
      if (!session.user.emailVerified) {
        return res.status(401).json({
          success: false,
          message: "Email verification required. please verify your email",
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as string,
        emailVerified: session.user.emailVerified,
      };
      if (roles.length && !roles.includes(req.user.role as UserRole)) {
        return res.status(401).json({
          success: false,
          message:
            "Forbidden You don't have permission to access this resources",
        });
      }
      next();
    } catch (e) {
      next(e);
    }
  };
};

export default auth