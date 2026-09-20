import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateBillNo = () => {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BILL-${dateStr}-${random}`;
};

export const createBill = async (req, res) => {
  try {
    const { items, discount = 0, tax = 0, paymentMethod = 'cash', notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Bill must have items' });
    }

    let totalAmount = 0;
    const billItems = [];

    // Validate items and calculate total
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) }
      });

      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` });
      }

      const itemTotal = product.price * item.quantity;
      totalAmount += itemTotal;

      billItems.push({
        productId: parseInt(item.productId),
        quantity: parseInt(item.quantity),
        price: product.price,
        total: itemTotal
      });

      // Update inventory
      await prisma.inventory.update({
        where: { productId: parseInt(item.productId) },
        data: { quantity: { decrement: parseInt(item.quantity) } }
      });
    }

    const discountAmount = parseFloat(discount) || 0;
    const taxAmount = parseFloat(tax) || 0;
    const finalAmount = totalAmount - discountAmount + taxAmount;

    const bill = await prisma.bill.create({
      data: {
        billNo: generateBillNo(),
        totalAmount,
        discount: discountAmount,
        tax: taxAmount,
        finalAmount,
        paymentMethod,
        status: 'completed',
        notes,
        items: {
          create: billItems
        }
      },
      include: {
        items: {
          include: { product: true }
        }
      }
    });

    // Update daily summary
    const today = new Date().toISOString().split('T')[0];
    const profit = totalAmount - billItems.reduce((sum, item) => {
      return sum + (item.price - (item.price * 0.3)); // Assuming 30% cost
    }, 0);

    await prisma.dailySummary.upsert({
      where: { date: today },
      update: {
        totalSales: { increment: finalAmount },
        totalBills: { increment: 1 },
        totalProfit: { increment: profit }
      },
      create: {
        date: today,
        totalSales: finalAmount,
        totalBills: 1,
        totalProfit: profit
      }
    });

    res.status(201).json(bill);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getBills = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    const where = {};

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        where.createdAt.lte = new Date(endDate);
      }
    }

    const bills = await prisma.bill.findMany({
      where,
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });

    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBillById = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: { items: { include: { product: true } } }
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBillStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const bill = await prisma.bill.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { items: { include: { product: true } } }
    });

    res.json(bill);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Bill not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
      where: { id: parseInt(id) },
      include: { items: true }
    });

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Restore inventory
    for (const item of bill.items) {
      await prisma.inventory.update({
        where: { productId: item.productId },
        data: { quantity: { increment: item.quantity } }
      });
    }

    await prisma.bill.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
