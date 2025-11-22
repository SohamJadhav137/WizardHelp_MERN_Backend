import express from "express";
import { createOrder, getOrders, markAsDelivered, getSingleOrder, markAsCompleted, requestRevision } from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/:gigId', protect, createOrder);
router.get('/:id', protect, getSingleOrder);
router.get('/', protect, getOrders);
router.patch('/:id/deliver', protect, authorizeRoles("seller"), markAsDelivered);
router.patch('/:id/complete', protect, authorizeRoles("buyer"), markAsCompleted);
router.patch('/:id/revision', protect, authorizeRoles("buyer"), requestRevision);

export default router;