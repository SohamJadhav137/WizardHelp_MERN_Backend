import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        gigId: { type: mongoose.Schema.Types.ObjectId, ref: "Gig", required: true },
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: "order", required: true},
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        price: { type: Number, required: true},   
        duration: { type: Number, required: true},   
    },
    { timestamps: true }
);

const Review = mongoose.model("review", reviewSchema);
export default Review;