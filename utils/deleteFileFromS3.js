import { DeleteObjectsCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION
});

export const deleteFilesFromS3 = async (fileURLs) => {
    if(!fileURLs) return;

    const ObjectsToDelete = fileURLs.map(url => {
        const parts = url.split('/');
        const key = parts.slice(3).join('/');
        return { Key: key};
    });

    const input = {
        Bucket: process.env.S3_BUCKET_NAME,
        Delete: { Objects: ObjectsToDelete }
    };

    try {
        const deleteCommand = new DeleteObjectsCommand(input);
        const response = await s3Client.send(deleteCommand);

        console.log("Deletion status:",response);
    } catch (error) {
        console.error("S3 CUSTOM ERROR:",error);
        throw error;
    }
}