import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;  // 2MB
const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB

export const getPresignedUrl = async (req, res) => {
    try {
        const s3 = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        });

        const { fileName, fileType, fileSize } = req.query;

        if (!fileName || !fileType)
            return res.status(400).json({ message: "Missing fileName or fileType!" });

        const size = Number(fileSize);

        if (fileType.startsWith("image/") && size > MAX_IMAGE_SIZE) {
            return res.status(413).json({
                message: "Image size exceeds 2MB limit"
            });
        }

        if (fileType.startsWith("video/") && size > MAX_VIDEO_SIZE) {
            return res.status(413).json({
                message: "Video size exceeds 10MB limit"
            });
        }

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `upload/${Date.now()}-${fileName}`,
            ContentType: fileType
        };

        const uploadCommand = new PutObjectCommand(params);
        const uploadURL = await getSignedUrl(s3, uploadCommand, { expiresIn: 60 });

        const fileURL = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

        res.status(200).json({ uploadURL, key: params.Key, fileName, fileURL });
    } catch (error) {
        console.error("CUSTOM ERROR:", error);
        res.status(500).json({ message: "Failed to generate presigned URL" });
    }
};
