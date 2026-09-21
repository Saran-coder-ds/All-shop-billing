import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.FRONTEND_URL || '*'
  ],
  credentials: true
}));
app.use(express.json());

// Import routes
import authRoutes from '../backend/routes/auth.js';
import productRoutes from '../backend/routes/products.js';
import inventoryRoutes from '../backend/routes/inventory.js';
import billRoutes from '../backend/routes/bills.js';
import dashboardRoutes from '../backend/routes/dashboard.js';

// Serve frontend files
app.use(express.static(path.join(process.cwd(), 'frontend/public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/dashboard', dashboardRoutes);


// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Tea Shop Billing API is running ☕' });
});

// Frontend route
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend/public/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🍵 Tea Shop API running on port ${PORT}`);
});

export default app;
