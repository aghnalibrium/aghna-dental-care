import { Request, Response } from 'express';
import prisma from '../config/database';

// Create public reservation
export const createPublicReservation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, service, date, time, medicalServices, message } = req.body;

    // Validate required fields
    if (!name || !phone || !service || !date || !time) {
      res.status(400).json({
        error: 'Name, phone, service, date, and time are required',
      });
      return;
    }

    // Split name into firstName and lastName
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ') || firstName;

    // Check if patient exists by phone or email
    let patient = await prisma.patient.findFirst({
      where: {
        OR: [
          { phone: phone },
          ...(email ? [{ email: email }] : []),
        ],
      },
    });

    // If patient doesn't exist, create new patient
    if (!patient) {
      patient = await prisma.patient.create({
        data: {
          firstName,
          lastName,
          phone,
          email: email || null,
          dateOfBirth: new Date('2000-01-01'), // Default date, can be updated later
          gender: 'OTHER', // Default gender, can be updated later
          medicalServices: medicalServices || null,
          notes: message || 'Patient created from online reservation',
        },
      });
    }

    // Get or create default doctor (you can modify this logic)
    let doctor = await prisma.user.findFirst({
      where: { role: 'DOCTOR' },
    });

    if (!doctor) {
      // If no doctor exists, use admin or staff
      doctor = await prisma.user.findFirst();
    }

    if (!doctor) {
      res.status(500).json({ error: 'No available doctor in the system' });
      return;
    }

    // Parse date and time
    const appointmentDate = new Date(date);
    const [hours, minutes] = time.split(':');
    const startTime = new Date(date);
    startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + 1); // Default 1 hour appointment

    // Check for overlapping appointments
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        date: appointmentDate,
        status: { not: 'CANCELLED' },
        OR: [
          {
            AND: [
              { startTime: { lte: startTime } },
              { endTime: { gt: startTime } },
            ],
          },
          {
            AND: [
              { startTime: { lt: endTime } },
              { endTime: { gte: endTime } },
            ],
          },
        ],
      },
    });

    if (existingAppointment) {
      res.status(400).json({ error: 'Time slot is already booked. Please choose another time.' });
      return;
    }

    // Create appointment
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId: doctor.id,
        date: appointmentDate,
        startTime,
        endTime,
        status: 'SCHEDULED',
        reason: service,
        notes: message || 'Online reservation',
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
      message: 'Reservation created successfully',
      appointment,
    });
  } catch (error) {
    console.error('Create public reservation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
