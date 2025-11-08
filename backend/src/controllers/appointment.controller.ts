import { Request, Response } from 'express';
import prisma from '../config/database';

// Get all appointments
export const getAllAppointments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, status, doctorId, patientId } = req.query;

    const where: any = {};
    if (date) {
      const startOfDay = new Date(date as string);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date as string);
      endOfDay.setHours(23, 59, 59, 999);
      where.date = { gte: startOfDay, lte: endOfDay };
    }
    if (status) where.status = status;
    if (doctorId) where.doctorId = doctorId;
    if (patientId) where.patientId = patientId;

    const appointments = await prisma.appointment.findMany({
      where,
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
            email: true,
          },
        },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });

    res.json({ appointments });
  } catch (error) {
    console.error('Get all appointments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single appointment
export const getAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!appointment) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }

    res.json({ appointment });
  } catch (error) {
    console.error('Get appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create appointment
export const createAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, doctorId, date, startTime, endTime, reason, notes } = req.body;

    // Validate required fields
    if (!patientId || !doctorId || !date || !startTime || !endTime) {
      res.status(400).json({
        error: 'Patient, doctor, date, start time, and end time are required',
      });
      return;
    }

    // Check for overlapping appointments
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId,
        date: new Date(date),
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startTime: { lte: new Date(startTime) } },
              { endTime: { gt: new Date(startTime) } },
            ],
          },
          {
            AND: [
              { startTime: { lt: new Date(endTime) } },
              { endTime: { gte: new Date(endTime) } },
            ],
          },
        ],
      },
    });

    if (existingAppointment) {
      res.status(400).json({ error: 'Time slot is already booked' });
      return;
    }

    const appointment = await prisma.appointment.create({
      data: {
        patientId,
        doctorId,
        date: new Date(date),
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        reason,
        notes,
        status: 'SCHEDULED',
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
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
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update appointment
export const updateAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, startTime, endTime, status, reason, notes } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: date ? new Date(date) : undefined,
        startTime: startTime ? new Date(startTime) : undefined,
        endTime: endTime ? new Date(endTime) : undefined,
        status,
        reason,
        notes,
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
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
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    console.error('Update appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete appointment
export const deleteAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id },
    });

    res.json({ message: 'Appointment deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    console.error('Delete appointment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
