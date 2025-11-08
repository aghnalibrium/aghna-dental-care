import { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Plus, Search, X } from 'lucide-react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  phone: string;
  email?: string;
  address?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalServices?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const medicalServicesList = [
  'Teeth Whitening',
  'Orthodontics',
  'Dental Implants',
  'Root Canal',
  'Tooth Extraction',
  'Dental Crown',
  'Veneers',
  'Scaling',
  'Fluoride Treatment',
  'Dental Bridge',
  'Dentures',
  'Gum Treatment',
  'Teeth Cleaning',
  'X-Ray',
  'Consultation'
];

export function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    phone: '',
    email: '',
    address: '',
    emergencyContact: '',
    allergies: '',
    medicalServices: '',
    notes: ''
  });

  useEffect(() => {
    fetchPatients();
  }, [search]);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/patients', {
        params: { search, limit: 50 },
      });
      setPatients(response.data.patients);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch patients');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const openEditModal = (patient: Patient) => {
    setSelectedPatient(patient);
    // Parse medical services from comma-separated string to array
    const services = patient.medicalServices ? patient.medicalServices.split(', ').filter(s => s.trim()) : [];
    setSelectedServices(services);
    setFormData({
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: patient.dateOfBirth.split('T')[0],
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || '',
      address: patient.address || '',
      emergencyContact: patient.emergencyContact || '',
      allergies: patient.allergies || '',
      medicalServices: patient.medicalServices || '',
      notes: patient.notes || ''
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setSelectedPatient(null);
    setSelectedServices([]);
    setFormData({
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'MALE',
      phone: '',
      email: '',
      address: '',
      emergencyContact: '',
      allergies: '',
      medicalServices: '',
      notes: ''
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert selectedServices array to comma-separated string
      const dataToSubmit = {
        ...formData,
        medicalServices: selectedServices.join(', ')
      };

      if (selectedPatient) {
        // Update existing patient
        await api.put(`/patients/${selectedPatient.id}`, dataToSubmit);
      } else {
        // Create new patient
        await api.post('/patients', dataToSubmit);
      }
      closeModal();
      fetchPatients();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save patient');
    }
  };

  const handleDelete = async (patientId: string) => {
    if (!confirm('Are you sure you want to delete this patient?')) return;

    try {
      await api.delete(`/patients/${patientId}`);
      fetchPatients();
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete patient');
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Patients
          </h1>
          <p className="text-gray-600 mt-2">Manage your dental clinic patients</p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name, phone, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Date of Birth
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Gender
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Medical Services
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-3"></div>
                    <p className="font-medium">Loading patients...</p>
                  </div>
                </td>
              </tr>
            ) : patients.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="font-medium text-gray-900">No patients found</p>
                    <p className="text-sm text-gray-500 mt-1">Try adjusting your search criteria</p>
                  </div>
                </td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold mr-3 shadow-md">
                        {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(patient.dateOfBirth)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {patient.gender}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {patient.email || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="line-clamp-2">
                      {patient.medicalServices || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openEditModal(patient)}
                      className="px-4 py-2 text-sm font-medium text-amber-600 border border-amber-600 rounded-lg hover:bg-amber-50 transition-all duration-200 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit Patient */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Enter last name"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  >
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="email@example.com"
                  />
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter patient address"
                  />
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="Emergency contact number"
                  />
                </div>

                {/* Allergies */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Allergies
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    placeholder="List any allergies"
                  />
                </div>

                {/* Medical Services */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Medical Services
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-lg max-h-64 overflow-y-auto bg-gray-50">
                    {medicalServicesList.map((service) => (
                      <label
                        key={service}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 p-2 rounded transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedServices.includes(service)}
                          onChange={() => handleServiceToggle(service)}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                  {selectedServices.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      <strong>Selected:</strong> {selectedServices.join(', ')}
                    </div>
                  )}
                </div>

                {/* Medical Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medical Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                    placeholder="Additional medical notes or history"
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                >
                  {selectedPatient ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
