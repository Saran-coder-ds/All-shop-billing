import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getSalesummary,
  getTodaysSummary,
  getProductAnalytics,
  getPaymentMethodStats
} from '../controllers/dashboardController.js';

const router = express.Router();

router.get('/sales-summary', verifyToken, getSalesummary);
router.get('/todays-summary', verifyToken, getTodaysSummary);
router.get('/product-analytics', verifyToken, getProductAnalytics);
router.get('/payment-stats', verifyToken, getPaymentMethodStats);

export default router;
