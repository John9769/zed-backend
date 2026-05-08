const prisma = require('../src/lib/prisma');
const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('zed@admin2026', 10);
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@zed.my' },
    update: {},
    create: {
      name: 'ZED Admin',
      email: 'admin@zed.my',
      passwordHash: hash,
      role: 'SUPER_ADMIN'
    }
  });
  console.log('Admin seeded:', admin.email);
}

main().catch(console.error).finally(() => prisma.$disconnect());