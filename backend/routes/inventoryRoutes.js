import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { uploadCSV, upload, getInventoryData, getProducts } from '../controllers/inventoryController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/upload', upload.single('csv'), uploadCSV);
router.get('/data', getInventoryData);
router.get('/products', getProducts);

export default router;

