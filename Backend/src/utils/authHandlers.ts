import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken, getUserPermissions, DEFAULT_PERMISSIONS } from '../utils/permissions.js';
import { authenticate } from '../middleware/auth.js';
import { resolveTenant } from '../middleware/tenant.js';

const prisma = new PrismaClient();

export const authHandlers = {
  forgotPassword: async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as { email?: string };

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        res.json({ message: 'If the email exists, a reset link will be sent' });
        return;
      }

      const token = generateToken();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const resetUrl = `http://localhost:5173/reset-password?token=${token}`;

      console.log(`[Password Reset] Token for ${email}: ${token}`);

      res.json({
        message: 'If the email exists, a reset link will be sent',
        resetUrl,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  resetPassword: async (req: Request, res: Response): Promise<void> => {
    const { token, password } = req.body as { token?: string; password?: string };

    if (!token || !password) {
      res.status(400).json({ error: 'Token and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters' });
      return;
    }

    try {
      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!resetToken) {
        res.status(400).json({ error: 'Invalid reset token' });
        return;
      }

      if (resetToken.used) {
        res.status(400).json({ error: 'Reset token has already been used' });
        return;
      }

      if (resetToken.expiresAt < new Date()) {
        res.status(400).json({ error: 'Reset token has expired' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: resetToken.userId },
          data: {
            password: hashedPassword,
            tokenVersion: { increment: 1 },
          },
        }),
        prisma.passwordResetToken.update({
          where: { id: resetToken.id },
          data: { used: true },
        }),
      ]);

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  verifyEmail: async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body as { token?: string };

    if (!token) {
      res.status(400).json({ error: 'Token is required' });
      return;
    }

    try {
      const verificationToken = await prisma.emailVerificationToken.findUnique({
        where: { token },
        include: { user: true },
      });

      if (!verificationToken) {
        res.status(400).json({ error: 'Invalid verification token' });
        return;
      }

      if (verificationToken.expiresAt < new Date()) {
        res.status(400).json({ error: 'Verification token has expired' });
        return;
      }

      await prisma.$transaction([
        prisma.user.update({
          where: { id: verificationToken.userId },
          data: { isEmailVerified: true },
        }),
        prisma.emailVerificationToken.delete({
          where: { id: verificationToken.id },
        }),
      ]);

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  resendVerification: async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body as { email?: string };

    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
      });

      if (!user) {
        res.json({ message: 'If the email exists, a verification link will be sent' });
        return;
      }

      if (user.isEmailVerified) {
        res.json({ message: 'Email already verified' });
        return;
      }

      await prisma.emailVerificationToken.deleteMany({
        where: { userId: user.id },
      });

      const token = generateToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          token,
          expiresAt,
        },
      });

      const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;

      console.log(`[Email Verification] Token for ${email}: ${token}`);

      res.json({
        message: 'Verification link sent',
        verifyUrl,
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getSessions: [
    authenticate,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const sessions = await prisma.refreshToken.findMany({
          where: {
            userId: req.user!.userId,
            isRevoked: false,
          },
          select: {
            id: true,
            userAgent: true,
            ipAddress: true,
            createdAt: true,
            lastUsedAt: true,
            expiresAt: true,
          },
          orderBy: { createdAt: 'desc' },
        });

        res.json({ sessions });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  revokeSession: [
    authenticate,
    async (req: Request, res: Response): Promise<void> => {
      const sessionId = parseInt(req.params.sessionId, 10);

      if (isNaN(sessionId)) {
        res.status(400).json({ error: 'Invalid session id' });
        return;
      }

      try {
        const session = await prisma.refreshToken.findUnique({
          where: { id: sessionId },
        });

        if (!session || session.userId !== req.user!.userId) {
          res.status(404).json({ error: 'Session not found' });
          return;
        }

        await prisma.refreshToken.update({
          where: { id: sessionId },
          data: { isRevoked: true },
        });

        res.json({ message: 'Session revoked' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  revokeAllSessions: [
    authenticate,
    async (req: Request, res: Response): Promise<void> => {
      try {
        await prisma.refreshToken.updateMany({
          where: {
            userId: req.user!.userId,
            isRevoked: false,
          },
          data: { isRevoked: true },
        });

        await prisma.user.update({
          where: { id: req.user!.userId },
          data: { tokenVersion: { increment: 1 } },
        });

        res.json({ message: 'All sessions revoked' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],

  getPermissions: [
    authenticate,
    resolveTenant,
    async (req: Request, res: Response): Promise<void> => {
      try {
        const organizationId = req.user!.organizationId;
        const permissions = await getUserPermissions(req.user!.userId, organizationId);
        const defaultPerms = DEFAULT_PERMISSIONS[req.user!.role] || [];

        res.json({
          permissions,
          defaultPermissions: defaultPerms,
        });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    },
  ],
};
