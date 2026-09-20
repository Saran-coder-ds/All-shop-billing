import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  createBill,
  getBills,
  getBillById,
  updateBillStatus,
  deleteBill
} from '../controllers/billController.js';

const router = express.Router();

router.post('/', verifyToken, createBill);
router.get('/', verifyToken, getBills);
router.get('/:id', verifyToken, getBillById);
router.put('/:id/status', verifyToken, updateBillStatus);
router.delete('/:id', verifyToken, deleteBill);

export default router;
