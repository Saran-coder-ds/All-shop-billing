import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getInventory,
  getInventoryItem,
  updateInventoryQuantity,
  updateLevels,
  getLowStockItemsManual
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', verifyToken, getInventory);
router.get('/:productId', verifyToken, getInventoryItem);
router.post('/:productId/update', verifyToken, updateInventoryQuantity);
router.put('/:productId/levels', verifyToken, updateLevels);
router.get('/alerts/low-stock', verifyToken, getLowStockItemsManual);

export default router;
