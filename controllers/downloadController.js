import { GetObjectCommand } from "@aws-sdk/client-s3";
import Order from "../models/order.js";
import s3 from "../config/s3.js";

export const downloadFile = async (req, res) => {
    try{
        const {orderId, fileId} = req.params;
        const order = await Order.findById(orderId);

        if(!order) return res.status(404).json({ message: "Order not found!" });

        // const userId = req.user.id.toString();
        // if(userId !== order.buyerId.toString() && userId !== order.sellerId.toString())
        //     return res.status(403).json({ message: "Not Authorized!" });

        const file = order.deliveryFiles.id(fileId);
        if(!file) return res.status(404).json({ message: "File not found" });

        const commmand = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: file.key
        });

        const { Body, ContentType } = await s3.send(commmand);

        res.setHeader("Content-Disposition", `attachment; filename="${file.fileName}"`);
        res.setHeader("Content-Type", ContentType || "application/octet-stream");

        Body.pipe(res);
    } catch(error){
        console.error("CUSTOM ERROR:", error);
        res.status(500).json({ message: "Failed to delete S3 file!"});
    }
}