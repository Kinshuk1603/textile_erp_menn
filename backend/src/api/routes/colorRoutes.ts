// backend/src/api/routes/colorRoutes.ts

import express from 'express';
import { createColor, getColors, updateColor, deleteColor } from '../controllers/colorController';

const router = express.Router();

router.post('/colors', createColor);
router.get('/colors', getColors);
router.put('/colors/:id', updateColor);
router.delete('/colors/:id', deleteColor);

export default router;
