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
      { title: 'Hàm và Modules', lessons: [
        { title: 'Định nghĩa hàm', type: 'video', duration: '18:00' },
        { title: 'Tham số và Return', type: 'video', duration: '15:00' },
        { title: 'Import modules', type: 'video', duration: '12:00' },
        { title: 'Quiz hàm', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Java Core - Lập trình hướng đối tượng',
    categoryId: 1,
    instructorId: 3,
    price: 849000,
    description: 'Khóa học Java toàn diện từ cơ bản đến nâng cao. Nắm vững OOP, collections, multithreading và xây dựng ứng dụng Java hoàn chỉnh.',
    level: 'Trung cấp',
    duration: '45 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=600&h=400&fit=crop',
    requirements: ['Biết cơ bản về lập trình', 'Máy tính cài đặt JDK'],
    learningOutcomes: ['Lập trình hướng đối tượng (OOP)', 'Collections Framework', 'Xử lý exception và multithreading', 'Xây dựng ứng dụng desktop với JavaFX'],
    chapters: [
      { title: 'Java Fundamentals', lessons: [
        { title: 'Giới thiệu Java', type: 'video', duration: '12:00' },
        { title: 'Cài đặt và cấu hình', type: 'video', duration: '15:00' },
        { title: 'Biến và kiểu dữ liệu', type: 'video', duration: '18:00' },
        { title: 'Quiz Java cơ bản', type: 'quiz' },
      ]},
      { title: 'OOP trong Java', lessons: [
        { title: 'Class và Object', type: 'video', duration: '20:00' },
        { title: 'Kế thừa (Inheritance)', type: 'video', duration: '22:00' },
        { title: 'Đa hình (Polymorphism)', type: 'video', duration: '18:00' },
        { title: 'Bài tập OOP', type: 'exercise' },
        { title: 'Quiz OOP', type: 'quiz' },
      ]},
      { title: 'Collections Framework', lessons: [
        { title: 'List và ArrayList', type: 'video', duration: '20:00' },
        { title: 'Map và HashMap', type: 'video', duration: '18:00' },
        { title: 'Set và HashSet', type: 'video', duration: '15:00' },
        { title: 'Bài tập Collections', type: 'exercise' },
        { title: 'Quiz Collections', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Vue.js 3 - Composition API Mastery',
    categoryId: 1,
    instructorId: 4,
    price: 649000,
    description: 'Học Vue.js 3 với Composition API - framework JavaScript tiên tiến. Xây dựng ứng dụng web hiện đại với Vue 3, Vue Router và Pinia.',
    level: 'Trung cấp',
    duration: '35 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    requirements: ['Biết JavaScript và HTML/CSS', 'Máy tính có kết nối internet'],
    learningOutcomes: ['Vue 3 Composition API', 'Vue Router và Pinia', 'Component development', 'Xây dựng SPA application'],
    chapters: [
      { title: 'Vue.js Fundamentals', lessons: [
        { title: 'Giới thiệu Vue 3', type: 'video', duration: '10:00' },
        { title: 'Cài đặt Vue CLI', type: 'video', duration: '15:00' },
        { title: 'Template và Directives', type: 'video', duration: '18:00' },
        { title: 'Quiz Vue cơ bản', type: 'quiz' },
      ]},
      { title: 'Composition API', lessons: [
        { title: 'Reactive và Ref', type: 'video', duration: '20:00' },
        { title: 'Computed và Watch', type: 'video', duration: '18:00' },
        { title: 'Lifecycle Hooks', type: 'video', duration: '15:00' },
        { title: 'Bài tập Composition API', type: 'exercise' },
        { title: 'Quiz Composition API', type: 'quiz' },
      ]},
      { title: 'Vue Router & Pinia', lessons: [
        { title: 'Vue Router cơ bản', type: 'video', duration: '22:00' },
        { title: 'Navigation Guards', type: 'video', duration: '18:00' },
        { title: 'Pinia State Management', type: 'video', duration: '25:00' },
        { title: 'Quiz Router & Pinia', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Docker & Kubernetes Cho DevOps',
    categoryId: 1,
    instructorId: 3,
    price: 999000,
    description: 'Khóa học DevOps toàn diện về Docker và Kubernetes. Học cách containerize ứng dụng, orchestration và triển khai production.',
    level: 'Nâng cao',
    duration: '40 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=600&h=400&fit=crop',
    requirements: ['Biết Linux cơ bản', 'Hiểu về CI/CD', 'Có kiến thức về cloud'],
    learningOutcomes: ['Docker containerization', 'Kubernetes orchestration', 'CI/CD pipelines', 'Cloud deployment'],
    chapters: [
      { title: 'Docker Fundamentals', lessons: [
        { title: 'Giới thiệu Docker', type: 'video', duration: '12:00' },
        { title: 'Dockerfile và Image', type: 'video', duration: '20:00' },
        { title: 'Docker Compose', type: 'video', duration: '18:00' },
        { title: 'Quiz Docker', type: 'quiz' },
      ]},
      { title: 'Kubernetes', lessons: [
        { title: 'Kubernetes Architecture', type: 'video', duration: '25:00' },
        { title: 'Pods và Deployments', type: 'video', duration: '22:00' },
        { title: 'Services và Ingress', type: 'video', duration: '20:00' },
        { title: 'Bài tập Kubernetes', type: 'exercise' },
        { title: 'Quiz Kubernetes', type: 'quiz' },
      ]},
      { title: 'CI/CD và Deployment', lessons: [
        { title: 'Jenkins Pipeline', type: 'video', duration: '25:00' },
        { title: 'GitHub Actions', type: 'video', duration: '20:00' },
        { title: 'Deployment Strategies', type: 'video', duration: '18:00' },
        { title: 'Quiz CI/CD', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Flutter - Xây dựng ứng dụng di động',
    categoryId: 1,
    instructorId: 4,
    price: 749000,
    description: 'Khóa học Flutter toàn diện để xây dựng ứng dụng di động đa nền tảng iOS và Android với một codebase duy nhất.',
    level: 'Trung cấp',
    duration: '38 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop',
    requirements: ['Biết lập trình cơ bản', 'Máy tính cài Flutter SDK'],
    learningOutcomes: ['Flutter widgets và layouts', 'State management với Provider', 'REST API integration', 'Publish app lên stores'],
    chapters: [
      { title: 'Flutter Basics', lessons: [
        { title: 'Giới thiệu Flutter', type: 'video', duration: '10:00' },
        { title: 'Cài đặt môi trường', type: 'video', duration: '15:00' },
        { title: 'Dart Language cơ bản', type: 'video', duration: '20:00' },
        { title: 'Quiz Flutter cơ bản', type: 'quiz' },
      ]},
      { title: 'Widgets và Layouts', lessons: [
        { title: 'Basic Widgets', type: 'video', duration: '18:00' },
        { title: 'Layout Widgets', type: 'video', duration: '22:00' },
        { title: 'Navigation', type: 'video', duration: '15:00' },
        { title: 'Bài tập Widgets', type: 'exercise' },
        { title: 'Quiz Widgets', type: 'quiz' },
      ]},
      { title: 'State Management', lessons: [
        { title: 'Provider Pattern', type: 'video', duration: '25:00' },
        { title: 'StateNotifier', type: 'video', duration: '20:00' },
        { title: 'API Integration', type: 'video', duration: '22:00' },
        { title: 'Bài tập State', type: 'exercise' },
        { title: 'Quiz State', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'SQL & Database Design',
    categoryId: 1,
    instructorId: 3,
    price: 449000,
    description: 'Học SQL từ cơ bản đến nâng cao và thiết kế database. Nắm vững MySQL, PostgreSQL và các nguyên tắc thiết kế database chuẩn.',
    level: 'Cơ bản',
    duration: '25 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&h=400&fit=crop',
    requirements: ['Không yêu cầu kinh nghiệm', 'Máy tính cài đặt MySQL'],
    learningOutcomes: ['SQL queries và joins', 'Database normalization', 'Indexing và optimization', 'Database design patterns'],
    chapters: [
      { title: 'SQL Basics', lessons: [
        { title: 'Giới thiệu SQL', type: 'video', duration: '10:00' },
        { title: 'SELECT và WHERE', type: 'video', duration: '15:00' },
        { title: 'INSERT, UPDATE, DELETE', type: 'video', duration: '18:00' },
        { title: 'Quiz SQL cơ bản', type: 'quiz' },
      ]},
      { title: 'Joins và Subqueries', lessons: [
        { title: 'INNER JOIN', type: 'video', duration: '20:00' },
        { title: 'LEFT và RIGHT JOIN', type: 'video', duration: '18:00' },
        { title: 'Subqueries', type: 'video', duration: '15:00' },
        { title: 'Bài tập Joins', type: 'exercise' },
        { title: 'Quiz Joins', type: 'quiz' },
      ]},
      { title: 'Database Design', lessons: [
        { title: 'Normalization', type: 'video', duration: '22:00' },
        { title: 'Indexing', type: 'video', duration: '18:00' },
        { title: 'Views và Stored Procedures', type: 'video', duration: '20:00' },
        { title: 'Quiz Database Design', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Go Language - Lập trình Backend',
    categoryId: 1,
    instructorId: 4,
    price: 699000,
    description: 'Khóa học Go programming cho backend development. Xây dựng API hiệu năng cao với Go, Gin framework và PostgreSQL.',
    level: 'Trung cấp',
    duration: '32 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
    requirements: ['Biết một ngôn ngữ lập trình', 'Hiểu HTTP và REST'],
    learningOutcomes: ['Go syntax và concurrency', 'RESTful API với Gin', 'Database với GORM', 'Microservices architecture'],
    chapters: [
      { title: 'Go Fundamentals', lessons: [
        { title: 'Giới thiệu Go', type: 'video', duration: '12:00' },
        { title: 'Biến và kiểu dữ liệu', type: 'video', duration: '15:00' },
        { title: 'Functions và Methods', type: 'video', duration: '18:00' },
        { title: 'Quiz Go cơ bản', type: 'quiz' },
      ]},
      { title: 'Concurrency', lessons: [
        { title: 'Goroutines', type: 'video', duration: '20:00' },
        { title: 'Channels', type: 'video', duration: '18:00' },
        { title: 'Mutex và WaitGroup', type: 'video', duration: '15:00' },
        { title: 'Bài tập Concurrency', type: 'exercise' },
        { title: 'Quiz Concurrency', type: 'quiz' },
      ]},
      { title: 'Web Development', lessons: [
        { title: 'Gin Framework', type: 'video', duration: '25:00' },
        { title: 'RESTful API', type: 'video', duration: '22:00' },
        { title: 'GORM Database', type: 'video', duration: '20:00' },
        { title: 'Quiz Web Dev', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'UI/UX Design Masterclass với Figma',
    categoryId: 2,
    instructorId: 4,
    price: 799000,
    description: 'Khóa học thiết kế UI/UX toàn diện với Figma. Học cách tạo giao diện đẹp mắt, user experience tốt và design system chuyên nghiệp.',
    level: 'Trung cấp',
    duration: '28 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    requirements: ['Biết cơ bản về thiết kế', 'Có máy tính cài Figma'],
    learningOutcomes: ['Thành thạo Figma', 'Design System và Components', 'UX Research và Wireframe', 'Prototyping chuyên nghiệp'],
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
    title: 'Adobe Photoshop CC Complete',
    categoryId: 2,
    instructorId: 3,
    price: 549000,
    description: 'Khóa học Photoshop toàn diện từ cơ bản đến nâng cao. Học retouch ảnh, thiết kế đồ họa, banner và marketing materials.',
    level: 'Cơ bản',
    duration: '22 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    requirements: ['Máy tính cài Photoshop CC', 'Yêu thích thiết kế đồ họa'],
    learningOutcomes: ['Photoshop tools và techniques', 'Image retouching', 'Graphic design', 'Social media templates'],
    chapters: [
      { title: 'Photoshop Basics', lessons: [
        { title: 'Giao diện Photoshop', type: 'video', duration: '10:00' },
        { title: 'Tools cơ bản', type: 'video', duration: '20:00' },
        { title: 'Layers và Masks', type: 'video', duration: '18:00' },
        { title: 'Quiz Photoshop cơ bản', type: 'quiz' },
      ]},
      { title: 'Image Editing', lessons: [
        { title: 'Color Correction', type: 'video', duration: '20:00' },
        { title: 'Retouching', type: 'video', duration: '22:00' },
        { title: 'Selection Techniques', type: 'video', duration: '18:00' },
        { title: 'Bài tập Image Editing', type: 'exercise' },
        { title: 'Quiz Image Editing', type: 'quiz' },
      ]},
      { title: 'Design Projects', lessons: [
        { title: 'Banner Design', type: 'video', duration: '25:00' },
        { title: 'Social Media Posts', type: 'video', duration: '20:00' },
        { title: 'Photo Manipulation', type: 'video', duration: '22:00' },
        { title: 'Quiz Design Projects', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Adobe Illustrator矢量图形设计',
    categoryId: 2,
    instructorId: 4,
    price: 599000,
    description: 'Học Adobe Illustrator để tạo logo, icon, illustration và矢量图形. Thiết kế đồ họa chuyên nghiệp cho thương hiệu.',
    level: 'Trung cấp',
    duration: '24 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&h=400&fit=crop',
    requirements: ['Máy tính cài Illustrator', 'Hiểu cơ bản về design'],
    learningOutcomes: ['Illustrator tools', 'Logo và brand design', 'Illustration techniques', 'Vector graphics'],
    chapters: [
      { title: 'Illustrator Basics', lessons: [
        { title: 'Giao diện Illustrator', type: 'video', duration: '10:00' },
        { title: 'Pen Tool và Shapes', type: 'video', duration: '20:00' },
        { title: 'Color và Gradients', type: 'video', duration: '15:00' },
        { title: 'Quiz Illustrator cơ bản', type: 'quiz' },
      ]},
      { title: 'Vector Design', lessons: [
        { title: 'Logo Design', type: 'video', duration: '25:00' },
        { title: 'Icon Design', type: 'video', duration: '20:00' },
        { title: 'Illustration', type: 'video', duration: '22:00' },
        { title: 'Bài tập Vector Design', type: 'exercise' },
        { title: 'Quiz Vector Design', type: 'quiz' },
      ]},
      { title: 'Brand Identity', lessons: [
        { title: 'Brand Guidelines', type: 'video', duration: '20:00' },
        { title: 'Print Design', type: 'video', duration: '18:00' },
        { title: 'Packaging Design', type: 'video', duration: '22:00' },
        { title: 'Quiz Brand Identity', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Motion Graphics với After Effects',
    categoryId: 2,
    instructorId: 3,
    price: 849000,
    description: 'Khóa học After Effects để tạo motion graphics, video effects và animations. Làm video quảng cáo, intro/outro chuyên nghiệp.',
    level: 'Nâng cao',
    duration: '35 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=400&fit=crop',
    requirements: ['Biết cơ bản Adobe Suite', 'Có máy tính mạnh'],
    learningOutcomes: ['After Effects essentials', 'Animation principles', 'VFX và compositing', 'Video production'],
    chapters: [
      { title: 'After Effects Basics', lessons: [
        { title: 'Giao diện After Effects', type: 'video', duration: '12:00' },
        { title: 'Composition và Layers', type: 'video', duration: '18:00' },
        { title: 'Keyframes Animation', type: 'video', duration: '20:00' },
        { title: 'Quiz AE cơ bản', type: 'quiz' },
      ]},
      { title: 'Motion Graphics', lessons: [
        { title: 'Text Animation', type: 'video', duration: '25:00' },
        { title: 'Shape Layers', type: 'video', duration: '22:00' },
        { title: 'Expressions', type: 'video', duration: '20:00' },
        { title: 'Bài tập Motion Graphics', type: 'exercise' },
        { title: 'Quiz Motion Graphics', type: 'quiz' },
      ]},
      { title: 'VFX và Compositing', lessons: [
        { title: 'Green Screen', type: 'video', duration: '20:00' },
        { title: 'Tracking', type: 'video', duration: '25:00' },
        { title: 'Color Grading', type: 'video', duration: '18:00' },
        { title: 'Quiz VFX', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Brand Identity Design - Xây dựng thương hiệu',
    categoryId: 2,
    instructorId: 4,
    price: 699000,
    description: 'Khóa học xây dựng brand identity hoàn chỉnh. Từ nghiên cứu thương hiệu đến thiết kế logo, color palette và brand guidelines.',
    level: 'Trung cấp',
    duration: '26 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
    requirements: ['Biết Illustrator/Photoshop', 'Hiểu về marketing'],
    learningOutcomes: ['Brand strategy', 'Logo design', 'Brand guidelines', 'Visual identity system'],
    chapters: [
      { title: 'Brand Strategy', lessons: [
        { title: 'Brand Research', type: 'video', duration: '18:00' },
        { title: 'Positioning', type: 'video', duration: '15:00' },
        { title: 'Target Audience', type: 'video', duration: '12:00' },
        { title: 'Quiz Brand Strategy', type: 'quiz' },
      ]},
      { title: 'Logo Design', lessons: [
        { title: 'Logo Types', type: 'video', duration: '20:00' },
        { title: 'Logo Design Process', type: 'video', duration: '25:00' },
        { title: 'Logo variations', type: 'video', duration: '18:00' },
        { title: 'Bài tập Logo', type: 'exercise' },
        { title: 'Quiz Logo', type: 'quiz' },
      ]},
      { title: 'Brand Guidelines', lessons: [
        { title: 'Color System', type: 'video', duration: '20:00' },
        { title: 'Typography System', type: 'video', duration: '18:00' },
        { title: 'Brand Manual', type: 'video', duration: '25:00' },
        { title: 'Quiz Guidelines', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Digital Marketing Tổng Hợp 2024',
    categoryId: 3,
    instructorId: 3,
    price: 449000,
    description: 'Khóa học Digital Marketing toàn diện bao gồm SEO, Google Ads, Facebook Ads, Content Marketing và Email Marketing.',
    level: 'Cơ bản',
    duration: '30 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1557838923-2985c318be48?w=600&h=400&fit=crop',
    requirements: ['Không yêu cầu kinh nghiệm', 'Máy tính có kết nối internet'],
    learningOutcomes: ['Chiến lược Marketing tổng thể', 'Chạy quảng cáo hiệu quả', 'SEO website', 'Content và Email Marketing'],
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
    title: 'SEO Master - Tối ưu công cụ tìm kiếm',
    categoryId: 3,
    instructorId: 4,
    price: 599000,
    description: 'Khóa học SEO chuyên sâu. Học On-page SEO, Off-page SEO, technical SEO và xây dựng chiến lược SEO hiệu quả.',
    level: 'Trung cấp',
    duration: '28 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop',
    requirements: ['Biết cơ bản HTML', 'Có website để thực hành'],
    learningOutcomes: ['On-page và Off-page SEO', 'Technical SEO', 'Keyword research', 'SEO analytics'],
    chapters: [
      { title: 'SEO Fundamentals', lessons: [
        { title: 'How Google Works', type: 'video', duration: '15:00' },
        { title: 'Keyword Research', type: 'video', duration: '20:00' },
        { title: 'SEO Tools', type: 'video', duration: '18:00' },
        { title: 'Quiz SEO Fundamentals', type: 'quiz' },
      ]},
      { title: 'On-Page SEO', lessons: [
        { title: 'Title và Meta Tags', type: 'video', duration: '20:00' },
        { title: 'Content Optimization', type: 'video', duration: '22:00' },
        { title: 'Internal Linking', type: 'video', duration: '15:00' },
        { title: 'Bài tập On-Page', type: 'exercise' },
        { title: 'Quiz On-Page', type: 'quiz' },
      ]},
      { title: 'Technical SEO', lessons: [
        { title: 'Site Speed', type: 'video', duration: '20:00' },
        { title: 'Mobile SEO', type: 'video', duration: '18:00' },
        { title: 'Schema Markup', type: 'video', duration: '15:00' },
        { title: 'Quiz Technical SEO', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Facebook & Instagram Ads',
    categoryId: 3,
    instructorId: 3,
    price: 499000,
    description: 'Học chạy quảng cáo Facebook và Instagram Ads từ cơ bản đến nâng cao. Tối ưu chiến dịch, targeting và đo lường hiệu quả.',
    level: 'Cơ bản',
    duration: '20 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop',
    requirements: ['Có tài khoản Facebook Business', 'Hiểu cơ bản về marketing'],
    learningOutcomes: ['Facebook Ads Manager', 'Audience targeting', 'Campaign optimization', 'Analytics và reporting'],
    chapters: [
      { title: 'Facebook Ads Basics', lessons: [
        { title: 'Facebook Business Manager', type: 'video', duration: '12:00' },
        { title: 'Ad Formats', type: 'video', duration: '18:00' },
        { title: 'Campaign Structure', type: 'video', duration: '15:00' },
        { title: 'Quiz Facebook Ads', type: 'quiz' },
      ]},
      { title: 'Targeting & Optimization', lessons: [
        { title: 'Audience Targeting', type: 'video', duration: '20:00' },
        { title: 'Retargeting', type: 'video', duration: '18:00' },
        { title: 'A/B Testing', type: 'video', duration: '15:00' },
        { title: 'Bài tập Targeting', type: 'exercise' },
        { title: 'Quiz Targeting', type: 'quiz' },
      ]},
      { title: 'Analytics', lessons: [
        { title: 'Facebook Analytics', type: 'video', duration: '20:00' },
        { title: 'Conversion Tracking', type: 'video', duration: '18:00' },
        { title: 'ROI Calculation', type: 'video', duration: '15:00' },
        { title: 'Quiz Analytics', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Content Marketing & Copywriting',
    categoryId: 3,
    instructorId: 4,
    price: 399000,
    description: 'Khóa học viết content và copywriting hiệu quả. Học cách tạo nội dung thu hút, SEO content và copywriting cho marketing.',
    level: 'Cơ bản',
    duration: '18 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    requirements: ['Yêu thích viết lách', 'Máy tính có kết nối internet'],
    learningOutcomes: ['Content strategy', 'SEO writing', 'Copywriting techniques', 'Content distribution'],
    chapters: [
      { title: 'Content Strategy', lessons: [
        { title: 'Content Planning', type: 'video', duration: '12:00' },
        { title: 'Content Types', type: 'video', duration: '15:00' },
        { title: 'Content Calendar', type: 'video', duration: '10:00' },
        { title: 'Quiz Content Strategy', type: 'quiz' },
      ]},
      { title: 'Copywriting', lessons: [
        { title: 'Copywriting Fundamentals', type: 'video', duration: '18:00' },
        { title: 'Headlines & Hooks', type: 'video', duration: '15:00' },
        { title: 'Call to Action', type: 'video', duration: '12:00' },
        { title: 'Bài tập Copywriting', type: 'exercise' },
        { title: 'Quiz Copywriting', type: 'quiz' },
      ]},
      { title: 'SEO Content', lessons: [
        { title: 'Keyword Integration', type: 'video', duration: '15:00' },
        { title: 'Content Optimization', type: 'video', duration: '18:00' },
        { title: 'Content Distribution', type: 'video', duration: '12:00' },
        { title: 'Quiz SEO Content', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Startup Business - Từ ý tưởng đến thành công',
    categoryId: 4,
    instructorId: 3,
    price: 899000,
    description: 'Khóa học khởi nghiệp toàn diện. Từ việc tìm kiếm ý tưởng, lập kế hoạch kinh doanh, gọi vốn đến quản lý startup thành công.',
    level: 'Cơ bản',
    duration: '35 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
    requirements: ['Có ý tưởng kinh doanh', 'Đam mê khởi nghiệp'],
    learningOutcomes: ['Lean startup methodology', 'Business model canvas', 'Fundraising strategies', 'Team building'],
    chapters: [
      { title: 'Startup Fundamentals', lessons: [
        { title: 'What is Startup?', type: 'video', duration: '12:00' },
        { title: 'Ideation', type: 'video', duration: '18:00' },
        { title: 'Market Validation', type: 'video', duration: '15:00' },
        { title: 'Quiz Startup Fundamentals', type: 'quiz' },
      ]},
      { title: 'Business Model', lessons: [
        { title: 'Business Model Canvas', type: 'video', duration: '25:00' },
        { title: 'Value Proposition', type: 'video', duration: '20:00' },
        { title: 'Revenue Model', type: 'video', duration: '18:00' },
        { title: 'Bài tập Business Model', type: 'exercise' },
        { title: 'Quiz Business Model', type: 'quiz' },
      ]},
      { title: 'Fundraising', lessons: [
        { title: 'Investment Terms', type: 'video', duration: '20:00' },
        { title: 'Pitch Deck', type: 'video', duration: '25:00' },
        { title: 'VC và Angel Investors', type: 'video', duration: '18:00' },
        { title: 'Quiz Fundraising', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Quản lý Dự án Agile/Scrum',
    categoryId: 4,
    instructorId: 4,
    price: 649000,
    description: 'Học quản lý dự án với Agile và Scrum. Nắm vững sprint planning, daily standup, retrospective và các công cụ quản lý hiện đại.',
    level: 'Trung cấp',
    duration: '24 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&h=400&fit=crop',
    requirements: ['Có kinh nghiệm làm việc nhóm', 'Hiểu cơ bản về development'],
    learningOutcomes: ['Agile methodology', 'Scrum framework', 'Sprint management', 'Product backlog'],
    chapters: [
      { title: 'Agile Fundamentals', lessons: [
        { title: 'Agile Manifesto', type: 'video', duration: '12:00' },
        { title: 'Agile Principles', type: 'video', duration: '18:00' },
        { title: 'Scrum Overview', type: 'video', duration: '15:00' },
        { title: 'Quiz Agile', type: 'quiz' },
      ]},
      { title: 'Scrum Framework', lessons: [
        { title: 'Roles: PO, SM, Team', type: 'video', duration: '20:00' },
        { title: 'Sprint Planning', type: 'video', duration: '22:00' },
        { title: 'Daily Standup', type: 'video', duration: '15:00' },
        { title: 'Bài tập Scrum', type: 'exercise' },
        { title: 'Quiz Scrum', type: 'quiz' },
      ]},
      { title: 'Scrum Events', lessons: [
        { title: 'Sprint Review', type: 'video', duration: '18:00' },
        { title: 'Sprint Retrospective', type: 'video', duration: '15:00' },
        { title: 'Product Backlog', type: 'video', duration: '20:00' },
        { title: 'Quiz Scrum Events', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Leadership - Nghệ thuật lãnh đạo',
    categoryId: 4,
    instructorId: 3,
    price: 749000,
    description: 'Khóa học phát triển kỹ năng lãnh đạo. Học cách dẫn dắt đội nhóm, giao tiếp hiệu quả và tạo văn hóa doanh nghiệp tích cực.',
    level: 'Trung cấp',
    duration: '22 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
    requirements: ['Có kinh nghiệm quản lý hoặc muốn phát triển'],
    learningOutcomes: ['Leadership skills', 'Team management', 'Communication', 'Decision making'],
    chapters: [
      { title: 'Leadership Basics', lessons: [
        { title: 'Leadership Styles', type: 'video', duration: '15:00' },
        { title: 'Self-Awareness', type: 'video', duration: '18:00' },
        { title: 'Emotional Intelligence', type: 'video', duration: '20:00' },
        { title: 'Quiz Leadership', type: 'quiz' },
      ]},
      { title: 'Team Management', lessons: [
        { title: 'Building Teams', type: 'video', duration: '22:00' },
        { title: 'Motivation', type: 'video', duration: '20:00' },
        { title: 'Delegation', type: 'video', duration: '15:00' },
        { title: 'Bài tập Team Management', type: 'exercise' },
        { title: 'Quiz Team Management', type: 'quiz' },
      ]},
      { title: 'Communication', lessons: [
        { title: 'Effective Communication', type: 'video', duration: '20:00' },
        { title: 'Feedback', type: 'video', duration: '18:00' },
        { title: 'Conflict Resolution', type: 'video', duration: '15:00' },
        { title: 'Quiz Communication', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Sales & Negotiation Skills',
    categoryId: 4,
    instructorId: 4,
    price: 549000,
    description: 'Khóa học kỹ năng bán hàng và đàm phán. Học chiến lược sales, kỹ thuật đàm phán và chốt deal hiệu quả.',
    level: 'Cơ bản',
    duration: '18 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1556745757-8d76bdb698e0?w=600&h=400&fit=crop',
    requirements: ['Muốn phát triển kỹ năng bán hàng', 'Máy tính có kết nối internet'],
    learningOutcomes: ['Sales process', 'Customer handling', 'Negotiation techniques', 'Closing deals'],
    chapters: [
      { title: 'Sales Fundamentals', lessons: [
        { title: 'Sales Process', type: 'video', duration: '12:00' },
        { title: 'Customer Discovery', type: 'video', duration: '15:00' },
        { title: 'Presentation Skills', type: 'video', duration: '18:00' },
        { title: 'Quiz Sales', type: 'quiz' },
      ]},
      { title: 'Negotiation', lessons: [
        { title: 'Negotiation Basics', type: 'video', duration: '18:00' },
        { title: 'Handling Objections', type: 'video', duration: '20:00' },
        { title: 'Closing Techniques', type: 'video', duration: '15:00' },
        { title: 'Bài tập Negotiation', type: 'exercise' },
        { title: 'Quiz Negotiation', type: 'quiz' },
      ]},
      { title: 'Customer Relations', lessons: [
        { title: 'Account Management', type: 'video', duration: '15:00' },
        { title: 'Follow-up Strategies', type: 'video', duration: '12:00' },
        { title: 'Building Relationships', type: 'video', duration: '18:00' },
        { title: 'Quiz Customer Relations', type: 'quiz' },
      ]},
    ],
  },
  {
    title: 'Tài chính Cá nhân & Đầu tư',
    categoryId: 4,
    instructorId: 3,
    price: 399000,
    description: 'Khóa học tài chính cá nhân và đầu tư. Học quản lý tài chính, đầu tư chứng khoán, bất động sản và các chiến lược wealth building.',
    level: 'Cơ bản',
    duration: '16 giờ',
    imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&h=400&fit=crop',
    requirements: ['Muốn cải thiện tài chính cá nhân', 'Máy tính có kết nối internet'],
    learningOutcomes: ['Personal finance management', 'Investment basics', 'Stock market investing', 'Wealth building strategies'],
    chapters: [
      { title: 'Personal Finance', lessons: [
        { title: 'Budgeting', type: 'video', duration: '12:00' },
        { title: 'Saving Strategies', type: 'video', duration: '15:00' },
        { title: 'Debt Management', type: 'video', duration: '18:00' },
        { title: 'Quiz Personal Finance', type: 'quiz' },
      ]},
      { title: 'Investment Basics', lessons: [
        { title: 'Investment Vehicles', type: 'video', duration: '20:00' },
        { title: 'Risk Management', type: 'video', duration: '18:00' },
        { title: 'Portfolio Allocation', type: 'video', duration: '15:00' },
        { title: 'Bài tập Investment', type: 'exercise' },
        { title: 'Quiz Investment', type: 'quiz' },
      ]},
      { title: 'Stock Market', lessons: [
        { title: 'Stock Market Basics', type: 'video', duration: '18:00' },
        { title: 'Technical Analysis', type: 'video', duration: '20:00' },
        { title: 'Fundamental Analysis', type: 'video', duration: '22:00' },
        { title: 'Quiz Stock Market', type: 'quiz' },
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
      { title: 'Native Features', lessons: [
        { title: 'Camera và Location', type: 'video', duration: '20:00' },
        { title: 'Push Notifications', type: 'video', duration: '18:00' },
        { title: 'Publishing to Stores', type: 'video', duration: '22:00' },
        { title: 'Quiz Native Features', type: 'quiz' },
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
    // Find existing course by title
    const existingCourse = await prisma.course.findFirst({
      where: { title: template.title },
    });

    let course;
    if (existingCourse) {
      // Update existing course
      course = await prisma.course.update({
        where: { id: existingCourse.id },
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
    } else {
      // Create new course - skip if fails (e.g., duplicate title)
      try {
        course = await prisma.course.create({
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
        console.log(`  ✅ Created: ${template.title}`);
      } catch (error: any) {
        console.log(`  ⚠️  Skipped: ${template.title} (may already exist)`);
        continue;
      }
    }

    // Check if chapters already exist for this course
    const existingChapters = await prisma.chapter.findMany({
      where: { courseId: course.id },
    });

    if (existingChapters.length > 0) {
      console.log(`     (Chapters already exist, skipping)`);
      continue;
    }

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
        try {
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
        } catch (e) {
          console.log(`  ⚠️  Skipped assignment for: ${lesson.title}`);
        }
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
