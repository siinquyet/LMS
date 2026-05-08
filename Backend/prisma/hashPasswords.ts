import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function hashExistingPasswords() {
  console.log('Starting password hash migration...');

  const users = await prisma.user.findMany({
    where: {
      password: {
        not: /^\$2[aby]?\$/, // Not already hashed (bcrypt pattern)
      },
    },
  });

  console.log(`Found ${users.length} users with unhashed passwords`);

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    console.log(`Hashed password for user: ${user.email}`);
  }

  console.log('Password hash migration completed!');
}

hashExistingPasswords()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
