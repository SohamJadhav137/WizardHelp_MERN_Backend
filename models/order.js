import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        gigId: { type: mongoose.Types.ObjectId, ref: "Gig", required: true },
        sellerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        buyerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        price: { type: Number, required: true },
        paymentIntent: { type: String },
        isCompleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;