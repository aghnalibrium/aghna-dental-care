import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';

interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason?: string;
  notes?: string;
  patient?: {
    id: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  doctor?: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate]);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/appointments', {
        params: { date: selectedDate },
      });
      setAppointments(response.data.appointments);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: Appointment['status']) => {
    const colors = {
      SCHEDULED: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300',
      CONFIRMED: 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border border-green-300',
      IN_PROGRESS: 'bg-gradient-to-r from-yellow-100 to-amber-200 text-yellow-800 border border-yellow-300',
      COMPLETED: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border border-gray-300',
      CANCELLED: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300',
      NO_SHOW: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border border-purple-300',
    };
    return colors[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-gray-600 mt-2">Manage your clinic appointments</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold">
          <Plus className="h-5 w-5 mr-2" />
          New Appointment
        </button>
      </div>

      {/* Date Filter */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-gray-700">
            <CalendarIcon className="h-5 w-5 mr-2 text-amber-600" />
            <span className="font-semibold">Select Date:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="px-6 py-16 text-center text-gray-500">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-3"></div>
              <p className="font-medium">Loading appointments...</p>
            </div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="px-6 py-16 text-center text-gray-500">
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <CalendarIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="font-medium text-gray-900">No appointments scheduled</p>
              <p className="text-sm text-gray-500 mt-1">No appointments for this date</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold shadow-md">
                        {appointment.patient?.firstName?.charAt(0)}{appointment.patient?.lastName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {appointment.patient?.firstName} {appointment.patient?.lastName}
                        </h3>
                        <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                    <div className="ml-15 space-y-2 text-sm text-gray-600">
                      <p className="flex items-center">
                        <span className="font-semibold text-gray-700 w-20">Time:</span>
                        <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                      </p>
                      <p className="flex items-center">
                        <span className="font-semibold text-gray-700 w-20">Doctor:</span>
                        <span>{appointment.doctor?.name}</span>
                      </p>
                      {appointment.reason && (
                        <p className="flex items-start">
                          <span className="font-semibold text-gray-700 w-20">Reason:</span>
                          <span>{appointment.reason}</span>
                        </p>
                      )}
                      {appointment.notes && (
                        <p className="flex items-start">
                          <span className="font-semibold text-gray-700 w-20">Notes:</span>
                          <span>{appointment.notes}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 ml-4">
                    <button className="px-5 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-all duration-200">
                      Edit
                    </button>
                    <button className="px-5 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-all duration-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
