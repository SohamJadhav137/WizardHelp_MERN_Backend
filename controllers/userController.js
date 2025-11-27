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