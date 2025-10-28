import User from "../models/user.js"; 
import jwt from "jsonwebtoken"

const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: "7d"}
    );
};

const sendTokenResponse = (user, res, statusCode) => {
    const token = generateToken(user);

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };

    res.status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
};

export const registerUser = async (req, res) => {
    const {name, email, password, role} = req.body;

    try{
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({ message: "User already exists"});
        }

        const user = await User.create({name, email, password, role});
        // const token = generateToken(user);
        sendTokenResponse(user, res, 201);

        // res.status(201).json({
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     role: user.role,
        //     token
        // });
    } catch (error) {
        res.status(500).json({message: "Server error!"});
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        
        if(!user)
            return res.status(400).json({message: "Invalid credentials"});
            
        const isMatch = await user.matchPassword(password);
        
        if(!isMatch)
            return res.status(400).json({message: "Invalid credentials"});
        
        // const token = generateToken(user);
        sendTokenResponse(user, res, 200);
        
        // res.status(200).json({
        //     _id: user._id,
        //     name: user.name,
        //     email: user.email,
        //     role: user.role,
        //     token
        // });
    } catch (error) {
        res.status(500).json({message: "Server error!"})
    }
    
};

export const logoutUser = (req, res) => {
    res
        .cookie("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })
        .json({ message: "Logged out successfully"});
};