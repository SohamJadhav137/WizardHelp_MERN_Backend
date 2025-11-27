import express from "express";
import { getActiveGigs, getUserDetails } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/:id', getUserDetails);
router.get('/:id/active-gigs', protect, getActiveGigs);

export default router;