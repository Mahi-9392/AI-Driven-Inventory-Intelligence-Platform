import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { generateForecast, getForecasts, getForecastById } from '../controllers/forecastController.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/generate', generateForecast);
router.get('/', getForecasts);
router.get('/:id', getForecastById);

export default router;

