import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// GET /api/users/profile
router.get('/profile', async (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: 'User profile endpoint - Coming soon!'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;
