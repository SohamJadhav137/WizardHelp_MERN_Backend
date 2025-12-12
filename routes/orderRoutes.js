import express from "express";
import { createOrder, getOrders, markAsDelivered, getSingleOrder, markAsCompleted, requestRevision, requestCancellation, accepteOrderCancelRequest, rejectOrderCancelRequest, initiateOrder } from "../controllers/orderController.js";
import { authorizeRoles, protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/:id/order-request', protect, authorizeRoles("seller"), initiateOrder);
router.post('/:id', protect, authorizeRoles("buyer"), createOrder);
router.get('/:id', protect, getSingleOrder);
router.get('/', protect, getOrders);
router.patch('/:id/deliver', protect, authorizeRoles("seller"), markAsDelivered);
router.patch('/:id/complete', protect, authorizeRoles("buyer"), markAsCompleted);
router.patch('/:id/revision', protect, authorizeRoles("buyer"), requestRevision);
router.patch('/:id/cancellation-request', protect, requestCancellation);
router.patch('/:id/cancel-accept', protect, accepteOrderCancelRequest);
router.patch('/:id/cancel-reject', protect, rejectOrderCancelRequest);

export default router;