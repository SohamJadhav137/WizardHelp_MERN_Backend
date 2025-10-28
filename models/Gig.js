import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: { type: String, required: true },
        coverImage: { type: String, default: "" },
        images: { type: [String], default: [] },
        price: { type: Number, required: true },
        shortTitle: { type: String },
        shortDesc: { type: String },
        starRating: { type: Number, default: 0 },
        totalreviews: { type: Number, default: 0 },
        revisionNumber: { type: Number },
        features: { type: [String] }
    },
    { timestamps: true }
);

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;