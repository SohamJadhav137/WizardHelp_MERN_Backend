import Gig from "../models/Gig.js";
import Order from "../models/order.js";

export const createOrder = async (req, res) => {
    try{
        const gig = await Gig.findById(req.params.gigId);
        if(!gig) res.status(404).json({ message: "Gig not found!"});
        if(req.user.id.toString() === gig.userId.toString())
            return res.status(403).json({ message: "You cannot buy your own gig!"});
        
        const newOrder = new Order ({
            gigId: gig._id,
            buyerId: req.user._id,
            sellerId: gig.userId,
            price: gig.price
        });
        
        const savedOrder = await newOrder.save();
        // res.status(201).json(savedOrder);
        res.status(201).json({ message: "Order placed successfully!" });
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to create the order!"});
    }
};

export const getOrders = async (req, res) => {
    try{
        let filter = {};
        
        if(req.user.role === "seller") filter.sellerId = req.user._id;
        else filter.buyerId = req.user._id;
        
        const orders = await Order.find(filter).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to fetch orders!"});
    }
};

export const markAsComplete = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({ message: "Order not found!" });
        
        if(req.user._id.toString() !== order.sellerId.toString())
            return res.status(403).json({ message: "Only seller can mark order as complete!" });
        
        order.isCompleted = true;
        await order.save();
        
        res.status(200).json({ message: "Order marked as complete" });
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to mark order as complete!" });
    }
};

export const getSingleOrder = async (req, res) => {
    try{
        const order = await Order.findById(req.params.id);
        
        if(!order)
            res.status(400).json({ message: "Order not found!"});

        res.status(200).json(order);
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to fetch orders!"});
    }
}