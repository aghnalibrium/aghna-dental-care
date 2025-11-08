# 🚀 Panduan Deployment - Aghna Dental Care

## 📋 Daftar Isi
1. [Persiapan](#persiapan)
2. [Deploy ke Vercel + Railway](#deploy-ke-vercel--railway-recommended)
3. [Deploy ke Railway Saja](#deploy-ke-railway-saja)
4. [Deploy ke Render](#deploy-ke-render)
5. [Troubleshooting](#troubleshooting)

---

## Persiapan

### 1. Push ke GitHub

```bash
# Inisialisasi Git (jika belum)
cd /Users/cokrodarsono/Documents/Saham/dental-clinic-dashboard
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit - Aghna Dental Care"

# Buat repository di GitHub terlebih dahulu, lalu:
git remote add origin https://github.com/USERNAME/aghna-dental-care.git
git branch -M main
git push -u origin main
```

---

## Deploy ke Vercel + Railway (RECOMMENDED) ⭐

### A. Deploy Backend ke Railway

1. **Buka Railway**
   - Kunjungi: https://railway.app
   - Klik **"Login"** dan pilih **"Login with GitHub"**

2. **Buat Project Baru**
   - Klik **"New Project"**
   - Pilih **"Deploy from GitHub repo"**
   - Pilih repository: `aghna-dental-care`

3. **Konfigurasi Backend**
   - Klik project yang baru dibuat
   - Klik **"Settings"**
   - Scroll ke **"Service"**
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`

4. **Tambahkan Environment Variables**
   - Klik tab **"Variables"**
   - Tambahkan variable berikut:

   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=file:./dev.db
   JWT_SECRET=ganti-dengan-random-string-yang-aman-123456789
   FRONTEND_URL=https://your-app.vercel.app
   ```

   > **PENTING:** Ganti `JWT_SECRET` dengan string random yang aman!
   > Ganti `FRONTEND_URL` setelah deploy frontend

5. **Generate Domain**
   - Klik tab **"Settings"**
   - Scroll ke **"Networking"** > **"Public Networking"**
   - Klik **"Generate Domain"**
   - **Salin URL** (contoh: `https://your-backend.railway.app`)
   - **URL ini akan digunakan di frontend!**

6. **Deploy!**
   - Railway akan otomatis deploy
   - Tunggu hingga status **"Success"**

### B. Deploy Frontend ke Vercel

1. **Buka Vercel**
   - Kunjungi: https://vercel.com
   - Klik **"Login"** dan pilih **"Continue with GitHub"**

2. **Import Project**
   - Klik **"Add New..."** > **"Project"**
   - Pilih repository: `aghna-dental-care`
   - Klik **"Import"**

3. **Konfigurasi Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

4. **Environment Variables**
   Klik **"Environment Variables"** dan tambahkan:

   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

   > **PENTING:** Ganti dengan URL backend dari Railway (langkah A.5)

5. **Deploy!**
   - Klik **"Deploy"**
   - Tunggu proses build selesai (±2-3 menit)
   - Vercel akan memberikan URL production: `https://your-app.vercel.app`

6. **Update Backend FRONTEND_URL**
   - Kembali ke Railway
   - Update variable `FRONTEND_URL` dengan URL Vercel
   - Railway akan otomatis redeploy

### ✅ Selesai! Website Anda Sudah Online!

---

## Deploy ke Railway Saja

Jika ingin deploy frontend + backend di Railway:

1. **Deploy Backend** (ikuti langkah A di atas)

2. **Deploy Frontend**
   - Klik **"New Project"** lagi di Railway
   - Pilih repository yang sama: `aghna-dental-care`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run preview`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-backend.railway.app
     ```

---

## Deploy ke Render

### Backend

1. Buka https://render.com
2. **New** > **Web Service**
3. Connect GitHub repository
4. **Konfigurasi:**
   - **Name:** aghna-dental-backend
   - **Root Directory:** `backend`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm start`
   - **Environment Variables:**
     ```
     NODE_ENV=production
     DATABASE_URL=file:./dev.db
     JWT_SECRET=your-secret-key
     FRONTEND_URL=https://your-frontend.onrender.com
     ```

### Frontend

1. **New** > **Static Site**
2. Connect repository
3. **Konfigurasi:**
   - **Name:** aghna-dental-frontend
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
   - **Environment Variables:**
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

---

## Troubleshooting

### CORS Error

Jika muncul CORS error, pastikan:
1. Backend `FRONTEND_URL` sesuai dengan URL frontend production
2. Frontend `VITE_API_URL` sesuai dengan URL backend production

### Database Error

Railway menggunakan SQLite, pastikan:
1. `DATABASE_URL=file:./dev.db` di environment variables
2. Prisma sudah di-generate: `npx prisma generate`

### Build Failed

Periksa:
1. `package.json` di folder backend dan frontend sudah benar
2. Dependencies sudah terinstall semua
3. Cek logs di platform deployment

### API Not Working

1. Test backend URL di browser: `https://your-backend.railway.app/health`
2. Harus return: `{"status":"healthy"}`
3. Jika error, cek logs di Railway/Render

---

## 🎉 Website Anda Sekarang Online!

- **Frontend:** https://your-app.vercel.app
- **Backend:** https://your-backend.railway.app
- **Database:** SQLite (otomatis di Railway)

### Custom Domain (Opsional)

#### Vercel:
1. **Settings** > **Domains**
2. Tambahkan domain Anda
3. Ikuti instruksi DNS

#### Railway:
1. **Settings** > **Networking**
2. **Custom Domain**
3. Tambahkan domain

---

## 📞 Support

Jika ada masalah deployment:
1. Cek logs di platform (Vercel/Railway)
2. Pastikan semua environment variables sudah benar
3. Test API endpoint di browser

**Happy Deploying! 🚀**
