import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        gigId: { type: mongoose.Types.ObjectId, ref: "Gig", required: true },
        sellerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        buyerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        price: { type: Number, required: true },
        status: { type: String, enum: ["active", "delivered", "completed", "cancelled"], default: "active"},
        deliveryFiles: { type: [String], default: []},
        sellerNote: { type: String, default: "" },
        buyerNote: { type: String, default: "" }
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;