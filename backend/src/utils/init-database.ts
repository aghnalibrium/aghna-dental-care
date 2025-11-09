import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function initDatabase() {
  try {
    // Check if admin user exists
    const adminExists = await prisma.user.findUnique({
      where: { email: 'admin@aghna-dental.com' },
    });

    if (!adminExists) {
      console.log('📝 Initializing database with default users...');

      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          email: 'admin@aghna-dental.com',
          password: hashedPassword,
          name: 'Administrator',
          role: 'ADMIN',
        },
      });

      // Create doctor user
      const doctorPassword = await bcrypt.hash('doctor123', 10);
      await prisma.user.create({
        data: {
          email: 'doctor@aghna-dental.com',
          password: doctorPassword,
          name: 'Dr. Aghna',
          role: 'DOCTOR',
        },
      });

      console.log('✅ Default users created successfully');
      console.log('   Admin: admin@aghna-dental.com / admin123');
      console.log('   Doctor: doctor@aghna-dental.com / doctor123');
    } else {
      console.log('✅ Database already initialized');
    }
  } catch (error) {
    console.error('❌ Database initialization error:', error);
  }
}
