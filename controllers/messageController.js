import Conversation from "../models/conversation.js";
import Message from "../models/message.js";


export const sendMessage = async (req, res) => {
    try{

        const {conversationId, text} = req.body;
        
        const conv = await Conversation.findById(conversationId);
        
        if(!conv) return res.status(400).json({ message: "Conversation not found!"});
        
        const message = new Message({
            conversationId,
            senderId: req.user._id,
            text
        });
        
        const saved = await message.save();
        
        conv.lastMessage = text;
        
        if(req.user._id.toString() === conv.sellerId.toString()){
            conv.readBySeller = true;
            conv.readByBuyer = false;
        }
        else{
            conv.readBySeller = false;
            conv.readByBuyer = true;
        }
        
        await conv.save();
        
        return res.status(201).json(saved);
    } catch(error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Error in fecthing messages!"});
    }
};

export const getMessages = async (req, res) => {
    try{
        const conversationId = req.params.id;
        console.log("Conversation ID:", conversationId);
        if(!conversationId) return res.status(400).json({ message: "CoversationId required!"});

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        
        return res.status(200).json(messages);
    } catch(error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Error in fetching messages!"});
    }
};