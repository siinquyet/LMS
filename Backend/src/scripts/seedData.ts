import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const courseTemplates = [
  {
    title: 'Python cho người mới bắt đầu',
    categoryId: 1,
    instructorId: 4,
    price: 599000,
    description: 'Khóa học Python từ cơ bản đến nâng cao, phù hợp cho người mới bắt đầu. Bạn sẽ học cách lập trình Python, làm việc với dữ liệu và xây dựng ứng dụng thực tế.',
    level: 'Cơ bản',
    duration: '30 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&h=400&fit=crop',
    requirements: ['Không yêu cầu kinh nghiệm lập trình', 'Máy tính có kết nối internet', 'Đam mê học lập trình'],
    learningOutcomes: ['Viết chương trình Python từ cơ bản đến nâng cao', 'Làm việc với dữ liệu và thư viện', 'Xây dựng ứng dụng web với Flask', 'Phân tích dữ liệu với Pandas'],
    chapters: [
      { title: 'Giới thiệu Python', lessons: [
        { title: 'Python là gì?', type: 'video', duration: '10:00' },
        { title: 'Cài đặt môi trường', type: 'video', duration: '15:00' },
        { title: 'Hello World đầu tiên', type: 'video', duration: '12:00' },
        { title: 'Quiz Python cơ bản', type: 'quiz' },
      ]},
      { title: 'Biến và Kiểu dữ liệu', lessons: [
        { title: 'Số và Chuỗi', type: 'video', duration: '18:00' },
        { title: 'List và Dictionary', type: 'video', duration: '20:00' },
        { title: 'Tuple và Set', type: 'video', duration: '15:00' },
        { title: 'Bài tập biến và kiểu dữ liệu', type: 'exercise' },
        { title: 'Quiz kiểu dữ liệu', type: 'quiz' },
      ]},
      { title: 'Cấu trúc điều khiển', lessons: [
        { title: 'If-Else Statement', type: 'video', duration: '15:00' },
        { title: 'Vòng lặp For', type: 'video', duration: '20:00' },
        { title: 'Vòng lặp While', type: 'video', duration: '15:00' },
        { title: 'Bài tập vòng lặp', type: 'exercise' },
        { title: 'Quiz cấu trúc điều khiển', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'UI/UX Design Masterclass',
    categoryId: 2,
    instructorId: 4,
    price: 799000,
    description: 'Khóa học thiết kế UI/UX toàn diện. Học cách tạo giao diện người dùng đẹp mắt, trải nghiệm người dùng tốt với Figma và các công cụ thiết kế hiện đại.',
    level: 'Trung cấp',
    duration: '25 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    requirements: ['Biết cơ bản về thiết kế', 'Có máy tính cài Figma', 'Yêu thích thiết kế'],
    learningOutcomes: ['Thành thạo Figma', 'Hiểu về Design System', 'Áp dụng UX principles', 'Tạo prototype chuyên nghiệp'],
    chapters: [
      { title: 'UI Design Fundamentals', lessons: [
        { title: 'Giới thiệu UI/UX', type: 'video', duration: '12:00' },
        { title: 'Color Theory', type: 'video', duration: '20:00' },
        { title: 'Typography', type: 'video', duration: '18:00' },
        { title: 'Quiz UI Fundamentals', type: 'quiz' },
      ]},
      { title: 'Figma Mastery', lessons: [
        { title: 'Figma cơ bản', type: 'video', duration: '25:00' },
        { title: 'Components và Variants', type: 'video', duration: '22:00' },
        { title: 'Auto Layout', type: 'video', duration: '20:00' },
        { title: 'Bài tập Figma', type: 'exercise' },
        { title: 'Quiz Figma', type: 'quiz' },
      ]},
      { title: 'UX Research', lessons: [
        { title: 'User Research Methods', type: 'video', duration: '20:00' },
        { title: 'Wireframing', type: 'video', duration: '18:00' },
        { title: 'Prototyping', type: 'video', duration: '25:00' },
        { title: 'Quiz UX Research', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Digital Marketing 2024',
    categoryId: 3,
    instructorId: 4,
    price: 449000,
    description: 'Khóa học Digital Marketing toàn diện, bao gồm SEO, Google Ads, Facebook Ads, Content Marketing và Email Marketing.',
    level: 'Cơ bản',
    duration: '20 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=600&h=400&fit=crop',
    requirements: ['Không yêu cầu kinh nghiệm Marketing', 'Máy tính có kết nối internet'],
    learningOutcomes: ['Xây dựng chiến lược Marketing tổng thể', 'Chạy quảng cáo Facebook/Google hiệu quả', 'SEO website lên top Google', 'Content Marketing và Email Marketing'],
    chapters: [
      { title: 'Digital Marketing Overview', lessons: [
        { title: 'Digital Marketing là gì?', type: 'video', duration: '10:00' },
        { title: 'Xây dựng chiến lược', type: 'video', duration: '15:00' },
        { title: 'Customer Journey', type: 'video', duration: '12:00' },
        { title: 'Quiz Digital Marketing', type: 'quiz' },
      ]},
      { title: 'SEO & Content', lessons: [
        { title: 'SEO cơ bản', type: 'video', duration: '20:00' },
        { title: 'Keyword Research', type: 'video', duration: '18:00' },
        { title: 'Content Strategy', type: 'video', duration: '22:00' },
        { title: 'Bài tập SEO', type: 'exercise' },
        { title: 'Quiz SEO', type: 'quiz' },
      ]},
      { title: 'Social Media Ads', lessons: [
        { title: 'Facebook Ads', type: 'video', duration: '25:00' },
        { title: 'Google Ads', type: 'video', duration: '20:00' },
        { title: 'Analytics & Tracking', type: 'video', duration: '18:00' },
        { title: 'Quiz Social Ads', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'React Native Mobile Development',
    categoryId: 1,
    instructorId: 3,
    price: 899000,
    description: 'Xây dựng ứng dụng di động đa nền tảng với React Native. Từ cơ bản đến triển khai ứng dụng lên App Store và Google Play.',
    level: 'Nâng cao',
    duration: '45 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    requirements: ['Biết JavaScript cơ bản', 'Hiểu về React', 'Có máy tính và điện thoại để test'],
    learningOutcomes: ['Xây dựng ứng dụng React Native hoàn chỉnh', 'Triển khai lên App Store và Google Play', 'Tối ưu hiệu năng ứng dụng', 'Tích hợp API và Firebase'],
    chapters: [
      { title: 'React Native Introduction', lessons: [
        { title: 'React Native là gì?', type: 'video', duration: '10:00' },
        { title: 'Cài đặt môi trường', type: 'video', duration: '20:00' },
        { title: 'Tạo project đầu tiên', type: 'video', duration: '15:00' },
        { title: 'Quiz React Native', type: 'quiz' },
      ]},
      { title: 'Core Components', lessons: [
        { title: 'View, Text, Image', type: 'video', duration: '18:00' },
        { title: 'ScrollView và FlatList', type: 'video', duration: '22:00' },
        { title: 'TextInput và Button', type: 'video', duration: '15:00' },
        { title: 'Bài tập Components', type: 'exercise' },
        { title: 'Quiz Components', type: 'quiz' },
      ]},
      { title: 'Navigation & API', lessons: [
        { title: 'React Navigation', type: 'video', duration: '25:00' },
        { title: 'Gọi API với fetch', type: 'video', duration: '20:00' },
        { title: 'State Management', type: 'video', duration: '30:00' },
        { title: 'Bài tập Navigation', type: 'exercise' },
        { title: 'Quiz Navigation', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'AWS Cloud Practitioner',
    categoryId: 1,
    instructorId: 3,
    price: 999000,
    description: 'Khóa học chuẩn bị cho chứng chỉ AWS Cloud Practitioner. Tìm hiểu về cloud computing, các dịch vụ AWS cốt lõi và kiến trúc cloud.',
    level: 'Nâng cao',
    duration: '35 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    requirements: ['Hiểu cơ bản về IT infrastructure', 'Có kiến thức networking cơ bản', 'Máy tính có kết nối internet'],
    learningOutcomes: ['Hiểu về AWS Cloud Architecture', 'Triển khai ứng dụng trên AWS', 'Tối ưu chi phí AWS', 'Chuẩn bị cho chứng chỉ CLF-C02'],
    chapters: [
      { title: 'Cloud Concepts', lessons: [
        { title: 'Cloud Computing Overview', type: 'video', duration: '15:00' },
        { title: 'AWS Global Infrastructure', type: 'video', duration: '20:00' },
        { title: 'AWS Well-Architected Framework', type: 'video', duration: '25:00' },
        { title: 'Quiz Cloud Concepts', type: 'quiz' },
      ]},
      { title: 'Core AWS Services', lessons: [
        { title: 'EC2 và Compute', type: 'video', duration: '30:00' },
        { title: 'S3 và Storage', type: 'video', duration: '25:00' },
        { title: 'RDS và Database', type: 'video', duration: '20:00' },
        { title: 'VPC và Networking', type: 'video', duration: '35:00' },
        { title: 'Quiz AWS Services', type: 'quiz' },
      ]},
      { title: 'Security & Pricing', lessons: [
        { title: 'IAM và Security', type: 'video', duration: '25:00' },
        { title: 'AWS Pricing Model', type: 'video', duration: '20:00' },
        { title: 'Cost Optimization', type: 'video', duration: '15:00' },
        { title: 'Quiz Security & Pricing', type: 'quiz' },
      ]},
    ],
  },
];

async function main() {
  console.log('🌱 Seeding additional courses with complete info...');

  const existingCourses = await prisma.course.findMany({ select: { title: true } });
  const existingTitles = new Set(existingCourses.map(c => c.title));

  let coursesAdded = 0;

  for (const template of courseTemplates) {
    if (existingTitles.has(template.title)) {
      // Update existing course with requirements and learning outcomes
      await prisma.course.updateMany({
        where: { title: template.title },
        data: {
          description: template.description,
          level: template.level,
          duration: template.duration,
          imageUrl: template.imageUrl,
          requirements: template.requirements,
          learningOutcomes: template.learningOutcomes,
        },
      });
      console.log(`  ✅ Updated: ${template.title}`);
      continue;
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title: template.title,
        instructorId: template.instructorId,
        categoryId: template.categoryId,
        price: template.price,
        enrolledCount: Math.floor(Math.random() * 500) + 50,
        status: 'approved',
        description: template.description,
        level: template.level,
        duration: template.duration,
        imageUrl: template.imageUrl,
        requirements: template.requirements,
        learningOutcomes: template.learningOutcomes,
      },
    });

    let lessonCount = 0;

    // Create chapters and lessons
    for (let chIdx = 0; chIdx < template.chapters.length; chIdx++) {
      const ch = template.chapters[chIdx];
      const chapter = await prisma.chapter.create({
        data: {
          courseId: course.id,
          title: ch.title,
          order: chIdx + 1,
        },
      });

      for (let lsIdx = 0; lsIdx < ch.lessons.length; lsIdx++) {
        const ls = ch.lessons[lsIdx];
        await prisma.lesson.create({
          data: {
            chapterId: chapter.id,
            title: ls.title,
            type: ls.type as any,
            order: lsIdx + 1,
            duration: ls.duration || null,
            videoUrl: ls.duration ? '/uploads/videos/basic-1.mp4' : null,
          },
        });
        lessonCount++;
      }
    }

    // Update lesson count
    await prisma.course.update({
      where: { id: course.id },
      data: { lessonCount },
    });

    coursesAdded++;
    console.log(`  ✅ Created: ${template.title} (${lessonCount} lessons)`);
  }

  // ====== Add quizzes/assignments for all lessons ======
  console.log('\n📝 Adding quizzes and assignments...');

  const lessons = await prisma.lesson.findMany({
    include: { chapter: { include: { course: true } } },
  });

  console.log(`Found ${lessons.length} lessons`);

  let quizzesAdded = 0;
  let assignmentsAdded = 0;

  for (const lesson of lessons) {
    // Add quiz for quiz-type lessons
    if (lesson.type === 'quiz') {
      const existingQuiz = await prisma.quiz.findFirst({ where: { lessonId: lesson.id } });
      if (!existingQuiz) {
        const quiz = await prisma.quiz.create({
          data: {
            lessonId: lesson.id,
            title: `Kiểm tra: ${lesson.title}`,
            timeLimit: 15,
            questionCount: 5,
          },
        });

        const questions = [
          { question: 'Khái niệm nào sau đây đúng về ' + lesson.title + '?', options: ['A. Đáp án A', 'B. Đáp án B', 'C. Đáp án C', 'D. Đáp án D'], correctAnswer: 'A. Đáp án A' },
          { question: 'Cái nào là đúng về chủ đề này?', options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'], correctAnswer: 'Option 2' },
          { question: 'Chọn đáp án đúng:', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C' },
          { question: 'Câu lệnh nào đúng trong ngữ cảnh này?', options: ['if', 'else', 'both', 'none'], correctAnswer: 'both' },
          { question: 'Kết quả của biểu thức là gì?', options: ['1', '2', '3', '4'], correctAnswer: '1' },
        ];

        for (const q of questions) {
          await prisma.quizQuestion.create({
            data: {
              quizId: quiz.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
            },
          });
        }
        quizzesAdded++;
        console.log(`  ✅ Added quiz: ${lesson.title}`);
      }
    }

    // Add assignment for exercise-type lessons
    if (lesson.type === 'exercise') {
      const existingAssignment = await prisma.assignment.findFirst({ where: { lessonId: lesson.id } });
      if (!existingAssignment) {
        await prisma.assignment.create({
          data: {
            lessonId: lesson.id,
            title: `Bài tập: ${lesson.title}`,
            description: `Hoàn thành bài tập ${lesson.title} trong chương ${lesson.chapter.title} của khóa học ${lesson.chapter.course.title}. Nộp bài làm trước deadline.`,
            isRequired: true,
            dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        });
        assignmentsAdded++;
        console.log(`  ✅ Added assignment: ${lesson.title}`);
      }
    }

    // Add video URL for video-type lessons if missing
    if (lesson.type === 'video' && !lesson.videoUrl) {
      await prisma.lesson.update({
        where: { id: lesson.id },
        data: { videoUrl: '/uploads/videos/basic-1.mp4' },
      });
    }
  }

  // Update course lesson counts for all courses
  const allCourses = await prisma.course.findMany();
  for (const course of allCourses) {
    const totalLessons = await prisma.lesson.count({
      where: { chapter: { courseId: course.id } },
    });
    await prisma.course.update({
      where: { id: course.id },
      data: { lessonCount: totalLessons },
    });
  }

  console.log(`\n🎉 Seed completed!`);
  console.log(`  - Added ${coursesAdded} new courses`);
  console.log(`  - Added ${quizzesAdded} quizzes`);
  console.log(`  - Added ${assignmentsAdded} assignments`);
  console.log(`  - Total courses: ${allCourses.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
