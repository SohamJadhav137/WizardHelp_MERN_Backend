import mongoose from "mongoose";

const messageSchema = mongoose.Schema(
    {
        conversationId: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true },
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true }
    },
    { timeStamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;