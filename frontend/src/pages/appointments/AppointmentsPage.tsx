import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Calendar as CalendarIcon, X, MessageCircle } from 'lucide-react';

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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEditClick = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsEditModalOpen(true);
  };

  const handleUpdateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppointment) return;

    const previousStatus = appointments.find(a => a.id === editingAppointment.id)?.status;
    const isNewlyConfirmed = previousStatus !== 'CONFIRMED' && editingAppointment.status === 'CONFIRMED';

    try {
      setIsSaving(true);
      setError('');
      await api.put(`/appointments/${editingAppointment.id}`, editingAppointment);
      await fetchAppointments();
      setIsEditModalOpen(false);
      setEditingAppointment(null);

      // Auto-send WhatsApp notification if appointment is newly confirmed
      if (isNewlyConfirmed) {
        setTimeout(() => {
          if (confirm('Appointment confirmed! Send WhatsApp notification to patient?')) {
            sendWhatsAppNotification(editingAppointment);
          }
        }, 300);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update appointment');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      await api.put(`/appointments/${id}`, { status: 'CANCELLED' });
      await fetchAppointments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel appointment');
    }
  };

  const sendWhatsAppNotification = (appointment: Appointment) => {
    if (!appointment.patient?.phone) {
      alert('Patient phone number not available');
      return;
    }

    // Format phone number (remove leading 0 if exists and add country code)
    let phoneNumber = appointment.patient.phone.replace(/\D/g, '');
    if (phoneNumber.startsWith('0')) {
      phoneNumber = '62' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('62')) {
      phoneNumber = '62' + phoneNumber;
    }

    // Format date and time
    const appointmentDate = new Date(appointment.date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const startTime = formatTime(appointment.startTime);
    const endTime = formatTime(appointment.endTime);

    // Create WhatsApp message
    const message = `🦷 *KONFIRMASI APPOINTMENT - AGHNA DENTAL CARE*

Halo ${appointment.patient.firstName} ${appointment.patient.lastName},

Appointment Anda telah *DIKONFIRMASI* ✅

📅 *Tanggal:* ${appointmentDate}
⏰ *Waktu:* ${startTime} - ${endTime}
👨‍⚕️ *Dokter:* ${appointment.doctor?.name || 'TBA'}
${appointment.reason ? `📋 *Keperluan:* ${appointment.reason}` : ''}

📍 *Lokasi:*
Jl. Perumahan Griya Hinggil No.D2
Bantul, DIY

📞 *Kontak:*
+62 857-6938-2624

*PENTING:*
- Harap datang 10 menit lebih awal
- Jika berhalangan, mohon konfirmasi minimal 1 hari sebelumnya
- Bawa kartu identitas dan hasil pemeriksaan sebelumnya (jika ada)

Terima kasih! Kami tunggu kedatangan Anda. 😊

---
*Aghna Dental Care*
_Senyum Sehat, Hidup Berkah_ 🦷✨`;

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
                    <button
                      onClick={() => handleEditClick(appointment)}
                      className="px-5 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-all duration-200"
                    >
                      Edit
                    </button>
                    {appointment.status === 'CONFIRMED' && (
                      <button
                        onClick={() => sendWhatsAppNotification(appointment)}
                        className="flex items-center justify-center px-5 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-all duration-200"
                        title="Send WhatsApp confirmation to patient"
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        WhatsApp
                      </button>
                    )}
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="px-5 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && editingAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-yellow-600 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Edit Appointment</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingAppointment(null);
                }}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateAppointment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Patient
                </label>
                <input
                  type="text"
                  value={`${editingAppointment.patient?.firstName} ${editingAppointment.patient?.lastName}`}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={editingAppointment.date.split('T')[0]}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      date: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={new Date(editingAppointment.startTime).toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const date = new Date(editingAppointment.date);
                      date.setHours(parseInt(hours), parseInt(minutes));
                      setEditingAppointment({
                        ...editingAppointment,
                        startTime: date.toISOString(),
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={new Date(editingAppointment.endTime).toTimeString().slice(0, 5)}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':');
                      const date = new Date(editingAppointment.date);
                      date.setHours(parseInt(hours), parseInt(minutes));
                      setEditingAppointment({
                        ...editingAppointment,
                        endTime: date.toISOString(),
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editingAppointment.status}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      status: e.target.value as Appointment['status'],
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  required
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason
                </label>
                <input
                  type="text"
                  value={editingAppointment.reason || ''}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      reason: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="e.g., Dental checkup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editingAppointment.notes || ''}
                  onChange={(e) =>
                    setEditingAppointment({
                      ...editingAppointment,
                      notes: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingAppointment(null);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
