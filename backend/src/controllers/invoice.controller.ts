import { Request, Response } from 'express';
import prisma from '../config/database';

// Generate invoice number
const generateInvoiceNumber = async (): Promise<string> => {
  const year = new Date().getFullYear();
  const count = await prisma.invoice.count();
  const number = String(count + 1).padStart(3, '0');
  return `INV-${year}-${number}`;
};

// Get all invoices
export const getAllInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 50, search, status, patientId } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (search) {
      where.OR = [
        {
          invoiceNumber: { contains: String(search), mode: 'insensitive' as const },
        },
        {
          patient: {
            OR: [
              { firstName: { contains: String(search), mode: 'insensitive' as const } },
              { lastName: { contains: String(search), mode: 'insensitive' as const } },
            ],
          },
        },
      ];
    }

    if (status) {
      where.status = String(status);
    }

    if (patientId) {
      where.patientId = String(patientId);
    }

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { date: 'desc' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true,
              email: true,
            },
          },
          items: true,
          payments: {
            orderBy: { paidAt: 'desc' },
          },
        },
      }),
      prisma.invoice.count({ where }),
    ]);

    res.json({
      invoices,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Get all invoices error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single invoice
export const getInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            address: true,
          },
        },
        items: true,
        payments: {
          orderBy: { paidAt: 'desc' },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({ invoice });
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create invoice
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { patientId, dueDate, items, tax = 0, discount = 0, notes } = req.body;

    // Validate required fields
    if (!patientId || !dueDate || !items || items.length === 0) {
      res.status(400).json({
        error: 'Patient ID, due date, and at least one item are required',
      });
      return;
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => {
      return sum + (item.quantity * item.unitPrice);
    }, 0);
    const total = subtotal + Number(tax) - Number(discount);

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber();

    // Create invoice with items
    const invoice = await prisma.invoice.create({
      data: {
        patientId,
        invoiceNumber,
        dueDate: new Date(dueDate),
        subtotal,
        tax: Number(tax),
        discount: Number(discount),
        total,
        status: 'UNPAID',
        notes: notes || null,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        items: true,
      },
    });

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice,
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update invoice
export const updateInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { dueDate, tax, discount, notes, status } = req.body;

    const updateData: any = {};

    if (dueDate) updateData.dueDate = new Date(dueDate);
    if (tax !== undefined) updateData.tax = Number(tax);
    if (discount !== undefined) updateData.discount = Number(discount);
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;

    // Recalculate total if tax or discount changed
    if (tax !== undefined || discount !== undefined) {
      const currentInvoice = await prisma.invoice.findUnique({
        where: { id },
        select: { subtotal: true, tax: true, discount: true },
      });

      if (currentInvoice) {
        const newTax = tax !== undefined ? Number(tax) : currentInvoice.tax;
        const newDiscount = discount !== undefined ? Number(discount) : currentInvoice.discount;
        updateData.total = currentInvoice.subtotal + newTax - newDiscount;
      }
    }

    const invoice = await prisma.invoice.update({
      where: { id },
      data: updateData,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        items: true,
        payments: true,
      },
    });

    res.json({
      message: 'Invoice updated successfully',
      invoice,
    });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete invoice
export const deleteInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id },
    });

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add payment to invoice
export const addPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount, method, transactionId, notes } = req.body;

    // Validate required fields
    if (!amount || !method) {
      res.status(400).json({
        error: 'Amount and payment method are required',
      });
      return;
    }

    // Get current invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    // Calculate total paid
    const totalPaid = invoice.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const newTotalPaid = totalPaid + Number(amount);

    // Determine new status
    let newStatus = invoice.status;
    if (newTotalPaid >= invoice.total) {
      newStatus = 'PAID';
    } else if (newTotalPaid > 0) {
      newStatus = 'PARTIALLY_PAID';
    }

    // Create payment and update invoice status
    const payment = await prisma.payment.create({
      data: {
        invoiceId: id,
        amount: Number(amount),
        method,
        transactionId: transactionId || null,
        notes: notes || null,
      },
    });

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: { status: newStatus },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
          },
        },
        items: true,
        payments: {
          orderBy: { paidAt: 'desc' },
        },
      },
    });

    res.status(201).json({
      message: 'Payment added successfully',
      payment,
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error('Add payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
