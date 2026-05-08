import { Request, Response, NextFunction } from 'express';

export interface TenantContext {
  organizationId: number;
  isSuperAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      tenant?: TenantContext;
    }
  }
}

export const extractTenantId = (req: Request): number | null => {
  const tenantHeader = req.headers['x-tenant-id'];
  if (tenantHeader && typeof tenantHeader === 'string') {
    const id = parseInt(tenantHeader, 10);
    if (!isNaN(id)) return id;
  }

  return null;
};

export const resolveTenant = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user?.role === 'super_admin') {
    req.tenant = {
      organizationId: parseInt(req.headers['x-tenant-id'] as string, 10) || 0,
      isSuperAdmin: true,
    };
    next();
    return;
  }

  const organizationId = req.user?.organizationId || extractTenantId(req);

  if (!organizationId) {
    res.status(400).json({ error: 'Tenant not identified' });
    return;
  }

  req.tenant = {
    organizationId,
    isSuperAdmin: false,
  };

  next();
};

export const optionalTenant = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user?.role === 'super_admin') {
    const orgId = parseInt(req.headers['x-tenant-id'] as string, 10);
    req.tenant = {
      organizationId: orgId || 0,
      isSuperAdmin: true,
    };
    next();
    return;
  }

  const organizationId = req.user?.organizationId || extractTenantId(req);

  if (organizationId) {
    req.tenant = {
      organizationId,
      isSuperAdmin: false,
    };
  }

  next();
};

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'super_admin') {
    res.status(403).json({ error: 'Super admin access required' });
    return;
  }
  next();
};

export const requireTenant = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.tenant || req.tenant.organizationId <= 0) {
    res.status(400).json({ error: 'Tenant context required' });
    return;
  }
  next();
};
