import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    where: { status: 'completed' },
    include: { instructor: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } }, category: { select: { id: true, name: true } } },
  });
  console.log('Courses:', courses.length);
  console.log(JSON.stringify(courses.slice(0,2), null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error);