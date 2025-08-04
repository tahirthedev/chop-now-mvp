import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// POST /api/payments
router.post('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Payments endpoint - Coming soon!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
