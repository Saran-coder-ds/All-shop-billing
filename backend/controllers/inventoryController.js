import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getInventory = async (req, res) => {
  try {
    const inventory = await prisma.inventory.findMany({
      include: { product: true },
      orderBy: { product: { name: 'asc' } }
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInventoryItem = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await prisma.inventory.findUnique({
      where: { productId: parseInt(productId) },
      include: { product: true }
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInventoryQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, type } = req.body; // type: 'set', 'add', 'subtract'

    if (!quantity || !type) {
      return res.status(400).json({ error: 'Quantity and type are required' });
    }

    let newQuantity;
    const current = await prisma.inventory.findUnique({
      where: { productId: parseInt(productId) }
    });

    if (!current) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    if (type === 'set') {
      newQuantity = quantity;
    } else if (type === 'add') {
      newQuantity = current.quantity + quantity;
    } else if (type === 'subtract') {
      newQuantity = current.quantity - quantity;
      if (newQuantity < 0) {
        return res.status(400).json({ error: 'Insufficient inventory' });
      }
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }

    const inventory = await prisma.inventory.update({
      where: { productId: parseInt(productId) },
      data: { quantity: newQuantity },
      include: { product: true }
    });

    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateLevels = async (req, res) => {
  try {
    const { productId } = req.params;
    const { minLevel, maxLevel } = req.body;

    if (!minLevel || !maxLevel) {
      return res.status(400).json({ error: 'Min and max levels are required' });
    }

    const inventory = await prisma.inventory.update({
      where: { productId: parseInt(productId) },
      data: {
        minLevel: parseInt(minLevel),
        maxLevel: parseInt(maxLevel)
      },
      include: { product: true }
    });

    res.json(inventory);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getLowStockItems = async (req, res) => {
  try {
    const items = await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.inventory.fields.minLevel
        }
      },
      include: { product: true }
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Manual query for low stock items
export const getLowStockItemsManual = async (req, res) => {
  try {
    const items = await prisma.$queryRaw`
      SELECT i.*, p.name, p.price
      FROM Inventory i
      JOIN Product p ON i.productId = p.id
      WHERE i.quantity <= i.minLevel
      ORDER BY p.name ASC
    `;

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
