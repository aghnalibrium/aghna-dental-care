import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  DollarSign,
  UserCog,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/admin/patients', icon: Users },
    { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
    { name: 'Medical Records', href: '/admin/medical-records', icon: FileText },
    { name: 'Billing', href: '/admin/billing', icon: DollarSign },
    { name: 'Users', href: '/admin/users', icon: UserCog },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:relative
      `}>
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-yellow-50">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Aghna Dental Care"
                className="h-16 object-contain"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${active
                      ? 'bg-gradient-to-r from-blue-900 to-amber-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full inline-block">{user?.role}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:text-white hover:bg-red-600 bg-red-50 rounded-xl transition-all duration-200 shadow-sm"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-20 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:flex items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {navigation.find(nav => nav.href === location.pathname)?.name || 'Dashboard'}
              </h2>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 py-4 lg:px-6 lg:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
