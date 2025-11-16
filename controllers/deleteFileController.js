import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getS3KeyFromUrl } from "../utils/getS3KeyFromUrl.js";
import { S3Client } from "@aws-sdk/client-s3";


export const deleteFileController = async (req, res) => {
    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
    });
    const { fileUrl } = req.body;

    if(!fileUrl){
        return res.status(400).json({ message: 'File URL not found!' });
    }

    const key = getS3KeyFromUrl(fileUrl);

    if(!key){
        return res.status(400).json({ message: 'Cannot parse s3 key!' });
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key
    };

    try {
        const deleteCommand = new DeleteObjectCommand(params);
        await s3Client.send(deleteCommand);

        console.log(`Deleted successfully S3 object: ${key}`);
        res.status(200).json({ message: 'File deleted successfully from S3' });
    } catch (error) {
        console.error('S3 CUSTOM ERROR:', error);
        res.status(500).json({ message: 'Failed to delete file from s3 bucket!' });
    }
}