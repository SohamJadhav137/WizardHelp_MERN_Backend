import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { deleteFileController } from "../controllers/deleteFileController.js";

const router = express.Router();

router.post('/delete-file', protect, deleteFileController);

export default router;