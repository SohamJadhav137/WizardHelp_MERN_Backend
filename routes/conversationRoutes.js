import express from "express";
import { protect } from '../middlewares/authMiddleware.js';
import { createConversation, getConversations, getSingleConversation, singleConv } from "../controllers/conversationController.js";

const router = express.Router();

router.get('/:id/conv', protect, singleConv);
router.get('/:id', protect, getSingleConversation);
router.get('/', protect, getConversations);
router.post('/', protect, createConversation);

export default router;