import express from "express";
import { fetchFilePreview } from "../controllers/previewController.js";

const router = express.Router();

router.get('/:orderId/file/:fileId', fetchFilePreview);

export default router;