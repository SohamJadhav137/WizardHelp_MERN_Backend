import express from "express";
import { createOrder, getOrders, markAsDelivered, getSingleOrder } from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/:gigId', protect, createOrder);
router.get('/:id', protect, getSingleOrder);
router.get('/', protect, getOrders);
router.patch('/:id/deliver', protect, authorizeRoles("seller"), markAsDelivered);

export default router;