# Backend API - Dental Clinic Dashboard

Backend API untuk aplikasi dashboard klinik dokter gigi.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Bcrypt

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
# Edit .env dengan kredensial database Anda
```

3. Setup database PostgreSQL:
- Install PostgreSQL jika belum ada
- Buat database baru: `dental_clinic_db`

4. Run Prisma migrations:
```bash
npm run prisma:migrate
```

5. Start development server:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server dengan hot reload
- `npm run build` - Build TypeScript ke JavaScript
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (GUI untuk database)

## API Endpoints

### Health Check
- `GET /` - API info
- `GET /health` - Health check endpoint

### Authentication (Coming soon)
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Patients (Coming soon)
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments (Coming soon)
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Medical Records (Coming soon)
- `GET /api/medical-records/:patientId` - Get patient medical records
- `POST /api/medical-records` - Create medical record

### Billing (Coming soon)
- `GET /api/billing` - Get all invoices
- `POST /api/billing` - Create invoice
- `PUT /api/billing/:id` - Update invoice

## Database Schema

Lihat `prisma/schema.prisma` untuk detail schema database.
