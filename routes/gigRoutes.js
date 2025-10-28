import express from "express";
import { getGigs, getSingleGig, deleteGig, createGig, updateGig } from "../controllers/gigController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/allgigs', getGigs);
router.get('/:id', getSingleGig);
router.delete('/:id', protect, deleteGig);
router.post('/', protect, createGig);
router.put('/:id', protect, updateGig);

export default router;