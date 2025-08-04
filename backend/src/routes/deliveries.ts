import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// GET /api/deliveries
router.get('/', async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Deliveries endpoint - Coming soon!',
      data: []
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
