import express from "express";
import {registerUser, loginUser, logoutUser, checkAvailability} from "../controllers/authcontroller.js";
import { body } from "express-validator";

const router = express.Router();

router.post('/register', [
    body("username").notEmpty().withMessage("Username is required!"),
    body("email").isEmail().withMessage("Invalid email!"),
    body("password").isLength({ min:6 }).withMessage("Minimum 6 characters required!"),
    body("country").notEmpty().withMessage("Country is required!"),
    body("languages").notEmpty().withMessage("Select atleast one language!"),
    body("skills").notEmpty().withMessage("Enter atleast one skill!"),
], registerUser);

router.post('/login', [
    body("email").isEmail().withMessage("Invalid email!"),
    body("password").notEmpty().withMessage("Password is required!")
], loginUser);

router.post('/logout', logoutUser);

router.get('/check-availability', checkAvailability);

export default router;