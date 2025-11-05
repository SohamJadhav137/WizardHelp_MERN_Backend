import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        coverImageURL: { type: String, default: "" },
        imagesURLs: { type: [String], default: [] },
        videoURL: { type: String, default: null},
        docURLs: { type: [String], default: []},
        tags: { type: [String], default: []},
        price: { type: Number, required: true },
        revisions: { type: Number, required: true},
        deliveryDays: { type: Number, required: true},
        starRating: { type: Number, default: 0 },
        totalreviews: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;