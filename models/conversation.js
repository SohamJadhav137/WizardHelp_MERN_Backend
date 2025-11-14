import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        sellerName: { type: String, required: true},
        buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        buyerName: { type: String, required: true},
        readBySeller: { type: Boolean, default: false },
        readByBuyer: { type: Boolean, default: false },
        lastMessage: { type: String }
    },
    { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;