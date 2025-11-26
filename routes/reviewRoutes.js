import express from "express";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { submitReview, fetchSingleReview, fetchGigReviews, submitBuyerRating, fetchBuyerRating } from "../controllers/reviewController.js";

const router = express.Router();

router.post('/submit', protect, authorizeRoles("buyer"), submitReview);
router.post('/buyer-rating', protect, authorizeRoles("seller"), submitBuyerRating);
router.get('/by-order/:id', protect, authorizeRoles("buyer"), fetchSingleReview);
router.get('/gig-reviews/:id', protect, fetchGigReviews);
router.get('/buyer-rating/:id', protect, fetchBuyerRating);

export default router;