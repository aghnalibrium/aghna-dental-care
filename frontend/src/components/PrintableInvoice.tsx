import React from 'react';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Payment {
  id: string;
  amount: number;
  method: string;
  paidAt: string;
  transactionId?: string;
}

interface Patient {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
  notes?: string;
  patient: Patient;
  items: InvoiceItem[];
  payments: Payment[];
}

interface PrintableInvoiceProps {
  invoice: Invoice;
}

export const PrintableInvoice = React.forwardRef<HTMLDivElement, PrintableInvoiceProps>(
  ({ invoice }, ref) => {
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(amount);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    const paidAmount = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const remainingBalance = invoice.total - paidAmount;

    // Get absolute URL for logo to ensure it loads in print
    const logoUrl = `${window.location.origin}/logo.png`;

    return (
      <div ref={ref} className="printable-invoice bg-white p-8 max-w-4xl mx-auto">
        <style>{`
          @media print {
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden;
            }
            .printable-invoice,
            .printable-invoice * {
              visibility: visible;
            }
            .printable-invoice {
              position: absolute;
              left: 50%;
              top: 0;
              transform: translateX(-50%);
              width: 190mm;
              max-width: 190mm;
              padding: 15mm 0;
              margin: 0;
              font-size: 12pt;
            }
            .printable-invoice h1 {
              font-size: 20pt;
            }
            .printable-invoice h2 {
              font-size: 24pt;
            }
            .printable-invoice h3 {
              font-size: 11pt;
            }
            .printable-invoice table {
              font-size: 11pt;
            }
            .printable-invoice .text-sm {
              font-size: 10pt;
            }
            .printable-invoice .text-xs {
              font-size: 9pt;
            }
            @page {
              size: A4 portrait;
              margin: 0;
            }
          }
        `}</style>

        {/* Header */}
        <div className="border-b-2 border-amber-600 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="mb-3">
                <img
                  src={logoUrl}
                  alt="Aghna Dental Care"
                  className="h-20 object-contain"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    // Fallback to relative path if absolute fails
                    const target = e.target as HTMLImageElement;
                    target.src = '/logo.png';
                  }}
                />
              </div>
              <div className="text-sm text-gray-600 mt-4">
                <p>Jl. Perumahan Griya Hinggil No.D2</p>
                <p>Gendeng, Bangunjiwo, Kec. Kasihan</p>
                <p>Kabupaten Bantul, DIY 55184</p>
                <p className="mt-2">Telp: +62 857-6938-2624</p>
                <p>Email: aghnadentalcare@gmail.com</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold text-amber-600 mb-3">INVOICE</h2>
              <div className="text-sm space-y-2">
                <p><span className="font-semibold">No. Invoice:</span> {invoice.invoiceNumber}</p>
                <p><span className="font-semibold">Tanggal:</span> {formatDate(invoice.date)}</p>
                <p><span className="font-semibold">Jatuh Tempo:</span> {formatDate(invoice.dueDate)}</p>
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                  invoice.status === 'PAID' ? 'bg-green-100 text-green-800' :
                  invoice.status === 'PARTIALLY_PAID' ? 'bg-yellow-100 text-yellow-800' :
                  invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {invoice.status === 'PAID' ? 'LUNAS' :
                   invoice.status === 'PARTIALLY_PAID' ? 'SEBAGIAN LUNAS' :
                   invoice.status === 'OVERDUE' ? 'TERLAMBAT' :
                   'BELUM BAYAR'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Info */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Ditagih Kepada:</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-gray-900">{invoice.patient.firstName} {invoice.patient.lastName}</p>
            <p className="text-sm text-gray-600">Telp: {invoice.patient.phone}</p>
            {invoice.patient.email && (
              <p className="text-sm text-gray-600">Email: {invoice.patient.email}</p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-6">
          <table className="w-full">
            <thead>
              <tr className="bg-amber-600 text-white">
                <th className="text-left py-3 px-4 font-semibold">Deskripsi Layanan</th>
                <th className="text-center py-3 px-3 font-semibold" style={{ width: '60px' }}>Qty</th>
                <th className="text-right py-3 px-4 font-semibold" style={{ width: '130px' }}>Harga</th>
                <th className="text-right py-3 px-4 font-semibold" style={{ width: '140px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 border-b">{item.description}</td>
                  <td className="py-3 px-3 text-center border-b">{item.quantity}</td>
                  <td className="py-3 px-4 text-right border-b">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-3 px-4 text-right border-b font-semibold">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end mb-6">
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">{formatCurrency(invoice.subtotal)}</span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Pajak:</span>
                  <span className="font-semibold">{formatCurrency(invoice.tax)}</span>
                </div>
              )}
              {invoice.discount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Diskon:</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(invoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-300">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-lg font-bold text-amber-600">{formatCurrency(invoice.total)}</span>
              </div>
              {paidAmount > 0 && (
                <>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Dibayar:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(paidAmount)}</span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-gray-300">
                    <span className="text-lg font-bold">Sisa:</span>
                    <span className={`text-lg font-bold ${remainingBalance === 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(remainingBalance)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Payment History */}
        {invoice.payments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Riwayat Pembayaran:</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left py-3 px-4">Tanggal</th>
                  <th className="text-left py-3 px-4">Metode</th>
                  <th className="text-left py-3 px-4">ID Transaksi</th>
                  <th className="text-right py-3 px-4">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {invoice.payments.map((payment) => (
                  <tr key={payment.id} className="border-b">
                    <td className="py-3 px-4">{formatDate(payment.paidAt)}</td>
                    <td className="py-3 px-4">{payment.method}</td>
                    <td className="py-3 px-4">{payment.transactionId || '-'}</td>
                    <td className="py-3 px-4 text-right font-semibold">{formatCurrency(payment.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notes */}
        {invoice.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Catatan:</h3>
            <p className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="border-t pt-6 mt-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">Terima kasih atas kepercayaan Anda kepada Aghna Dental Care</p>
            <p>Untuk pertanyaan, hubungi kami di +62 857-6938-2624 atau aghnadentalcare@gmail.com</p>
          </div>
        </div>
      </div>
    );
  }
);

PrintableInvoice.displayName = 'PrintableInvoice';
