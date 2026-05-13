import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export type NotificationEvent =
  | 'enrollment_success'
  | 'payout_approved'
  | 'payout_rejected'
  | 'payout_requested'
  | 'course_published'
  | 'course_rejected'
  | 'course_submitted'
  | 'certificate_issued'
  | 'quiz_completed'
  | 'system';

type NotificationData = {
  [K in NotificationEvent]: {
    getTitle: (data: Record<string, unknown>) => string;
    getContent: (data: Record<string, unknown>) => string;
    getType: (data: Record<string, unknown>) => 'success' | 'warning' | 'info' | 'error';
    getLink?: (data: Record<string, unknown>) => string | undefined;
  };
};

const eventConfigs: NotificationData = {
  enrollment_success: {
    getTitle: () => 'Đăng ký khóa học thành công',
    getContent: (d) => `Bạn đã đăng ký thành công ${d.courseCount} khóa học. Chúc bạn học tập hiệu quả!`,
    getType: () => 'success',
  },
  payout_approved: {
    getTitle: () => 'Rút tiền thành công',
    getContent: (d) =>
      `Yêu cầu rút ${(d.amount as number).toLocaleString('vi-VN')} VNĐ đã được xử lý thành công.${d.bankName ? ` Tiền sẽ được chuyển vào tài khoản ${d.bankName} (${d.bankAccount}) trong 1-3 ngày làm việc.` : ''}`,
    getType: () => 'success',
    getLink: () => '/teacher/withdrawals',
  },
  payout_rejected: {
    getTitle: () => 'Yêu cầu rút tiền bị từ chối',
    getContent: (d) =>
      `Yêu cầu rút ${(d.amount as number).toLocaleString('vi-VN')} VNĐ đã bị từ chối.${d.reason ? ` Lý do: ${d.reason}` : ' Vui lòng liên hệ admin để biết thêm chi tiết.'}`,
    getType: () => 'warning',
  },
  payout_requested: {
    getTitle: () => 'Yêu cầu rút tiền đã gửi',
    getContent: (d) =>
      `Yêu cầu rút ${(d.amount as number).toLocaleString('vi-VN')} VNĐ đã được gửi và đang chờ duyệt.`,
    getType: () => 'info',
    getLink: () => '/teacher/withdrawals',
  },
  course_published: {
    getTitle: () => 'Khóa học đã được xuất bản',
    getContent: (d) => `Khóa học "${d.courseTitle}" đã được xuất bản. Học viên có thể đăng ký ngay!`,
    getType: () => 'success',
    getLink: (d) => `/courses/${d.courseId}`,
  },
  course_rejected: {
    getTitle: () => 'Khóa học bị từ chối',
    getContent: (d) =>
      `Khóa học "${d.courseTitle}" đã bị từ chối.${d.reason ? ` Lý do: ${d.reason}` : ''}`,
    getType: () => 'warning',
    getLink: (d) => `/teacher/courses/${d.courseId}/edit`,
  },
  course_submitted: {
    getTitle: () => 'Khóa học mới chờ duyệt',
    getContent: (d) => `Khóa học "${d.courseTitle}" đang chờ bạn phê duyệt.`,
    getType: () => 'info',
    getLink: () => '/admin/courses?status=pending',
  },
  certificate_issued: {
    getTitle: () => 'Bạn nhận được chứng chỉ!',
    getContent: (d) => `Chúc mừng! Bạn đã hoàn thành khóa học "${d.courseTitle}" và nhận được chứng chỉ.`,
    getType: () => 'success',
    getLink: (d) => `/certificates/${d.certificateId}`,
  },
  quiz_completed: {
    getTitle: () => 'Kết quả bài kiểm tra',
    getContent: (d) =>
      `Bạn đã hoàn thành bài kiểm tra "${d.quizTitle}" với số điểm ${d.score}/${d.total}.`,
    getType: () => 'info',
  },
  system: {
    getTitle: (d: Record<string, unknown>) => (d.title as string) || 'Thông báo',
    getContent: (d: Record<string, unknown>) => (d.content as string) || '',
    getType: (d: Record<string, unknown>) => (d.type as 'success' | 'warning' | 'info' | 'error') || 'info',
    getLink: (d: Record<string, unknown>) => d.link as string | undefined,
  },
};

interface NotificationPayload {
  userId: number;
  event: NotificationEvent;
  data?: Record<string, unknown>;
  tx?: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;
}

export async function sendNotification(payload: NotificationPayload): Promise<void> {
  const { userId, event, data = {}, tx } = payload;
  const config = eventConfigs[event];
  const client = tx ?? prisma;

  await (client as typeof prisma).notification.create({
    data: {
      userId,
      title: config.getTitle(data),
      content: config.getContent(data),
      type: config.getType(data),
      link: config.getLink?.(data),
      createdAt: new Date(),
    },
  });
}

export async function sendNotificationBatch(
  recipients: Array<{ userId?: number; id?: number }>,
  event: NotificationEvent,
  data: Record<string, unknown>,
  tx?: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
): Promise<void> {
  for (const { userId, id } of recipients) {
    const targetId = userId ?? id;
    if (targetId) {
      await sendNotification({ userId: targetId, event, data, tx });
    }
  }
}

export async function createNotificationDirect(
  userId: number,
  title: string,
  content: string,
  type: 'success' | 'warning' | 'info' | 'error' = 'info',
  link?: string,
  tx?: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>,
): Promise<void> {
  const client = tx ?? prisma;
  await (client as typeof prisma).notification.create({
    data: {
      userId,
      title,
      content,
      type,
      link,
      createdAt: new Date(),
    },
  });
}