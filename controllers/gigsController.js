import { validationResult } from "express-validator";
import Gig from "../models/Gig.js";
import { deleteAllFilesFromS3 } from "../utils/deleteAllFilesFromS3.js";

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

        let isVideo = false;
        let mediaURLs = [...gig.imageURLs];
        if(gig.videoURL){
            isVideo = true;
            mediaURLs = [ gig.videoURL, ...mediaURLs];
        }

        res.status(200).json({ gig, mediaURLs });
    } catch (error) {
        console.error("CUSTOM ERROR:", error);
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
        if(!gig) return res.status(404).json({ message: "Gig not found!" });

        const allFiles = [
            ...(gig.imageURLs || []),
            ...(gig.videoURL || []),
            ...(gig.docURLs || [])
        ];
        
        if(req.user._id.toString() !== gig.userId.toString())
            return res.status(403).json({ message: "Only gig owner can delete the gig!"});
        
        await deleteAllFilesFromS3(allFiles);

        await Gig.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "Gig and its files deleted successfully"});
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to delete the gig!"});
    }
};

export const updateGig = async (req, res) => {
    try {
        const gig = await Gig.findById(req.params.id);
        if(!gig) return res.status(404).json({ message: "Gig not found!"});

        if(req.user._id.toString() !== gig.userId.toString())
            return res.status(403).json({ message: "Only gig owner can update the gig!"});

        const updatedGig = await Gig.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true}
        );

        res.status(200).json(updatedGig);
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to update the gig!"});
    }
};

export const updateGigState = async (req, res) => {
    const gigId = req.params.id;
    const { isPublished } = req.body;

    try {
        const gig = await Gig.findById(gigId);

        if(!gig)
            return res.status(404).json({ message: "Gig was not found!"});

        if(req.user._id.toString() !== gig.userId.toString())
            return res.status(403).json({ message: "Not authorized to change someone's else gig state!"});

        const updatedGig = await Gig.findByIdAndUpdate(
            gigId,
            { $set: { isPublished: isPublished }},
            { new: true }
        );

        res.status(200).json(updateGig);
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Some BACKEND error occured while updating gig's state!"});
    }
};