import Conversation from "../models/conversation.js";
import User from "../models/user.js";

export const createConversation = async (req, res) => {
    try {
        const { sellerId, sellerName, buyerId, buyerName } = req.body;
        // console.log(`Buyer Id: ${buyerId}\nBuyer Name: ${buyerName}\nSeller Id: ${sellerId}\nSeller Name:${sellerName}`)

        const existing = await Conversation.findOne({ sellerId, buyerId });
        if (existing) {
            return res.status(200).json(existing);
        }

        const conversation = new Conversation({ sellerId, sellerName, buyerId, buyerName });
        await conversation.save();
        
        res.status(201).json({ message: "New conversation added to messages" });

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

    try {
        const senderId = req.user.id;
        const recipientId = req.params.id;
        let sellerId;
        let buyerId;

        if (req.user.role === 'buyer') {
            buyerId = senderId;
            sellerId = recipientId;
        }
        else {
            sellerId = senderId;
            buyerId = recipientId;
        }

        if (!senderId && !recipientId)
            return res.status(400).json({ message: "Either or both ids are missing!" });

        let conversation = await Conversation.findOne({ buyerId, sellerId });

        if (conversation) {
            res.status(200).json(conversation);
        }

        const buyer = await User.findById(buyerId).select("username");
        const seller = await User.findById(sellerId).select("username");

        conversation = new Conversation({
            sellerId,
            buyerId,
            sellerName: seller.username,
            buyerName: buyer.username
        });

        res.status(201).json(conversation);

    } catch (error) {
        console.error("CUSTOM ERROR:", error);
        res.status(500).json({ message: "Failed to retrieve single conversation!" });
    }
}

export const singleConv = async (req, res) => {
    const { convId } = req.params.id;
    // try{
    //     if(!convId){
    //         return res.status(404).json({ error: 'Conversation not found!' });
    //     }

    //     const conv = await Conversation.findById(convId);

    // }
}