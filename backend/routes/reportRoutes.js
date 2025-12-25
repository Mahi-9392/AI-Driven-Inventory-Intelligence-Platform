import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generatePDFReport } from '../controllers/reportController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/pdf', generatePDFReport);

export default router;

