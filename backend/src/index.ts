import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';
import appointmentRoutes from './routes/appointment.routes';
import medicalRecordRoutes from './routes/medical-record.routes';
import invoiceRoutes from './routes/invoice.routes';
import publicRoutes from './routes/public.routes';
import userRoutes from './routes/user.routes';
import reviewsRoutes from './routes/reviews.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Dental Clinic Dashboard API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      auth: '/api/auth',
      patients: '/api/patients',
      appointments: '/api/appointments',
      medicalRecords: '/api/medical-records',
      invoices: '/api/invoices',
      users: '/api/users',
      reviews: '/api/reviews',
      public: '/api/public',
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/public', publicRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

export default app;
