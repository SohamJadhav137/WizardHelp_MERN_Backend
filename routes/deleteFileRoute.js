import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { deleteFileController, deleteFileByUrlController } from "../controllers/deleteFileController.js";

const router = express.Router();

router.delete('/delete-file', protect, deleteFileController);
router.post("/delete-file-by-url", deleteFileByUrlController);

export default router;