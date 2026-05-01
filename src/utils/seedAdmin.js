require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('zed@admin2026', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@zed.my' },
    update: {},
    create: {
      name: 'Zed Super Admin',
      email: 'admin@zed.my',
      passwordHash,
      role: 'SUPER_ADMIN'
    }
  });

  console.log('Super admin seeded:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());