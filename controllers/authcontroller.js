import { validationResult } from "express-validator";
import User from "../models/user.js"; 
import jwt from "jsonwebtoken"

const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};

const sendTokenResponse = (user, res) => {
    const token = generateToken(user);

    //////////////////// COOKIE-BASED APPROACH ///////////////////////////
    
    // const options = {
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === "production",
    //     sameSite: "strict",
    //     maxAge: 7 * 24 * 60 * 60 * 1000
    // };

    // res.status(200)
    //     .json({
    //         success: true,
    //         _id: user._id,
    //         name: user.name,
    //         email: user.email,
    //         role: user.role
    //     });

    /////////////////// AUTH-HEADER-BASED APPROACH /////////////////////////
    
    res.status(200)
        .json({
            success: true,
            username: user.username,
            email: user.email,
            role: user.role,
            profilePic: user.profilePic,
            message: "Token created successfully",
            token
        });
};

export const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg})
    
    const {username, email, password, country, languages, skills, role} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists" });
        }

        const user = await User.create({username, email, password, country, languages, skills, role});
        sendTokenResponse(user, res);
        // const token = generateToken(user);

        // res.status(201).json({
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     role: user.role,
        //     token
        // });
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({message: "Server error!"});
    }
};

export const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg });

    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        
        // Checking if user exists
        if(!user)
            return res.status(400).json({message: "Invalid credentials"});
            
        const isMatch = await user.matchPassword(password);
        
        // Checking if password is correct
        if(!isMatch)
            return res.status(400).json({message: "Invalid credentials"});
        
        // const token = generateToken(user);
        sendTokenResponse(user, res);
        
        // res.status(200).json({
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     role: user.role,
        //     token
        // });
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({message: "Server error!"})
    }
    
};

export const logoutUser = (req, res) => {
    // res
    //     .cookie("token", "", {
    //         httpOnly: true,
    //         expires: new Date(0)
    //     })
    //     .json({ message: "Logged out successfully"});

    res.json({ message: "Logged out successfully" })
};