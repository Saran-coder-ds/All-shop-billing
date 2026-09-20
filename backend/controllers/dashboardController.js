import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getSalesummary = async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysNum = parseInt(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const summary = await prisma.dailySummary.findMany({
      where: {
        date: {
          gte: startDate.toISOString().split('T')[0]
        }
      },
      orderBy: { date: 'asc' }
    });

    // Get totals
    const totalSales = summary.reduce((sum, day) => sum + day.totalSales, 0);
    const totalBills = summary.reduce((sum, day) => sum + day.totalBills, 0);
    const totalProfit = summary.reduce((sum, day) => sum + day.totalProfit, 0);

    res.json({
      summary,
      totals: {
        totalSales,
        totalBills,
        totalProfit,
        days: daysNum
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTodaysSummary = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const dailyData = await prisma.dailySummary.findUnique({
      where: { date: today }
    });

    const bills = await prisma.bill.findMany({
      where: {
        createdAt: {
          gte: new Date(today),
          lt: new Date(new Date(today).getTime() + 86400000)
        }
      },
      include: { items: true }
    });

    const topProducts = await prisma.billItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        total: true
      },
      _count: true,
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5,
      where: {
        bill: {
          createdAt: {
            gte: new Date(today),
            lt: new Date(new Date(today).getTime() + 86400000)
          }
        }
      }
    });

    // Get product details for top products
    const topProductsDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        return {
          product,
          quantity: item._sum.quantity,
          revenue: item._sum.total
        };
      })
    );

    res.json({
      dailyData: dailyData || {
        totalSales: 0,
        totalBills: 0,
        totalProfit: 0
      },
      billCount: bills.length,
      topProducts: topProductsDetails
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const analytics = await prisma.billItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true,
        total: true
      },
      _count: true,
      where: {
        bill: {
          createdAt: {
            gte: startDate
          }
        }
      },
      orderBy: {
        _sum: {
          total: 'desc'
        }
      }
    });

    const details = await Promise.all(
      analytics.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: { inventory: true }
        });
        return {
          product,
          quantitySold: item._sum.quantity,
          revenue: item._sum.total,
          averagePrice: item._sum.total / item._sum.quantity
        };
      })
    );

    res.json(details);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPaymentMethodStats = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysNum);

    const stats = await prisma.bill.groupBy({
      by: ['paymentMethod'],
      _sum: {
        finalAmount: true
      },
      _count: true,
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
