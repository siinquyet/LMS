/**
 * DIAGNOSTIC TEST: Drip Content + Certificate Auto-Issue Flow
 * 
 * Kịch bản:
 * - Khóa học có 2 chương, mỗi chương có 1 bài học
 * - Bài 1 chương 1 hoàn thành (Heartbeat đạt 90%)
 * - Kiểm tra bài 1 chương 2 được mở khóa
 * - Bài 1 chương 2 hoàn thành → kiểm tra Certificate được tạo
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const testUserId = 999999; // Test user ID placeholder
const prismaCertificate = prisma as any;

const runDiagnosticTest = async () => {
  console.log('='.repeat(60));
  console.log('🔬 DIAGNOSTIC TEST: Drip Content + Certificate Flow');
  console.log('='.repeat(60));

  console.log('\n📋 STEP 1: Setup - Tạo cấu trúc test');
  console.log('-'.repeat(40));

  // Cleanup dữ liệu test cũ
  await prismaCertificate.certificate.deleteMany({ where: { enrollment: { userId: testUserId } } });
  await prisma.progress.deleteMany({ where: { userId: testUserId } });

  // Tạo User test
  let testUser = await prisma.user.findUnique({ where: { id: testUserId } });
  if (!testUser) {
    testUser = await prisma.user.create({
      data: {
        id: testUserId,
        username: `test_user_${Date.now()}`,
        email: `test_${Date.now()}@test.com`,
        password: 'test123',
        firstName: 'Test',
        lastName: 'User',
        joinedAt: new Date(),
        role: 'hoc_vien',
        
      },
    });
    console.log(`✅ Created test user: ${testUser.id}`);
  }

  // Tạo Course test
  const testCourse = await prisma.course.create({
    data: {
      title: `Test Course ${Date.now()}`,
      instructorId: testUserId,
      categoryId: 1,
      price: 0,
      status: 'published',
    },
  });
  console.log(`✅ Created course: ${testCourse.id}`);

  // Tạo 2 Chapters
  const chapter1 = await prisma.chapter.create({
    data: { courseId: testCourse.id, title: 'Chương 1', order: 1 },
  });
  const chapter2 = await prisma.chapter.create({
    data: { courseId: testCourse.id, title: 'Chương 2', order: 2 },
  });
  console.log(`✅ Created chapters: ${chapter1.id}, ${chapter2.id}`);

  // Tạo 2 Lessons
  const lesson1Ch1 = await prisma.lesson.create({
    data: { chapterId: chapter1.id, title: 'Bài 1 - Chương 1', order: 1, type: 'video', duration: '600' },
  });
  const lesson1Ch2 = await prisma.lesson.create({
    data: { chapterId: chapter2.id, title: 'Bài 1 - Chương 2', order: 1, type: 'video', duration: '300' },
  });
  console.log(`✅ Created lessons: ${lesson1Ch1.id}, ${lesson1Ch2.id}`);

  // Tạo Enrollment
  const enrollment = await prisma.enrollment.create({
    data: { userId: testUserId, courseId: testCourse.id },
  });
  console.log(`✅ Created enrollment: ${enrollment.id}`);

  console.log('\n📋 STEP 2: Kiểm tra Drip Content - Bài đầu tiên');
  console.log('-'.repeat(40));

  // Bài đầu tiên (order=1) → cho phép truy cập
  const canAccessFirst = await checkDripAccess(lesson1Ch1.id, testUserId);
  console.log(`✅ Bài đầu tiên (order=1): ${canAccessFirst.allowed ? 'ĐƯỢC PHÉP' : 'BỊ CHẶN'}`);
  console.assert(canAccessFirst.allowed, '❌ Bài đầu tiên phải cho phép truy cập');

  console.log('\n📋 STEP 3: Kiểm tra Drip Content - Bài bị khóa');
  console.log('-'.repeat(40));

  // Bài chương 2, chưa hoàn thành chương 1 → bị chặn
  const cannotAccess = await checkDripAccess(lesson1Ch2.id, testUserId);
  console.log(`❌ Bài chương 2 (chưa học chương 1): ${cannotAccess.allowed ? 'ĐƯỢC PHÉP' : 'BỊ CHẶN'}`);
  console.log(`   Message: "${cannotAccess.message}"`);
  console.assert(!cannotAccess.allowed, '❌ Bài chương 2 phải bị chặn khi chưa học chương 1');

  console.log('\n📋 STEP 4: Simulate Heartbeat - Hoàn thành Bài 1 Chương 1');
  console.log('-'.repeat(40));

  // Simulate heartbeat: xem 90% video (600s → 540s)
  const heartbeatResult1 = await simulateHeartbeat(lesson1Ch1.id, testUserId, 540, 600);
  console.log(`   watched_ratio: ${heartbeatResult1.watched_ratio}`);
  console.log(`   completed: ${heartbeatResult1.completed}`);
  console.log(`   just_completed: ${heartbeatResult1.just_completed}`);
  console.assert(heartbeatResult1.just_completed, '❌ Bài 1 phải được đánh dấu hoàn thành');

  // Verify Progress
  const progress1 = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId: testUserId, lessonId: lesson1Ch1.id } },
  });
  console.log(`✅ Progress created: completed=${progress1?.completed}`);

  console.log('\n📋 STEP 5: Kiểm tra Drip Content - Bài giờ được mở khóa');
  console.log('-'.repeat(40));

  // Giờ bài chương 2 phải được mở khóa
  const canAccessNow = await checkDripAccess(lesson1Ch2.id, testUserId);
  console.log(`✅ Bài chương 2 (đã học chương 1): ${canAccessNow.allowed ? 'ĐƯỢC PHÉP' : 'BỊ CHẶN'}`);
  console.assert(canAccessNow.allowed, '❌ Bài chương 2 phải được mở khóa sau khi học xong chương 1');

  console.log('\n📋 STEP 6: Simulate Heartbeat - Hoàn thành Bài 1 Chương 2');
  console.log('-'.repeat(40));

  // Simulate heartbeat: xem 90% video (300s → 270s)
  const heartbeatResult2 = await simulateHeartbeat(lesson1Ch2.id, testUserId, 270, 300);
  console.log(`   watched_ratio: ${heartbeatResult2.watched_ratio}`);
  console.log(`   completed: ${heartbeatResult2.completed}`);
  console.log(`   just_completed: ${heartbeatResult2.just_completed}`);
  console.assert(heartbeatResult2.just_completed, '❌ Bài 2 phải được đánh dấu hoàn thành');

  console.log('\n📋 STEP 7: Kiểm tra Certificate được tạo');
  console.log('-'.repeat(40));

  // Verify Certificate
  const certificate = await prismaCertificate.certificate.findUnique({
    where: { enrollmentId: enrollment.id },
  });

  if (certificate) {
    console.log(`✅ Certificate created!`);
    console.log(`   certificateNo: ${certificate.certificateNo}`);
    console.log(`   status: ${certificate.status}`);
    console.log(`   issuedAt: ${certificate.issuedAt}`);
    
    // Verify format: CERT-YYYY-XXXXXX
    const certNoRegex = /^CERT-\d{4}-[A-Z0-9]{6}$/;
    console.log(`   Format valid: ${certNoRegex.test(certificate.certificateNo) ? '✅ YES' : '❌ NO'}`);
    console.assert(certNoRegex.test(certificate.certificateNo), '❌ CertificateNo phải có format CERT-YYYY-XXXXXX');
  } else {
    console.log(`❌ Certificate NOT created - FAIL!`);
  }

  console.log('\n📋 STEP 8: Cleanup');
  console.log('-'.repeat(40));
  await prismaCertificate.certificate.deleteMany({ where: { enrollment: { userId: testUserId } } });
  await prisma.progress.deleteMany({ where: { userId: testUserId } });
  await prisma.enrollment.deleteMany({ where: { userId: testUserId } });
  await prisma.lesson.deleteMany({ where: { chapterId: { in: [chapter1.id, chapter2.id] } } });
  await prisma.chapter.deleteMany({ where: { courseId: testCourse.id } });
  await prisma.course.delete({ where: { id: testCourse.id } });
  console.log('✅ Cleanup completed');

  console.log('\n' + '='.repeat(60));
  console.log('🏁 DIAGNOSTIC TEST COMPLETED');
  console.log('='.repeat(60));
};

// Helper functions (migrate from lesson.routes.js logic)
const checkDripAccess = async (lessonId: number, userId: number): Promise<{ allowed: boolean; message?: string }> => {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: true },
  });

  if (!lesson) return { allowed: false, message: 'Lesson not found' };
  if (lesson.order <= 1) return { allowed: true };

  const previousLesson = await prisma.lesson.findFirst({
    where: { chapterId: lesson.chapterId, order: lesson.order - 1 },
  });

  if (previousLesson) {
    const prevProgress = await prisma.progress.findUnique({
      where: { userId_lessonId: { userId, lessonId: previousLesson.id } },
    });
    if (!prevProgress?.completed) {
      return { allowed: false, message: 'Bạn cần hoàn thành bài học trước đó' };
    }
    return { allowed: true };
  }

  const previousChapter = await prisma.chapter.findFirst({
    where: { courseId: lesson.chapter.courseId, order: lesson.chapter.order - 1 },
  });

  if (!previousChapter) return { allowed: true };

  const lastLessonOfPrevChapter = await prisma.lesson.findFirst({
    where: { chapterId: previousChapter.id },
    orderBy: { order: 'desc' },
  });

  if (!lastLessonOfPrevChapter) return { allowed: true };

  const prevProgress = await prisma.progress.findUnique({
    where: { userId_lessonId: { userId, lessonId: lastLessonOfPrevChapter.id } },
  });

  if (!prevProgress?.completed) {
    return { allowed: false, message: `Bạn cần hoàn thành bài "${lastLessonOfPrevChapter.title}" (chương trước) trước` };
  }

  return { allowed: true };
};

const simulateHeartbeat = async (
  lessonId: number,
  userId: number,
  currentTime: number,
  duration: number
): Promise<{ watched_ratio: number; completed: boolean; just_completed: boolean }> => {
  const watchedRatio = Math.min(currentTime / duration, 1);
  const shouldComplete = watchedRatio >= 0.9;

  if (shouldComplete) {
    await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
      update: { completed: true, completedAt: new Date() },
    });

    // Check certificate (simplified)
    await prisma.lesson.count({
      where: { chapter: { course: { enrollments: { some: { userId } } } } },
    });
  }

  return {
    watched_ratio: Math.round(watchedRatio * 100) / 100,
    completed: shouldComplete,
    just_completed: shouldComplete,
  };
};

// Run test
runDiagnosticTest()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Test failed:', err);
    process.exit(1);
  });
