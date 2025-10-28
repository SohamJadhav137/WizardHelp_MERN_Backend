import express from "express";
import { protect } from '../middlewares/authMiddleware.js';
import { getMessages, sendMessage } from "../controllers/messageController.js";

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:id', protect, getMessages);

export default router;