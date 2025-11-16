import express from "express";
import {registerUser, loginUser, logoutUser} from "../controllers/authcontroller.js";
import { body } from "express-validator";

const router = express.Router();

router.post('/register', [
    body("username").notEmpty().withMessage("Username is required!"),
    body("email").isEmail().withMessage("Invalid email!"),
    body("password").isLength({ min:6 }).withMessage("Minimum 6 characters required!")
], registerUser);

router.post('/login', [
    body("email").isEmail().withMessage("Invalid email!"),
    body("password").notEmpty().withMessage("Password is required!")
], loginUser);

router.post('/logout', logoutUser);

export default router;