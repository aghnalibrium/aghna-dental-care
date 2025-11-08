import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ArticlesPage } from './pages/ArticlesPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { LoginPage } from './pages/auth/LoginPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { PatientsPage } from './pages/patients/PatientsPage';
import { AppointmentsPage } from './pages/appointments/AppointmentsPage';
import { MedicalRecordsPage } from './pages/medical-records/MedicalRecordsPage';
import { BillingPage } from './pages/billing/BillingPage';
import { UsersPage } from './pages/users/UsersPage';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/consultation" element={<ConsultationPage />} />
          <Route path="/services/:serviceId" element={<ServiceDetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="medical-records" element={<MedicalRecordsPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="users" element={<UsersPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
