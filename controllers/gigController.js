import { validationResult } from "express-validator";
import Gig from "../models/Gig.js";

export const createGig = async (req, res) => {
    const errors = validationResult(req);
    console.log("Backend validation:\n",errors);
    if(!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg })
    
    try {
        if (req.user.role !== "seller"){
            return res.status(403).json({ message: "Only sellers can create gigs!"});
        }

        const { imageURLs } = req.body;

        const coverImageURL = imageURLs ? imageURLs[0] : "";
        
        const newGig = new Gig({
            userId: req.user._id,
            coverImageURL: coverImageURL,
            ...req.body
        });

        console.log(newGig)
        
        const savedGig = await newGig.save();

        res.status(201).json(savedGig);
    } catch (error) {
        console.error("CUSTOM ERROR", error);
        res.status(500).json({ message: "Faild to create gig!"});
    }
};

export const getGigs = async (req, res) => {
    try{
        const gigs = await Gig.find();
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ message: "Failed to retreive gigs!"});
    }
};

export const getSingleGig = async (req, res) => {
    try{
        const gig = await Gig.findById(req.params.id);
        if(!gig) return res.status(404).json({ message: "Gig not found!"});
        res.status(200).json(gig);
    } catch (error) {
        res.status(500).json({ message: "Failed to retreive the gig!"});
    }
};

export const getUserGigs = async (req, res) => {
    const userId = req.user._id;
    try{
        const userGigs = await Gig.find({ userId });
        res.status(200).json(userGigs);
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to retrieve user specific gigs!"});
    }
}

export const deleteGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if(req.user._id.toString() !== gig.userId.toString())
            return res.status(403).json({ message: "Only gig owner can delete the gig!"});

        if(!gig) return res.status(404).json({ message: "Gig not found!"});

        await Gig.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Gig deleted successfully"});
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to delete the gig!"});
    }
};

export const updateGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if(req.user._id.toString() !== gig.userId.toString())
            return res.status(403).json({ message: "Only gig owner can update the gig!"});

        if(!gig) return res.status(404).json({ message: "Gig not found!"});

        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true}
        );

        res.status(200).json(updatedGig);
    } catch (error) {
        res.status(500).json({ message: "Failed to update the gig!"});
    }
};