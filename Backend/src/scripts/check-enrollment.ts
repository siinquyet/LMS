import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId: 1 },
    include: { course: { select: { id: true, title: true } } }
  });
  console.log('Enrollments for user 1:', JSON.stringify(enrollments, null, 2));
}

main()
  .then(() => prisma.$disconnect())
  .catch(console.error);