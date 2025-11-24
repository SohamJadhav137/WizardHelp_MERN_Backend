import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { deleteFileController } from "../controllers/deleteFileController.js";

const router = express.Router();

router.delete('/delete-file', protect, deleteFileController);

export default router;