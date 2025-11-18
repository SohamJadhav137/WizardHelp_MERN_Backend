import Conversation from "../models/conversation.js";

export const createConversation = async (req, res) => {
    try {
        const { sellerId, sellerName, buyerId, buyerName } = req.body;

        if (existing)
            res.status(200).json(existing);
        else {
            const conversation = new Conversation({ sellerId, sellerName, buyerId, buyerName });
            const saved = await conversation.save();
            // res.status(201).json(saved);
            res.status(201).json({ message: "New conversation added to messages" });
        }
    } catch (error) {
        console.error("CUSTOM ERROR:", error);
        res.status(500).json({ message: "Failed to create conversation!" });
    }
};

export const getConversations = async (req, res) => {
    const filter =
        req.user.role === "seller" ?
            { sellerId: req.user._id } : { buyerId: req.user._id };
    try {

        const conversations = await Conversation.find(filter)
            .sort({ updatedAt: -1 })
            .populate("sellerId buyerId", "username email");

        res.status(200).json(conversations);
    } catch (error) {
        console.error("CUSTOM ERROR:", error);
        res.status(500).json({ message: "Failed to retrieve conversations!" });
    }
};

export const getSingleConversation = async (req, res) => {

    const senderId = req.user.id;
    const recipientId = req.params.id;
    let sellerId;
    let buyerId;
    if(req.user.role === 'buyer'){
        buyerId = senderId;
        sellerId = recipientId;
    }
    else{
        sellerId = senderId;
        buyerId = recipientId;
    }

    console.log("Sender Id: ", senderId);
    console.log("Recipient Id: ", recipientId);

    if (!senderId && !recipientId)
        return res.status(400).json({ message: "Either or both ids are missing!" });

    try {
        const conversation = await Conversation.findOne({ buyerId, sellerId });

        if(!conversation)
            return res.status(400).json({ message: "Conversation not found!" });

        res.status(200).json(conversation);
    } catch (error) {
        console.error("CUSTOM ERROR:", error);
        res.status(500).json({ message: "Failed to retrieve single conversation!" });
    }
}