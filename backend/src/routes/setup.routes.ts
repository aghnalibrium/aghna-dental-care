import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

// One-time setup endpoint to create first admin user
router.post('/init-admin', async (req: Request, res: Response) => {
  try {
    // Check if any users already exist
    const userCount = await prisma.user.count();

    if (userCount > 0) {
      return res.status(400).json({
        error: 'Setup already completed. Users already exist in the database.'
      });
    }

    // Create admin user with provided credentials or defaults
    const { email, password, name } = req.body;

    const adminEmail = email || 'admin@aghna-dental.com';
    const adminPassword = password || 'admin123';
    const adminName = name || 'Administrator';

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        role: 'ADMIN',
      },
    });

    // Also create a doctor user
    const doctorPassword = await bcrypt.hash('doctor123', 10);
    await prisma.user.create({
      data: {
        email: 'doctor@aghna-dental.com',
        password: doctorPassword,
        name: 'Dr. Aghna',
        role: 'DOCTOR',
      },
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      credentials: {
        admin: {
          email: adminEmail,
          password: adminPassword,
        },
        doctor: {
          email: 'doctor@aghna-dental.com',
          password: 'doctor123',
        }
      },
      warning: 'Please change the default password after first login!'
    });
  } catch (error: any) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Failed to create admin user', details: error.message });
  }
});

export default router;
