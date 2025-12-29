import { GetObjectCommand } from "@aws-sdk/client-s3";
import Order from "../models/order.js";
import s3 from "../config/s3.js";

export const fetchFilePreview = async (req, res) => {
    const { orderId, fileId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.sendStatus(404);

    const file = order.deliveryFiles.id(fileId);
    if (!file) return res.sendStatus(404);

    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.key
    });

    const { Body, ContentType } = await s3.send(command);

    res.setHeader("Content-Type", ContentType);
    res.setHeader("Content-Disposition", "inline");

    Body.pipe(res);
};