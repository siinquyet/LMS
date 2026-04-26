import { PrismaClient } from '@prisma/client';
import {
  assignmentSubmissions,
  assignments,
  categories,
  chapters,
  comments,
  courses,
  enrollments,
  forumReplies,
  forumTopics,
  lessons,
  notifications,
  orderItems,
  orders,
  payments,
  progress,
  quizAttempts,
  quizQuestions,
  quizzes,
  users,
} from '../../Frontend/src/mockData.ts';

const prisma = new PrismaClient();

const toDate = (value: string | undefined) => (value ? new Date(value) : undefined);

async function main() {
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.forumReply.deleteMany();
  await prisma.forumTopic.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: users.map((user) => ({
      id: user.id,
      username: user.ten_dang_nhap,
      email: user.email,
      password: user.mat_khau,
      firstName: user.ten,
      lastName: user.ho,
      avatarUrl: user.anh_dai_dien,
      phone: user.so_dien_thoai,
      address: user.dia_chi,
      bio: user.gioi_thieu,
      isLocked: user.bi_khoa,
      joinedAt: new Date(user.ngay_tham_gia),
      role: user.vai_tro,
    })),
  });

  await prisma.category.createMany({
    data: categories.map((category) => ({
      id: category.id,
      name: category.ten,
    })),
  });

  await prisma.course.createMany({
    data: courses.map((course) => ({
      id: course.id,
      title: course.tieu_de,
      instructorId: course.giang_vien_id,
      categoryId: course.danh_muc_id,
      price: course.gia,
      maxStudents: course.so_luong_toi_da,
      enrolledCount: course.so_luong_da_dang_ky,
      status: course.trang_thai,
      description: course.mo_ta,
      requirements: course.yeu_cau ?? course.requirements,
      deviceRequirements: course.ban_thiet_bi,
      thumbnailUrl: course.thumbnail,
      imageUrl: course.hinh_anh,
      level: course.muc_do,
      duration: course.thoi_luong,
      lessonCount: course.so_bai_hoc,
      rating: course.xep_hang,
      learningOutcomes: course.whatYouLearn,
    })),
  });

  await prisma.chapter.createMany({
    data: chapters.map((chapter) => ({
      id: chapter.id,
      courseId: chapter.khoa_hoc_id,
      title: chapter.tieu_de,
      order: chapter.thu_tu,
    })),
  });

  await prisma.lesson.createMany({
    data: lessons.map((lesson) => ({
      id: lesson.id,
      chapterId: lesson.chuong_hoc_id,
      title: lesson.tieu_de,
      videoUrl: lesson.video_url,
      type: lesson.loai,
      duration: lesson.thoi_luong,
      content: lesson.noi_dung,
    })),
  });

  const lessonIds = new Set(lessons.map((lesson) => lesson.id));

  await prisma.enrollment.createMany({
    data: enrollments.map((enrollment) => ({
      id: enrollment.id,
      userId: enrollment.nguoi_dung_id,
      courseId: enrollment.khoa_hoc_id,
      enrolledAt: new Date(enrollment.ngay_dang_ky),
    })),
  });

  await prisma.progress.createMany({
    data: progress.map((item) => ({
      userId: item.nguoi_dung_id,
      lessonId: item.bai_hoc_id,
      completed: item.da_hoan_thanh,
      completedAt: toDate(item.ngay_hoan_thanh),
    })),
  });

  await prisma.order.createMany({
    data: orders.map((order) => ({
      id: order.id,
      userId: order.nguoi_dung_id,
      totalAmount: order.tong_tien,
      status: order.trang_thai,
      orderedAt: new Date(order.ngay_dat),
    })),
  });

  await prisma.orderItem.createMany({
    data: orderItems.map((item) => ({
      id: item.id,
      orderId: item.don_hang_id,
      courseId: item.khoa_hoc_id,
      price: item.gia,
    })),
  });

  await prisma.payment.createMany({
    data: payments.map((payment) => ({
      id: payment.id,
      orderId: payment.don_hang_id,
      amount: payment.so_tien,
      status: payment.trang_thai,
      paidAt: new Date(payment.ngay_thanh_toan),
      method: payment.phuong_thuc,
    })),
  });

  await prisma.comment.createMany({
    data: comments.map((comment) => ({
      id: comment.id,
      lessonId: comment.bai_hoc_id,
      userId: comment.nguoi_dung_id,
      content: comment.noi_dung,
      parentId: comment.parent_id,
      createdAt: new Date(comment.ngay_tao),
    })),
  });

  await prisma.notification.createMany({
    data: notifications.map((notification) => ({
      id: notification.id,
      userId: notification.nguoi_dung_id,
      title: notification.tieu_de,
      content: notification.noi_dung,
      type: notification.loai,
      isRead: notification.da_doc,
      createdAt: new Date(notification.ngay_tao),
      link: notification.link,
    })),
  });

  await prisma.forumTopic.createMany({
    data: forumTopics.map((topic) => ({
      id: topic.id,
      userId: topic.nguoi_dung_id,
      title: topic.tieu_de,
      content: topic.noi_dung,
      courseId: topic.khoa_hoc_id,
      viewCount: topic.luot_xem,
      replyCount: topic.luot_tra_loi,
      createdAt: new Date(topic.ngay_tao),
      updatedAt: new Date(topic.ngay_cap_nhat),
    })),
  });

  await prisma.forumReply.createMany({
    data: forumReplies.map((reply) => ({
      id: reply.id,
      topicId: reply.topic_id,
      userId: reply.nguoi_dung_id,
      content: reply.noi_dung,
      createdAt: new Date(reply.ngay_tao),
    })),
  });

  await prisma.quiz.createMany({
    data: quizzes.map((quiz) => ({
      id: quiz.id,
      lessonId: quiz.bai_hoc_id,
      title: quiz.tieu_de,
      timeLimit: quiz.thoi_gian_lam,
      questionCount: quiz.so_cau_hoi,
    })),
  });

  await prisma.quizQuestion.createMany({
    data: quizQuestions.map((question) => ({
      id: question.id,
      quizId: question.quiz_id,
      question: question.cau_hoi,
      options: question.lua_chon,
      correctAnswer: question.dap_an_dung,
    })),
  });

  await prisma.quizAttempt.createMany({
    data: quizAttempts.map((attempt) => ({
      id: attempt.id,
      quizId: attempt.quiz_id,
      userId: attempt.nguoi_dung_id,
      score: attempt.diem,
      takenAt: new Date(attempt.ngay_lam),
    })),
  });

  const validAssignments = assignments.filter((assignment) => lessonIds.has(assignment.bai_hoc_id));

  const skippedAssignments = assignments.filter((assignment) => !lessonIds.has(assignment.bai_hoc_id));

  if (skippedAssignments.length > 0) {
    console.warn(
      `Skipping ${skippedAssignments.length} assignment(s) with missing lesson: ${skippedAssignments
        .map((assignment) => assignment.id)
        .join(', ')}`,
    );
  }

  await prisma.assignment.createMany({
    data: validAssignments.map((assignment) => ({
      id: assignment.id,
      lessonId: assignment.bai_hoc_id,
      title: assignment.tieu_de,
      description: assignment.mo_ta,
      isRequired: assignment.bat_buoc,
      dueAt: toDate(assignment.han_nop),
    })),
  });

  const validAssignmentIds = new Set(validAssignments.map((assignment) => assignment.id));

  await prisma.assignmentSubmission.createMany({
    data: assignmentSubmissions
      .filter((submission) => validAssignmentIds.has(submission.bai_tap_id))
      .map((submission) => ({
      id: submission.id,
      assignmentId: submission.bai_tap_id,
      userId: submission.nguoi_dung_id,
      content: submission.noi_dung,
      attachmentUrl: submission.file_dinh_kem,
      score: submission.diem,
      feedback: submission.nhan_xet,
      submittedAt: new Date(submission.ngay_nop),
    })),
  });

}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
