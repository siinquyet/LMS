import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const courses = await prisma.course.findMany({
    select: { id: true, title: true, status: true },
  });
  console.log(JSON.stringify(courses, null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error);