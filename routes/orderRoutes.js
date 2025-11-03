import express from "express";
import { createOrder, getOrders, markAsComplete } from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/:gigId', protect, authorizeRoles("seller"), createOrder);
router.get('/', protect, authorizeRoles("seller"), getOrders);
router.patch('/:id/complete', protect, authorizeRoles("seller"), markAsComplete);

export default router;