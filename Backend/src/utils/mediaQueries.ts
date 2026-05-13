import { PrismaClient } from '@prisma/client';
import type { Media, MediaType } from '@prisma/client';

export type EntityType = 'user' | 'lesson' | 'course' | 'forum_post';

const prisma = new PrismaClient();

type MediaWithUploader = Media & {
  uploader?: { id: number; firstName: string | null; lastName: string | null; avatarUrl: string | null } | null;
};

function mediaBaseQuery(entityType: EntityType) {
  return {
    where: { entityType },
    orderBy: { createdAt: 'desc' as const },
  };
}

export const mediaQueries = {
  forLesson(lessonId: number) {
    return prisma.media.findMany({
      ...mediaBaseQuery('lesson'),
      where: { entityId: lessonId },
    });
  },

  forLessonFirst(lessonId: number, extra?: Parameters<typeof prisma.media.findFirst>[0]) {
    return prisma.media.findFirst({
      ...mediaBaseQuery('lesson'),
      where: { entityId: lessonId, ...extra?.where },
      ...(extra ? { orderBy: extra.orderBy, take: extra.take } : {}),
    });
  },

  forCourse(courseId: number) {
    return prisma.media.findMany({
      ...mediaBaseQuery('course'),
      where: { entityId: courseId },
    });
  },

  forCourseFirst(courseId: number, extra?: Parameters<typeof prisma.media.findFirst>[0]) {
    return prisma.media.findFirst({
      ...mediaBaseQuery('course'),
      where: { entityId: courseId, ...extra?.where },
      ...(extra ? { orderBy: extra.orderBy, take: extra.take } : {}),
    });
  },

  forUser(userId: number) {
    return prisma.media.findMany({
      ...mediaBaseQuery('user'),
      where: { entityId: userId },
    });
  },

  forForumPost(postId: number) {
    return prisma.media.findMany({
      ...mediaBaseQuery('forum_post'),
      where: { entityId: postId },
    });
  },

  byId(mediaId: number) {
    return prisma.media.findUnique({ where: { id: mediaId } });
  },

  byIdForLesson(mediaId: number, lessonId: number) {
    return prisma.media.findFirst({
      where: { id: mediaId, entityType: 'lesson', entityId: lessonId },
    });
  },

  byIdForCourse(mediaId: number, courseId: number) {
    return prisma.media.findFirst({
      where: { id: mediaId, entityType: 'course', entityId: courseId },
    });
  },
};

export const mediaMutations = {
  createLessonMedia(
    lessonId: number,
    userId: number,
    data: { type: MediaType; url: string; filename: string; mimeType: string; size: number },
  ) {
    return prisma.media.create({
      data: {
        type: data.type,
        url: data.url,
        filename: data.filename,
        mimeType: data.mimeType,
        size: data.size,
        entityType: 'lesson',
        entityId: lessonId,
        uploadedBy: userId,
      },
    });
  },

  createCourseMedia(
    courseId: number,
    userId: number,
    data: { type: MediaType; url: string; filename: string; mimeType: string; size: number },
  ) {
    return prisma.media.create({
      data: {
        type: data.type,
        url: data.url,
        filename: data.filename,
        mimeType: data.mimeType,
        size: data.size,
        entityType: 'course',
        entityId: courseId,
        uploadedBy: userId,
      },
    });
  },

  deleteLessonMedia(mediaId: number, lessonId: number) {
    return prisma.media.deleteMany({
      where: { id: mediaId, entityType: 'lesson', entityId: lessonId },
    });
  },

  deleteCourseMedia(mediaId: number, courseId: number) {
    return prisma.media.deleteMany({
      where: { id: mediaId, entityType: 'course', entityId: courseId },
    });
  },

  deleteById(mediaId: number) {
    return prisma.media.delete({ where: { id: mediaId } });
  },

  reassign(mediaId: number, entityType: EntityType, entityId: number) {
    return prisma.media.update({
      where: { id: mediaId },
      data: { entityType, entityId },
    });
  },
};

export function serializeMedia(media: MediaWithUploader & { originalName?: string | null }) {
  return {
    id: media.id,
    url: media.url,
    ten_file: media.originalName || media.filename,
    loai: media.type,
    kich_thuoc: media.size,
    mime_type: media.mimeType,
    ngay_tai: media.createdAt.toISOString(),
    nguoi_tai: media.uploader
      ? { id: media.uploader.id, ten: media.uploader.firstName, ho: media.uploader.lastName }
      : null,
  };
}

export function serializeMediaList(medias: MediaWithUploader[]) {
  return medias.map(serializeMedia);
}

export function serializeMediaForLesson(medias: MediaWithUploader[]) {
  return { tai_lieu: serializeMediaList(medias) };
}