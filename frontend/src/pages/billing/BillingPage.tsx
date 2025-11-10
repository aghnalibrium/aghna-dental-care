import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import html2canvas from 'html2canvas';
import { api } from '../../lib/api';
import {
  DollarSign,
  Plus,
  Search,
  Calendar,
  User,
  FileText,
  Eye,
  CreditCard,
  X,
  Trash2,
  Check,
  Printer,
  Send,
  Download
} from 'lucide-react';
import { PrintableInvoice } from '../../components/PrintableInvoice';
import jsPDF from 'jspdf';

const dentalServicesList = [
  'Teeth Whitening',
  'Orthodontics (Behel)',
  'Dental Implants',
  'Root Canal (Perawatan Saluran Akar)',
  'Tooth Extraction (Cabut Gigi)',
  'Dental Crown (Mahkota Gigi)',
  'Veneers',
  'Scaling (Pembersihan Karang Gigi)',
  'Fluoride Treatment',
  'Dental Bridge',
  'Dentures (Gigi Palsu)',
  'Gum Treatment (Perawatan Gusi)',
  'Teeth Cleaning (Pembersihan Gigi)',
  'X-Ray',
  'Konsultasi Umum',
  'Tambal Gigi',
  'Pemutihan Gigi',
  'Pemasangan Kawat Gigi'
];

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  notes: string;
  patient: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
  };
  items: InvoiceItem[];
  payments: Array<{
    id: string;
    amount: number;
    method: string;
    paidAt: string;
    transactionId?: string;
  }>;
}

