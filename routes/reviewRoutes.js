import express from "express";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { submitReview, fetchSingleReview, fetchGigReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post('/submit', protect, authorizeRoles("buyer"), submitReview);
router.get('/by-order/:id', protect, authorizeRoles("buyer"), fetchSingleReview);
router.get('/gig-reviews/:id', protect, fetchGigReviews);

export default router;