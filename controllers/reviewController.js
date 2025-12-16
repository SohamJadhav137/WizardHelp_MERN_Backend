import Gig from "../models/Gig.js";
import Order from "../models/order.js";
import Review from "../models/review.js";
import User from "../models/user.js";

export const submitReview = async (req, res) => {
    try {
        const { rating, comment, gigId, buyerId, id, price, duration, sellerId } = req.body;

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
        gig.starRating = Math.round((gig.totalRatingSum / gig.totalReviews) * 10) / 10;

        await gig.save();

        const order = await Order.findById(id);
        order.isReviewed = true;
        await order.save();

        const seller = await User.findById(sellerId);
        seller.ratingSum += rating;
        seller.ratingCount += 1;
        seller.rating = seller.ratingSum / seller.ratingCount;

        await seller.save();
        
        res.status(201).json({ reviewDate: newReview.createdAt });
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
        
        res.status(200).json({ rating: review.rating, comment: review.comment, reviewDate: review.createdAt });
    } catch(error){
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json({ error: "Server side error:" });
    }
};

export const fetchGigReviews = async (req, res) => {
    try{
        const reviews = await Review.find({ gigId: req.params.id }).populate("buyerId", "username country").sort({ createdAt: -1 });

        if(!reviews)
            return res.status(404).json({ error: "Gig has no reviews" });

        res.status(200).json(reviews);
    } catch(error){
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json({ error: "Server side error" });
    }
};

export const submitBuyerRating = async (req, res) => {
    try{
        const { rating, buyerId, orderId } = req.body;
        const buyer = await User.findById(buyerId);

        buyer.ratingSum += rating;
        buyer.ratingCount += 1;
        buyer.rating = ((buyer.ratingSum / buyer.ratingCount) * 10) / 10;

        await buyer.save();

        const order = await Order.findById(orderId);
        order.isBuyerRated = true;
        order.buyerRating = rating;

        await order.save();
        res.status(200).json({ success: true, message: "Buyer rating & order updated successfully" });
    } catch(error){
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json({ error: "Server side error:" });
    }
}

export const fetchBuyerRating = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);

        if(!order)
            return res.status(404).json({ error: "Order not found!" });

        res.status(200).json({rating: order.buyerRating});
    } catch(error){
        console.error("CUSTOM ERROR:\n", error);
        return res.status(500).json({ error: "Server side error!" });
    }
};