export function BillingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [_isLoading, setIsLoading] = useState(true);
  const [_error, setError] = useState('');
  const [patients, setPatients] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    patientId: '',
    dueDate: '',
    tax: 0,
    discount: 0,
    notes: ''
  });

  useEffect(() => {
    fetchInvoices();
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await api.get('/patients', { params: { limit: 100 } });
      setPatients(response.data.patients || []);
    } catch (err: any) {
      console.error('Fetch patients error:', err);
    }
  };

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/invoices');
      setInvoices(response.data.invoices || []);
      setError('');
    } catch (err: any) {
      console.error('Fetch invoices error:', err);
      setError(err.response?.data?.error || 'Failed to fetch invoices');
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: '1',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
  ]);

  const [paymentData, setPaymentData] = useState({
    amount: 0,
    method: 'CASH',
    transactionId: '',
    notes: ''
  });

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  // Print functionality
  const printRef = useRef<HTMLDivElement>(null);
  const [invoiceToPrint, setInvoiceToPrint] = useState<Invoice | null>(null);

  const handlePrintInvoice = (invoice: Invoice) => {
    console.log('Print button clicked for invoice:', invoice.invoiceNumber);
    setInvoiceToPrint(invoice);

    // Wait for state to update and component to render
    setTimeout(() => {
      console.log('Checking print ref...');
      if (printRef.current) {
        console.log('Print ref found, triggering print');
        window.print();
      } else {
        console.error('Print ref not found');
        alert('Error: Tidak dapat memuat invoice untuk print. Silakan coba lagi.');
      }
    }, 200);
  };

  const generateInvoicePDF = async (invoice: Invoice) => {
    // Create a temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.width = '210mm';
    tempContainer.style.background = 'white';
    document.body.appendChild(tempContainer);

    // Render the PrintableInvoice component
    const root = ReactDOM.createRoot(tempContainer);
    await new Promise<void>((resolve) => {
      root.render(<PrintableInvoice invoice={invoice} />);
      setTimeout(resolve, 500); // Wait for rendering
    });

    // Convert HTML to canvas
    const canvas = await html2canvas(tempContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Clean up
    root.unmount();
    document.body.removeChild(tempContainer);

    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

    return pdf;
  };

  const handleSendToWhatsApp = async (invoice: Invoice) => {
    // Generate PDF
    const doc = await generateInvoicePDF(invoice);

    // Save PDF with filename
    const filename = `Invoice_${invoice.invoiceNumber}_${invoice.patient.firstName}_${invoice.patient.lastName}.pdf`;
    doc.save(filename);

    // Calculate amounts
    const paidAmount = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    const remainingBalance = invoice.total - paidAmount;

    // Create a simple WhatsApp message
    const message = `🦷 *INVOICE AGHNA DENTAL CARE*

📄 *No. Invoice:* ${invoice.invoiceNumber}
📅 *Tanggal:* ${new Date(invoice.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
👤 *Pasien:* ${invoice.patient.firstName} ${invoice.patient.lastName}

💰 *Total Tagihan:* Rp ${invoice.total.toLocaleString('id-ID')}
${paidAmount > 0 ? `✅ Dibayar: Rp ${paidAmount.toLocaleString('id-ID')}` : ''}
${remainingBalance > 0 ? `⚠️ Sisa: Rp ${remainingBalance.toLocaleString('id-ID')}` : '✅ *LUNAS*'}

📎 *Invoice PDF telah diunduh!*
Silakan attach file PDF yang baru saja terunduh ke chat ini.

Terima kasih atas kepercayaan Anda! 🙏

📍 Jl. Perumahan Griya Hinggil No.D2, Bantul, DIY
📞 +62 857-6938-2624`;

    // Format phone number
    let phone = invoice.patient.phone;
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    } else if (!phone.startsWith('62')) {
      phone = '62' + phone;
    }

    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    // Show notification
    alert(`Invoice PDF "${filename}" telah diunduh!\n\nSelanjutnya:\n1. Cek folder Downloads Anda\n2. Di WhatsApp, attach file PDF tersebut\n3. Kirim ke pasien`);

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  const handleDownloadPDF = async (invoice: Invoice) => {
    // Generate PDF
    const doc = await generateInvoicePDF(invoice);

    // Save PDF with filename
    const filename = `Invoice_${invoice.invoiceNumber}_${invoice.patient.firstName}_${invoice.patient.lastName}.pdf`;
    doc.save(filename);
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + formData.tax - formData.discount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const dataToSubmit = {
        ...formData,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        }))
      };
      await api.post('/invoices', dataToSubmit);
      setShowAddModal(false);
      // Reset form
      setFormData({
        patientId: '',
        dueDate: '',
        tax: 0,
        discount: 0,
        notes: ''
      });
      setItems([{
        id: '1',
        description: '',
        quantity: 1,
        unitPrice: 0,
        total: 0
      }]);
      // Refresh invoices list
      fetchInvoices();
      setError('');
    } catch (err: any) {
      console.error('Create invoice error:', err);
      setError(err.response?.data?.error || 'Gagal membuat invoice');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (selectedInvoice) {
        await api.post(`/invoices/${selectedInvoice.id}/payments`, paymentData);
        setShowPaymentModal(false);
        // Reset payment form
        setPaymentData({
          amount: 0,
          method: 'CASH',
          transactionId: '',
          notes: ''
        });
        // Refresh invoices list
        fetchInvoices();
        setError('');
      }
    } catch (err: any) {
      console.error('Add payment error:', err);
      setError(err.response?.data?.error || 'Gagal menambahkan pembayaran');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowViewModal(true);
  };

  const handleAddPayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    const remainingAmount = invoice.total - invoice.payments.reduce((sum, p) => sum + p.amount, 0);
    setPaymentData({ ...paymentData, amount: remainingAmount });
    setShowPaymentModal(true);
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patient.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.patient.lastName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || invoice.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'PARTIALLY_PAID':
        return 'bg-blue-100 text-blue-800';
      case 'UNPAID':
        return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Lunas';
      case 'PARTIALLY_PAID':
        return 'Dibayar Sebagian';
      case 'UNPAID':
        return 'Belum Dibayar';
      case 'OVERDUE':
        return 'Jatuh Tempo';
      case 'CANCELLED':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Invoice</h1>
        <p className="text-gray-600">Kelola pembayaran dan invoice pasien</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Invoice</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lunas</p>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter(i => i.status === 'PAID').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Belum Dibayar</p>
              <p className="text-2xl font-bold text-yellow-600">
                {invoices.filter(i => i.status === 'UNPAID').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pendapatan</p>
              <p className="text-xl font-bold text-amber-600">
                Rp {invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.total, 0).toLocaleString('id-ID')}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari nomor invoice atau pasien..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="ALL">Semua Status</option>
              <option value="UNPAID">Belum Dibayar</option>
              <option value="PARTIALLY_PAID">Dibayar Sebagian</option>
              <option value="PAID">Lunas</option>
              <option value="OVERDUE">Jatuh Tempo</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Buat Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  No. Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.patient.firstName} {invoice.patient.lastName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2 text-sm text-gray-900">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{new Date(invoice.date).toLocaleDateString('id-ID')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString('id-ID')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      Rp {invoice.total.toLocaleString('id-ID')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                      {getStatusText(invoice.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewInvoice(invoice)}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handlePrintInvoice(invoice)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Cetak Invoice"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadPDF(invoice)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleSendToWhatsApp(invoice)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Kirim ke WhatsApp (dengan PDF)"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                      {invoice.status !== 'PAID' && invoice.status !== 'CANCELLED' && (
                        <button
                          onClick={() => handleAddPayment(invoice)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Tambah Pembayaran"
                        >
                          <CreditCard className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInvoices.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tidak ada invoice ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Buat Invoice Baru</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Patient & Due Date */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pasien *
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="">Pilih Pasien</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {patient.phone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Jatuh Tempo *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    Item Layanan *
                  </label>
                  <button
                    type="button"
                    onClick={addItem}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                  >
                    + Tambah Item
                  </button>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <select
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        >
                          <option value="">Pilih layanan</option>
                          {dentalServicesList.map((service) => (
                            <option key={service} value={service}>
                              {service}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="w-40">
                        <input
                          type="number"
                          placeholder="Harga"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="w-40">
                        <input
                          type="text"
                          value={`Rp ${item.total.toLocaleString('id-ID')}`}
                          readOnly
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        />
                      </div>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax & Discount */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subtotal
                  </label>
                  <input
                    type="text"
                    value={`Rp ${calculateSubtotal().toLocaleString('id-ID')}`}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pajak (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Diskon (Rp)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Total */}
              <div className="bg-amber-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-amber-600">
                    Rp {calculateTotal().toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  placeholder="Catatan tambahan untuk invoice"
                />
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Buat Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {showViewModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Detail Invoice</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">No. Invoice</p>
                  <p className="font-bold text-gray-900">{selectedInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedInvoice.status)}`}>
                    {getStatusText(selectedInvoice.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pasien</p>
                  <p className="font-semibold text-gray-900">
                    {selectedInvoice.patient.firstName} {selectedInvoice.patient.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tanggal</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedInvoice.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Item Layanan</h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Deskripsi</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-600">Qty</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Harga</th>
                        <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedInvoice.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.description}</td>
                          <td className="px-4 py-3 text-sm text-center text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-right text-gray-900">
                            Rp {item.unitPrice.toLocaleString('id-ID')}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                            Rp {item.total.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">Rp {selectedInvoice.subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pajak</span>
                  <span className="font-semibold text-gray-900">Rp {selectedInvoice.tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Diskon</span>
                  <span className="font-semibold text-gray-900">- Rp {selectedInvoice.discount.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-amber-600">Rp {selectedInvoice.total.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Payments */}
              {selectedInvoice.payments.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Riwayat Pembayaran</h3>
                  <div className="space-y-2">
                    {selectedInvoice.payments.map((payment) => (
                      <div key={payment.id} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Rp {payment.amount.toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs text-gray-600">
                            {payment.method} - {new Date(payment.paidAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedInvoice.notes && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handlePrintInvoice(selectedInvoice)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Printer className="w-5 h-5" />
                  Cetak
                </button>
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Download className="w-5 h-5" />
                  Download PDF
                </button>
                <button
                  onClick={() => handleSendToWhatsApp(selectedInvoice)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Send className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-gray-900">Tambah Pembayaran</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handlePayment} className="p-6 space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Invoice</p>
                <p className="font-bold text-gray-900">{selectedInvoice.invoiceNumber}</p>
                <p className="text-sm text-gray-600 mt-2">Sisa Pembayaran</p>
                <p className="text-2xl font-bold text-amber-600">
                  Rp {(selectedInvoice.total - selectedInvoice.payments.reduce((sum, p) => sum + p.amount, 0)).toLocaleString('id-ID')}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Jumlah Pembayaran *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Metode Pembayaran *
                </label>
                <select
                  required
                  value={paymentData.method}
                  onChange={(e) => setPaymentData({ ...paymentData, method: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="CASH">Cash</option>
                  <option value="CREDIT_CARD">Kartu Kredit</option>
                  <option value="DEBIT_CARD">Kartu Debit</option>
                  <option value="TRANSFER">Transfer Bank</option>
                  <option value="OTHER">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  ID Transaksi (Opsional)
                </label>
                <input
                  type="text"
                  value={paymentData.transactionId}
                  onChange={(e) => setPaymentData({ ...paymentData, transactionId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nomor referensi transaksi"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Catatan
                </label>
                <textarea
                  value={paymentData.notes}
                  onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                  placeholder="Catatan pembayaran"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Simpan Pembayaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hidden Printable Invoice */}
      <div className="print-only">
        <style>{`
          .print-only {
            display: none;
          }
          @media print {
            .print-only {
              display: block !important;
            }
          }
        `}</style>
        {invoiceToPrint && (
          <PrintableInvoice ref={printRef} invoice={invoiceToPrint} />
        )}
      </div>
    </div>
  );
}
