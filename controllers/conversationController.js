import Conversation from "../models/conversation.js";

export const createConversation = async (req, res) => {
    try {
        const { sellerId, buyerId } = req.body;
        
        const existing = await Conversation.findOne({ sellerId, buyerId});
        
        if(existing)
            res.status(200).json(existing);
        
        const conversation = new Conversation({ sellerId, buyerId });
        const saved = await conversation.save();
        
        res.status(201).json(saved);
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to create conversation!" });
    }
};

export const getConversations = async (req, res) => {
    try {
        const filter =
            req.user.role === "seller" ?
            { sellerId: req.user._id } : { buyerId: req.user._id };

        const conversations = await Conversation.find(filter)
            .sort({ updatedAt: -1})
            .populate("sellerId buyerId", "username email");
        
        res.status(200).json(conversations);
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to retrieve conversations!" });
    }
};