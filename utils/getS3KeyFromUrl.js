export const getS3KeyFromUrl = (fileUrl) => {
    try {
        const url = new URL(fileUrl);
        const key = url.pathname.substring(1);
        return decodeURIComponent(key);
    } catch (error) {
        console.error("Invalid file URL:\n", error);
        return null;
    }
};