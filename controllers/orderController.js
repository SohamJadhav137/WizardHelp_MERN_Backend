import Gig from "../models/Gig.js";
import Order from "../models/order.js";
import { getIO } from "../socket-io/socket-io.js";

export const createOrder = async (req, res) => {
    try{
        const gig = await Gig.findById(req.params.gigId);
        if(!gig) res.status(404).json({ message: "Gig not found!"});
        if(req.user.id.toString() === gig.userId.toString())
            return res.status(403).json({ message: "You cannot buy your own gig!"});

        const initalDeliveryDays = gig.deliveryDays;
        const dueDate = new Date(Date.now() + initalDeliveryDays * 24 * 60 * 60 * 1000);
        
        const newOrder = new Order ({
            gigId: gig._id,
            buyerId: req.user._id,
            sellerId: gig.userId,
            price: gig.price,
            dueDate: dueDate,
            totalRevisions: gig.revisions
        });        
        
        await newOrder.save();

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

export const markAsDelivered = async (req, res) => {
    const io = getIO();
    try{
        const { deliveryFiles, sellerNote } = req.body;
        // console.log("Delivery Files:\n", deliveryFiles);
        // console.log("Seller Note:\n", sellerNote);
        // console.log("Files length:", deliveryFiles.length);
        if(!Array.isArray(deliveryFiles) || deliveryFiles.length === 0){
            return res.status(400).json({ error: 'No files are attached' });
        }
        const order = await Order.findById(req.params.id);
        if(!order) return res.status(404).json({ message: "Order not found!" });

        // console.log("Requesting userId:", req.user.id);
        // console.log("Buyer Id:", order.buyerId.toString());
        
        if(req.user._id.toString() === order.buyerId.toString())
            return res.status(403).json({ message: "Only seller can mark order as delivered!" });
        
        order.status = "delivered";
        order.deliveryFiles = deliveryFiles.map(file => ({
            url: file.url,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size
        }));

        order.sellerNote = sellerNote;
        order.deliveredAt = new Date();

        await order.save();

        io.to(order.buyerId.toString()).emit("orderDelivered", {
           updatedOrder: order
        });
        
        res.status(200).json({ message: "Order status marked as delivered", updatedAt: order.updatedAt });
    } catch (error) {
        console.error("CUSTOM ERROR:",error);
        res.status(500).json({ message: "Failed to mark order as delivered!" });
    }
};

export const markAsCompleted = async (req, res) => {
    const { buyerNote } = req.body;
    const io = getIO();

    try{
        const order = await Order.findById(req.params.id);
        
        if(!order)
            return res.status(404).json({ error: "Order not found" });
        
        if(req.user.id.toString() === order.sellerId.toString()){
            return res.status(403).json({ error: "Only buyer can mark order as complete" })
        }
        
        order.status = "completed";
        order.buyerNote = buyerNote;
        order.completedAt = new Date();

        await order.save();

        await Gig.findByIdAndUpdate(order.gigId, {
            $inc: { orders: 1 }
        });

        io.to(order.sellerId.toString()).emit("orderCompleted", {
            updatedOrder: order
        });

        io.to(order.buyerId.toString()).emit("orderCompleted", {
            updatedOrder: order
        });
        
        res.status(201).json({ message: "Order was successfully completed" });

    } catch(error){
        console.error("CUSTOM ERROR:", error);
        return res.status(500).json({ error: "Failed to mark order as completed" });
    }
    
}

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

export const requestRevision = async (req, res) => {
    const { buyerNote } = req.body;
    const io = getIO();

    try{
        const order = await Order.findById(req.params.id);

        if(!order)
            return res.status(404).json({ error: "Order not found" });

        if(req.user.id.toString() !== order.buyerId.toString())
            return res.status(403).json({ error: "Only buyer can request for revision" });

        order.status = "revision";
        order.buyerNote = buyerNote;

        if(order.revisionCount === order.totalRevisions){
            return res.status(400).json({ message: "Revision limit reached!" });
        }
        else{
            order.revisionCount += 1;
        }

        io.to(order.sellerId.toString()).emit("orderRevision", {
            updatedOrder: order
        });
        
        await order.save();
        
        res.json(201).json({ message: "Revision request is sent to seller" });
    } catch(error){
        console.error("CUSTOM ERROR:", error);
        res.status(500).json({ error: "Backend error occured while sending revision request"});
    }
}