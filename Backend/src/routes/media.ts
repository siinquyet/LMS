import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { authenticate } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
const prisma = new PrismaClient();

const createUploader = (subDir: string, maxSizeMB: number, allowedMimes: string[]) => {
  const dir = path.join(__dirname, `../../uploads/${subDir}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_: unknown, __: unknown, cb: (err: Error | null, path: string) => void) => {
      cb(null, dir);
    },
    filename: (_: unknown, file: { originalname: string }, cb: (err: Error | null, filename: string) => void) => {
      const ext = path.extname(file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, `${uniqueSuffix}${ext}`);
    }
  });

  return multer({
    storage,
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
    fileFilter: (_: unknown, file: { mimetype: string }, cb: multer.FileFilterCallback) => {
      if (allowedMimes.some(mime => file.mimetype.startsWith(mime))) {
        cb(null, true);
      } else {
        cb(new Error(`File type not allowed. Allowed: ${allowedMimes.join(', ')}`));
      }
    }
  });
};

const avatarUpload = createUploader('avatars', 5, ['image/']);
const forumUpload = createUploader('forum', 20, ['image/', 'video/']);
const courseUpload = createUploader('courses', 500, ['image/', 'video/', 'application/']);

const getUploaderForType = (entityType: string) => {
  switch (entityType) {
    case 'forum_post':
      return forumUpload.single('file');
    case 'course':
    case 'lesson':
      return courseUpload.single('file');
    case 'user':
    default:
      return avatarUpload.single('file');
  }
};

const getUploadDir = (entityType: string) => {
  switch (entityType) {
    case 'user':
      return 'avatars';
    case 'forum_post':
      return 'forum';
    case 'course':
    case 'lesson':
    default:
      return 'courses';
  }
};

router.post('/:entityType', authenticate, async (req: any, res) => {
  const { entityType } = req.params;
  const upload = getUploaderForType(entityType);

  upload(req, res, async (err: Error | string | undefined) => {
    if (err) {
      const message = typeof err === 'string' ? err : err.message;
      res.status(400).json({ error: message });
      return;
    }

    const file = req.file;
    if (!file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    let mediaType: 'image' | 'video' | 'document' = 'image';
    if (file.mimetype.startsWith('video/')) mediaType = 'video';
    else if (!file.mimetype.startsWith('image/')) mediaType = 'document';

    const url = `/uploads/${getUploadDir(entityType)}/${file.filename}`;
    const userId = req.user.userId;

    const entityId = parseInt(req.body.entityId) || 0;

    if (entityType === 'user' && userId) {
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { avatarUrl: true }
      });
      if (existingUser?.avatarUrl) {
        const oldFilePath = path.join(__dirname, '../../', existingUser.avatarUrl.replace('/uploads', 'uploads'));
        if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
        await prisma.media.deleteMany({ where: { entityType: 'user', entityId: userId } });
      }
      await prisma.user.update({ where: { id: userId }, data: { avatarUrl: url } });
    }

    const media = await prisma.media.create({
      data: {
        type: mediaType,
        url,
        filename: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        entityType: entityType || 'user',
        entityId: entityId || userId,
        uploadedBy: userId || 0,
      }
    });

    res.json({ success: true, media, url });
  });
});

router.post('/upload', authenticate, async (req: any, res) => {
  try {
    const { entityType } = req.body;
    let upload;

    switch (entityType) {
      case 'forum_post':
        upload = forumUpload.single('file');
        break;
      case 'course':
      case 'lesson':
        upload = courseUpload.single('file');
        break;
      case 'user':
      default:
        upload = avatarUpload.single('file');
    }

    upload(req, res, async (err: Error | string | undefined) => {
      if (err) {
        const message = typeof err === 'string' ? err : err.message;
        res.status(400).json({ error: message });
        return;
      }

      const file = req.file;
      if (!file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      let mediaType: 'image' | 'video' | 'document' = 'image';
      if (file.mimetype.startsWith('video/')) mediaType = 'video';
      else if (!file.mimetype.startsWith('image/')) mediaType = 'document';

      const url = `/uploads/${entityType === 'user' ? 'avatars' : entityType === 'forum_post' ? 'forum' : 'courses'}/${file.filename}`;
      const userId = req.user.userId;

      const entityId = parseInt(req.body.entityId) || 0;

      if (entityType === 'user' && userId) {
        const existingUser = await prisma.user.findUnique({
          where: { id: userId },
          select: { avatarUrl: true }
        });
        if (existingUser?.avatarUrl) {
          const oldFilePath = path.join(__dirname, '../../', existingUser.avatarUrl.replace('/uploads', 'uploads'));
          if (fs.existsSync(oldFilePath)) fs.unlinkSync(oldFilePath);
          await prisma.media.deleteMany({ where: { entityType: 'user', entityId: userId } });
        }
        await prisma.user.update({ where: { id: userId }, data: { avatarUrl: url } });
      }

      const media = await prisma.media.create({
        data: {
          type: mediaType,
          url,
          filename: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          entityType: entityType || 'user',
          entityId: entityId || userId,
          uploadedBy: userId || 0,
          
        }
      });

      res.json({ success: true, media, url });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/', authenticate, async (req: any, res) => {
  try {
    const { entityType, entityId } = req.query;
    const where: any = {};

    if (entityType) where.entityType = entityType as string;
    if (entityId) where.entityId = parseInt(entityId as string);

    const medias = await prisma.media.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    res.json(medias);
  } catch (error) {
    console.error('List media error:', error);
    res.status(500).json({ error: 'Failed to list media' });
  }
});

router.get('/:id', authenticate, async (req: any, res) => {
  try {
    const media = await prisma.media.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }
    res.json(media);
  } catch (error) {
    console.error('Get media error:', error);
    res.status(500).json({ error: 'Failed to get media' });
  }
});

router.delete('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const userRole = req.user.role;

    const media = await prisma.media.findUnique({ where: { id: parseInt(id) } });
    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    if (media.uploadedBy !== userId && !['admin'].includes(userRole)) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }
    const filePath = path.join(__dirname, '../../', media.url.replace('/uploads', 'uploads'));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.media.delete({ where: { id: parseInt(id) } });

    if (media.entityType === 'user') {
      await prisma.user.update({
        where: { id: media.entityId },
        data: { avatarUrl: null }
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete media error:', error);
    res.status(500).json({ error: 'Failed to delete media' });
  }
});

router.patch('/:id', authenticate, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { entityType, entityId } = req.body;

    const media = await prisma.media.findUnique({ where: { id: parseInt(id) } });
    if (!media) {
      res.status(404).json({ error: 'Media not found' });
      return;
    }

    if (media.uploadedBy !== userId) {
      res.status(403).json({ error: 'Not authorized' });
      return;
    }

    const updated = await prisma.media.update({
      where: { id: parseInt(id) },
      data: { entityType, entityId }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update media error:', error);
    res.status(500).json({ error: 'Failed to update media' });
  }
});

export default router;