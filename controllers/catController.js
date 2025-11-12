import Gig from "../models/Gig.js";

export const getGigsByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const gigs = await Gig.find({ category, isPublished: true });
        res.status(200).json(gigs);
    } catch (error) {
        console.error("CUSTOM ERROR:",error.message);
        res.status(500).json({ message: "Failed to fetch gigs category wise" });
    }
}