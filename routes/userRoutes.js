import express from "express";
import { editUserProfile, getActiveGigs, getUserDetails } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.get('/:id', getUserDetails);
router.get('/:id/active-gigs', protect, getActiveGigs);
router.patch('/:id/edit-profile', [
    body("country").notEmpty().withMessage("Please select a country!"),
    body("languages").isArray({ min: 1 }).withMessage("Please select atleast one language!"),
    body("skills").isArray({ min: 1 }).withMessage("Please enter atleast one skill!"),
], protect, editUserProfile);

export default router;