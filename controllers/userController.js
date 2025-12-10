import { validationResult } from "express-validator";
import Gig from "../models/Gig.js";
import User from "../models/user.js";

export const getUserDetails = async(req, res) => {
    try{
        const userId = req.params.id;
        const user = await User.findById(userId);
        res.status(200).json({ user });
    } catch(error){
        console.error("CUSTOM ERROR!\n", error);
        res.status(500).json({ message: "Server side error occured!" });
    }
};

export const getActiveGigs = async (req, res) => {
    try{
        const userId = req.params.id;
        const gigs = await Gig.find({ userId, isPublished: true });

        if(!gigs)
            return res.status(404).json({ error: "User active-gigs not found!" });

        res.status(200).json(gigs);
    } catch(error){
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json({ error: "Server side error" });
    };
}

export const editUserProfile = async (req, res) => {
    const errors = validationResult(req);
    console.log("Backend validation:\n",errors);
    if(!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg });

    try{
        const userId = req.params.id;
        const user = await User.findById(userId);

        if(!user)
            return res.status(404).json({ error: "User not found!" });

        if(req.user._id.toString() !== userId.toString()){
            return res.status(403).json({ error: "Only account owner can edit profile detials!" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(201).json(updatedUser);
    } catch(error){
        console.error("CUSTOM ERROR:", error);
        return res.status(500).json({ error: "Server side error!" });
    }
}

export const saveProfilePhoto = async (req, res) => {
    try{
        const userId = req.params.id;

        const user = await User.findById(userId);
        
        if(!user)
            return res.status(404).json({ error: "User not found!" });

        if(req.user._id.toString() !== userId.toString()){
            return res.status(403).json({ error: "Only account owner can edit profile photo!" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: req.body },
            { new: true, runValidators: true }
        );

        res.status(201).json(updatedUser);
    } catch(error){
        console.error("CUSTOM ERROR:", error);
        return res.status(500).json({ error: "Server side error!" });
    }
};

export const removeProfilePhoto = async (req, res) => {
    try{
        const userId = req.params.id;

        const user = await User.findById(userId);
        
        if(!user)
            return res.status(404).json({ error: "User not found!" });

        if(req.user._id.toString() !== userId.toString()){
            return res.status(403).json({ error: "Only account owner can remove profile photo!" });
        }

        user.profilePic = null;

        await user.save();

        res.status(201).json(user);
    } catch(error){
        console.error("CUSTOM ERROR:", error);
        return res.status(500).json({ error: "Server side error!" });
    }
};