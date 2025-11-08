# Dashboard Klinik Dokter Gigi

Dashboard manajemen lengkap untuk klinik dokter gigi dengan fitur-fitur modern.

## Fitur Yang Sudah Dibangun

### ✅ Backend API (Completed)
- **Authentication System**: Register, Login, JWT middleware
- **Patient Management**: CRUD operations untuk data pasien
- **Appointment Scheduling**: CRUD operations untuk jadwal appointment

### ✅ Frontend UI (Completed)
- **Dashboard Layout**: Sidebar navigation, responsive design
- **Login Page**: Authentication dengan form validation
- **Dashboard Page**: Overview dengan statistics cards
- **Patients Page**: List pasien dengan search functionality
- **Appointments Page**: List appointment dengan date filter

### 🚧 Coming Soon
- Medical Records Module
- Billing & Invoice Module
- Dashboard Analytics dengan charts
- Form untuk Create/Edit Patient
- Form untuk Create/Edit Appointment

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- shadcn/ui (UI components)
- React Router (Navigation)
- Zustand (State management)
- Axios (HTTP client)
- React Query (Data fetching)

### Backend
- Node.js + Express
- TypeScript
- PostgreSQL (Database)
- Prisma ORM
- JWT Authentication
- Bcrypt (Password hashing)

## Struktur Project

```
dental-clinic-dashboard/
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   ├── lib/             # Utilities & API client
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── routes/          # API routes
│   │   ├── middlewares/     # Auth & other middlewares
│   │   ├── config/          # Database config
│   │   └── utils/           # Utility functions
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** v18 atau lebih tinggi
- **PostgreSQL** v14 atau lebih tinggi
- **npm** atau **yarn**

## Quick Start Guide

### 1. Setup Database

Pastikan PostgreSQL sudah ter-install dan berjalan.

```bash
# Buat database baru
createdb dental_clinic_db

# Atau melalui psql
psql -U postgres
CREATE DATABASE dental_clinic_db;
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env dengan kredensial database Anda

# Run Prisma migrations
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate

# Start development server
npm run dev
```

Backend akan berjalan di `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dental_clinic_db?schema=public"
JWT_SECRET=dental-clinic-super-secret-key-2024
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Patients
- `GET /api/patients` - Get all patients (with pagination & search)
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Appointments
- `GET /api/appointments` - Get all appointments (with filters)
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## Database Schema

Database menggunakan 8 models:
1. **User** - Authentication (Admin, Doctor, Staff)
2. **Patient** - Data pasien
3. **Appointment** - Jadwal appointment
4. **MedicalRecord** - Rekam medis
5. **Treatment** - Prosedur gigi spesifik
6. **Invoice** - Tagihan
7. **InvoiceItem** - Detail item tagihan
8. **Payment** - Pembayaran

Lihat `backend/prisma/schema.prisma` untuk detail lengkap.

## First Time Setup - Create Admin User

Setelah setup selesai, buat user admin untuk login:

```bash
# Gunakan Prisma Studio (GUI)
cd backend
npm run prisma:studio

# Atau gunakan API endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123",
    "name": "Admin",
    "role": "ADMIN",
    "phone": "08123456789"
  }'
```

## Scripts

### Backend
- `npm run dev` - Start development server dengan hot reload
- `npm run build` - Build TypeScript ke JavaScript
- `npm start` - Start production server
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend
- `npm run dev` - Start development server dengan hot reload
- `npm run build` - Build untuk production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Development Tips

1. **Gunakan Prisma Studio** untuk manage database secara visual
   ```bash
   cd backend && npm run prisma:studio
   ```

2. **Test API menggunakan curl atau Postman**
   - Endpoint tersedia di `http://localhost:5000`
   - Dokumentasi API di `http://localhost:5000/`

3. **Hot Reload** aktif di frontend dan backend - perubahan langsung ter-apply

## Troubleshooting

### Database Connection Error
- Pastikan PostgreSQL berjalan
- Check kredensial di `.env`
- Pastikan database `dental_clinic_db` sudah dibuat

### Port Already in Use
- Backend default: 5000
- Frontend default: 5173
- Ubah di `.env` jika port bentrok

### Prisma Error
```bash
# Reset database (WARNING: akan hapus semua data)
cd backend
npx prisma migrate reset

# Re-generate Prisma Client
npm run prisma:generate
```

## Next Steps

1. ✅ Setup database dan run migrations
2. ✅ Create admin user pertama
3. ✅ Login ke dashboard
4. ✅ Test fitur patients dan appointments
5. 🚧 Implement create/edit forms
6. 🚧 Build medical records module
7. 🚧 Build billing module
8. 🚧 Add dashboard analytics

## License

Private project - All rights reserved
