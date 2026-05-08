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
  super_admin: [
    'MANAGE_COURSES',
    'MANAGE_USERS',
    'VIEW_ANALYTICS',
    'APPROVE_COURSES',
    'MANAGE_ORDERS',
    'MANAGE_PAYOUTS',
    'VIEW_REPORTS',
    'MANAGE_SETTINGS',
    'MANAGE_ORGANIZATIONS',
    'MANAGE_PERMISSIONS',
  ],
};

export const getUserPermissions = async (userId: number, organizationId: number): Promise<Permission[]> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, organizationId: true },
  });

  if (!user) return [];

  if (user.organizationId !== organizationId) return [];

  const rolePermissions = await prisma.rolePermission.findMany({
    where: { role: user.role, organizationId },
    select: { permission: true },
  });

  const userPermissions = await prisma.userPermission.findMany({
    where: { userId, organizationId },
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
  organizationId: number,
  permission: Permission
): Promise<boolean> => {
  const permissions = await getUserPermissions(userId, organizationId);
  return permissions.includes(permission);
};

export const requirePermission = (permission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const organizationId = req.user.organizationId;
    const hasPerm = await hasPermission(req.user.userId, organizationId, permission);

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

    const organizationId = req.user.organizationId;
    const userPerms = await getUserPermissions(req.user.userId, organizationId);

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

    const organizationId = req.user.organizationId;
    const userPerms = await getUserPermissions(req.user.userId, organizationId);

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

export const seedRolePermissions = async (organizationId: number): Promise<void> => {
  for (const [role, permissions] of Object.entries(DEFAULT_PERMISSIONS)) {
    for (const permission of permissions) {
      await prisma.rolePermission.upsert({
        where: {
          role_permission_organizationId: {
            role: role as any,
            permission,
            organizationId,
          },
        },
        create: {
          role: role as any,
          permission,
          organizationId,
        },
        update: {},
      });
    }
  }
};

export { Permission };
