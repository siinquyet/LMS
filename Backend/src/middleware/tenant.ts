import { Request, Response, NextFunction } from 'express';

declare global {
  namespace Express {
    interface Request {
      tenant?: {
        isSuperAdmin: boolean;
      };
    }
  }
}

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};

export const requireTenant = (
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  next();
};