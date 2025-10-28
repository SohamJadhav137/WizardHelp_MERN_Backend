import express from "express";
import { createOrder, getOrders, markAsComplete } from "../controllers/orderController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/:gigId', protect, createOrder);
router.get('/', protect, getOrders);
router.patch('/:id/complete', protect, markAsComplete);

export default router;