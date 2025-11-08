import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@aghna-dental.com' },
    update: {},
    create: {
      email: 'admin@aghna-dental.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'ADMIN',
    },
  });

  console.log('✅ Admin user created:', admin.email);

  // Create sample doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10);

  const doctor = await prisma.user.upsert({
    where: { email: 'doctor@aghna-dental.com' },
    update: {},
    create: {
      email: 'doctor@aghna-dental.com',
      password: doctorPassword,
      name: 'Dr. Aghna',
      role: 'DOCTOR',
    },
  });

  console.log('✅ Doctor user created:', doctor.email);

  console.log('\n📝 Default Credentials:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin Login:');
  console.log('  Email: admin@aghna-dental.com');
  console.log('  Password: admin123');
  console.log('');
  console.log('Doctor Login:');
  console.log('  Email: doctor@aghna-dental.com');
  console.log('  Password: doctor123');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
