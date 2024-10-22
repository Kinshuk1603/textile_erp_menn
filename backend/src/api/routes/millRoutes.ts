// src/routes/millRoutes.ts
import express from 'express';
import {
  createMill,
  getMills,
  getMillById,
  updateMill,
  deleteMill,
} from '../controllers/millController';

const router = express.Router();

// POST /api/mills - Create a new mill
router.post('/mills', createMill);

// GET /api/mills - Get all mills
router.get('/mills', getMills);

// GET /api/mills/:id - Get a single mill by ID
router.get('/mills/:id', getMillById);

// PUT /api/mills/:id - Update a mill by ID
router.put('/mills/:id', updateMill);

// DELETE /api/mills/:id - Delete a mill by ID
router.delete('/mills/:id', deleteMill);

export default router;
