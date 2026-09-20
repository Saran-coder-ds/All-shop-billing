import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, cost, category, image } = req.body;

    if (!name || !price || !cost) {
      return res.status(400).json({ error: 'Name, price, and cost are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        cost: parseFloat(cost),
        category: category || 'tea',
        image,
        inventory: {
          create: {
            quantity: 0,
            minLevel: 10,
            maxLevel: 100
          }
        }
      },
      include: { inventory: true }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Product name already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};

    const products = await prisma.product.findMany({
      where,
      include: { inventory: true },
      orderBy: { createdAt: 'desc' }
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { inventory: true }
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, cost, category, image } = req.body;

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(cost && { cost: parseFloat(cost) }),
        ...(category && { category }),
        ...(image && { image })
      },
      include: { inventory: true }
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Product name already exists' });
    }
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
