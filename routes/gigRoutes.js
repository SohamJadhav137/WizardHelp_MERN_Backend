import express from "express";
import { getGigs, getSingleGig, getUserGigs, deleteGig, createGig, updateGig } from "../controllers/gigController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.get('/allgigs', getGigs);

router.get('/my-gigs', protect, getUserGigs);

router.get('/:id', getSingleGig);

router.delete('/:id', protect, deleteGig);

router.post('/', [
    body("title").notEmpty().withMessage("Title is required!"),
    body("category").notEmpty().withMessage("Category is required!"),
    body("description").notEmpty().withMessage("Description is required!"),
    body("imageURLs").isArray({ min: 1 }).withMessage("Atleast one image is required!"),
    body("price").isNumeric({ gt: 0}).withMessage("Price must be positive!"),
    body("deliveryDays").isNumeric({ gt: 0}).withMessage("Delivery days must be positive!"),
    body("revisions").isNumeric({ gt: 0}).withMessage("Number of revisions must be positive!"),
], protect, createGig);

router.put('/:id', protect, updateGig);

export default router;