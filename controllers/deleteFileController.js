import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";

export const deleteFileController = async (req, res) => {
    try {
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });
        const { s3Key } = req.body;

        if (!s3Key) {
            return res.status(400).json({ message: 'File key is missing!' });
        }

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key
        };

        const deleteCommand = new DeleteObjectCommand(params);
        await s3Client.send(deleteCommand);

        console.log(`Deleted successfully S3 object: ${s3Key}`);
        res.status(200).json({ message: 'File deleted successfully from S3' });
    } catch (error) {
        console.error('S3 CUSTOM ERROR:', error);
        return res.status(500).json({ message: 'Failed to delete file from s3 bucket!' });
    }
}

export const deleteFileByUrlController = async (req, res) => {
    try {
        const { fileURL } = req.body;

        if (!fileURL) {
            return res.status(400).json({ message: "File URL is missing!" });
        }

        const splitToken = ".amazonaws.com/";
        const keyIndex = fileURL.indexOf(splitToken);

        if (keyIndex === -1) {
            return res.status(400).json({ message: "Invalid S3 file URL!" });
        }

        const s3Key = fileURL.substring(keyIndex + splitToken.length);

        if (!s3Key) {
            return res.status(400).json({ message: "Failed to extract S3 key from URL!" });
        }

        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: s3Key
        };

        await s3Client.send(new DeleteObjectCommand(params));

        console.log(`Deleted S3 object via URL: ${s3Key}`);

        res.status(200).json({
            message: "File deleted successfully from S3",
            deletedKey: s3Key
        });

    } catch (error) {
        console.error("S3 URL DELETE ERROR:", error);
        res.status(500).json({
            message: "Failed to delete file from S3 using URL"
        });
    }
};
