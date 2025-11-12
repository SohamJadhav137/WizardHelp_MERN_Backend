import express from "express";
import { getGigsByCategory } from "../controllers/catController.js";

const router = express.Router();

router.get('/:category', getGigsByCategory);

export default router;