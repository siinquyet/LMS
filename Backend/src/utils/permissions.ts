import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Permission } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const DEFAULT_PERMISSIONS: Record<string, Permission[]> = {
  hoc_vien: [],
  giang_vien: ['MANAGE_COURSES', 'VIEW_ANALYTICS'],
  admin: [
    'MANAGE_COURSES',
    'MANAGE_USERS',
    'VIEW_ANALYTICS',
    'APPROVE_COURSES',
    'MANAGE_ORDERS',
    'MANAGE_PAYOUTS',
    'VIEW_REPORTS',
    'MANAGE_SETTINGS',
  ],
  
};

export const getUserPermissions = async (userId: number): Promise<Permission[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return [];

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { role: user.role },
    select: { permission: true },
  });

  const userPermissions = await prisma.userPermission.findMany({
    where: { userId },
    select: { permission: true, granted: true },
  });

  const permSet = new Set(rolePermissions.map(rp => rp.permission));

  for (const up of userPermissions) {
    if (up.granted) {
      permSet.add(up.permission);
    } else {
      permSet.delete(up.permission);
    }
  }

  return Array.from(permSet) as Permission[];
};

export const hasPermission = async (
  userId: number,
  permission: Permission
): Promise<boolean> => {
  const permissions = await getUserPermissions(userId);
  return permissions.includes(permission);
};

export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const hasPerm = await hasPermission(req.user.userId, permission);

    if (!hasPerm) {
      console.warn(`[Permission Denied] User ${req.user.userId} lacks ${permission}`);
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const requireAnyPermission = (...permissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userPerms = await getUserPermissions(req.user.userId);

    const hasAny = permissions.some(perm => userPerms.includes(perm));

    if (!hasAny) {
      console.warn(`[Permission Denied] User ${req.user.userId} lacks any of ${permissions.join(', ')}`);
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const requireAllPermissions = (...permissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const userPerms = await getUserPermissions(req.user.userId);

    const hasAll = permissions.every(perm => userPerms.includes(perm));

    if (!hasAll) {
      console.warn(`[Permission Denied] User ${req.user.userId} lacks all of ${permissions.join(', ')}`);
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const seedRolePermissions = async (): Promise<void> => {
  for (const [role, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
    for (const permission of permissions) {
      const existing = await prisma.rolePermission.findFirst({
        where: { role: role as any, permission },
      });
      if (!existing) {
        await prisma.rolePermission.create({
          data: {
            role: role as any,
            permission,
          },
        });
      }
    }
  }
};

export { Permission };