import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all patients
export const getAllPatients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where = search
      ? {
          OR: [
            { firstName: { contains: String(search), mode: 'insensitive' as const } },
            { lastName: { contains: String(search), mode: 'insensitive' as const } },
            { phone: { contains: String(search) } },
            { email: { contains: String(search), mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [patients, total] = await Promise.all([
      prisma.patient.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      prisma.patient.count({ where }),
    ]);

    res.json({
      patients,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single patient
export const getPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        appointments: {
          orderBy: { date: 'desc' },
          take: 5,
        },
        medicalRecords: {
          orderBy: { date: 'desc' },
          take: 5,
        },
        invoices: {
          orderBy: { date: 'desc' },
          take: 5,
        },
      },
    });

    if (!patient) {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }

    res.json({ patient });
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create patient
export const createPatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      allergies,
      medicalServices,
      notes,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !dateOfBirth || !gender || !phone) {
      res.status(400).json({
        error: 'First name, last name, date of birth, gender, and phone are required',
      });
      return;
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        phone,
        email,
        address,
        emergencyContact,
        allergies,
        medicalServices,
        notes,
      },
    });

    res.status(201).json({
      message: 'Patient created successfully',
      patient,
    });
  } catch (error) {
    console.error('Create patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update patient
export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      phone,
      email,
      address,
      emergencyContact,
      allergies,
      medicalServices,
      notes,
    } = req.body;

    const patient = await prisma.patient.update({
      where: { id },
      data: {
        firstName,
        lastName,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        gender,
        phone,
        email,
        address,
        emergencyContact,
        allergies,
        medicalServices,
        notes,
      },
    });

    res.json({
      message: 'Patient updated successfully',
      patient,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    console.error('Update patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete patient
export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.patient.delete({
      where: { id },
    });

    res.json({ message: 'Patient deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Patient not found' });
      return;
    }
    console.error('Delete patient error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
