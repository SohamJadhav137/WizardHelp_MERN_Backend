import Gig from "../models/Gig.js";
import Review from "../models/review.js";

export const submitReview = async (req, res) => {
    try {
        const { rating, comment, gigId, buyerId, id, price, duration } = req.body;

        if (!rating) {
            return res.status(400).json({ error: "Rating is empty!" })
        }

        if (!comment) {
            return res.status(400).json({ error: "Comment is empty!" })
        }

        const newReview = new Review({
            rating,
            comment,
            gigId,
            buyerId,
            orderId: id,
            price,
            duration
        });

        await newReview.save();

        const gig = await Gig.findById(gigId);

        gig.totalReviews += 1;
        gig.totalRatingSum += rating;
        gig.starRating = gig.totalRatingSum / gig.totalReviews;

        await gig.save();

        res.status(201).json({ success: true, message: "Review was created successfully" });
    } catch (error) {
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json("Server error:", error);
    }
};

export const fetchSingleReview = async (req, res) => {
    try {
        const review = await Review.findOne({ orderId: req.params.id });

        if (!review) {
            return res.status(404).json({ error: "Buyer review not found!" });
        }
        
        res.status(200).json({ rating: review.rating, comment: review.comment, reviewDate: review.createdAt});
    } catch(error){
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json({ error: "Server side error:" });
    }
};

export const fetchGigReviews = async (req, res) => {
    try{
        const reviews = await Review.find({ gigId: req.params.id }).populate("buyerId", "username").sort({ createdAt: -1 });

        if(!reviews)
            return res.status(404).json({ error: "Gig has no reviews" });

        res.status(200).json(reviews);
    } catch(error){
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json({ error: "Server side error" });
    }
};