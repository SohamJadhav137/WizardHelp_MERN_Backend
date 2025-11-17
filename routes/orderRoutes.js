import express from "express";
import { createOrder, getOrders, markAsComplete, getSingleOrder } from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/:gigId', protect, createOrder);
router.get('/:id', protect, getSingleOrder);
router.get('/', protect, getOrders);
router.patch('/:id/complete', protect, authorizeRoles("seller"), markAsComplete);

export default router;