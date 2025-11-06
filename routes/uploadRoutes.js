import express from "express";
import { getPresignedUrl } from "../controllers/uploadController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get('/presign', protect, getPresignedUrl);

export default router;