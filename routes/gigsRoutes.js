import express from "express";
import { getGigs, getSingleGig, getSellerGigs, deleteGig, createGig, updateGig, updateGigState, getBestGigs } from "../controllers/gigsController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";
import { body } from "express-validator";

const router = express.Router();

router.get('/allgigs', getGigs);

router.get('/my-gigs', protect, authorizeRoles("seller"), getSellerGigs);

router.get('/best-by-category', getBestGigs);

router.get('/:id', getSingleGig);

router.delete('/:id', protect, deleteGig);

router.post('/', [
    body("title").notEmpty().withMessage("Title is required!"),
    body("category").notEmpty().withMessage("Category is required!"),
    body("description").notEmpty().withMessage("Description is required!"),
    body("imageURLs").isArray({ min: 1 }).withMessage("Atleast one image is required!"),
    body("price").isNumeric({ gt: 0 }).withMessage("Price must be positive!"),
    body("deliveryDays").isNumeric({ gt: 0 }).withMessage("Delivery days must be positive!"),
    body("revisions").isNumeric({ gt: 0 }).withMessage("Number of revisions must be positive!"),
], protect, createGig);

router.put('/:id', [
    body("title").notEmpty().withMessage("Title is required!"),
    body("category").notEmpty().withMessage("Category is required!"),
    body("description").notEmpty().withMessage("Description is required!"),
    body("imageURLs").isArray({ min: 1 }).withMessage("Atleast one image is required!"),
    body("price").isNumeric({ gt: 0 }).withMessage("Price must be positive!"),
    body("deliveryDays").isNumeric({ gt: 0 }).withMessage("Delivery days must be positive!"),
    body("revisions").isNumeric({ gt: 0 }).withMessage("Number of revisions must be positive!"),
], protect, updateGig);

router.patch('/publish-state/:id', protect, updateGigState);

export default router;