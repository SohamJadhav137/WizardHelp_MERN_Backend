import express from "express";
import { protect } from '../middlewares/authMiddleware.js';
import { createConversation, getConversations, getSingleConversation } from "../controllers/conversationController.js";

const router = express.Router();

router.get('/:id', protect, getSingleConversation);
router.get('/', protect, getConversations);
router.post('/', protect, createConversation);

export default router;