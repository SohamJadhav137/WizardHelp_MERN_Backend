import express from "express";
import { downloadFile } from "../controllers/downloadController.js";

const router = express.Router();

router.get('/:orderId/file/:fileId', downloadFile);

export default router;