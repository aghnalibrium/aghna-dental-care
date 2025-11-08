import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all medical records
export const getAllMedicalRecords = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 50, search, patientId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        {
          diagnosis: { contains: String(search), mode: 'insensitive' as const },
        },
        {
          patient: {
            OR: [
              { firstName: { contains: String(search), mode: 'insensitive' as const } },
              { lastName: { contains: String(search), mode: 'insensitive' as const } },
            ],
          },
        },
      ];
    }

    if (patientId) {
      where.patientId = String(patientId);
    }

    const [records, total] = await Promise.all([
      prisma.medicalRecord.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { date: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
            },
          },
          treatments: true,
        },
      }),
      prisma.medicalRecord.count({ where }),
    ]);

    res.json({
      records,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all medical records error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single medical record
export const getMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const record = await prisma.medicalRecord.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            dateOfBirth: true,
            gender: true,
            phone: true,
            email: true,
            address: true,
            allergies: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        treatments: true,
      },
    });

    if (!record) {
      res.status(404).json({ error: 'Medical record not found' });
      return;
    }

    res.json({ record });
  } catch (error) {
    console.error('Get medical record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create medical record
export const createMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, diagnosis, symptoms, treatment, prescription, notes } = req.body;

    // Validate required fields
    if (!patientId || !diagnosis || !treatment) {
      res.status(400).json({
        error: 'Patient ID, diagnosis, and treatment are required',
      });
      return;
    }

    // Get doctor ID from authenticated user
    const doctorId = req.user?.userId;

    if (!doctorId) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const record = await prisma.medicalRecord.create({
      data: {
        patientId,
        doctorId,
        diagnosis,
        symptoms: symptoms || null,
        treatment,
        prescription: prescription || null,
        notes: notes || null,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      message: 'Medical record created successfully',
      record,
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update medical record
export const updateMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { diagnosis, symptoms, treatment, prescription, notes } = req.body;

    const record = await prisma.medicalRecord.update({
      where: { id },
      data: {
        diagnosis,
        symptoms: symptoms || null,
        treatment,
        prescription: prescription || null,
        notes: notes || null,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      message: 'Medical record updated successfully',
      record,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Medical record not found' });
      return;
    }
    console.error('Update medical record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete medical record
export const deleteMedicalRecord = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.medicalRecord.delete({
      where: { id },
    });

    res.json({ message: 'Medical record deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Medical record not found' });
      return;
    }
    console.error('Delete medical record error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
