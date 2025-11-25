import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        sellerName: { type: String, required: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        category: {
            type: String,
            enum: [
                "Software Development",
                "Video Editing",
                "Writing & Translation",
                "Finance",
                "Digital Marketing",
                "Data Analytics",
                "Music & Audio",
            ],
            required: true 
        },
        coverImageURL: { type: String, default: "" },
        imageURLs: { type: [String], default: [] },
        videoURL: { type: String, default: null},
        docURLs: { type: [String], default: []},
        tags: { type: [String], default: []},
        price: { type: Number, required: true },
        revisions: { type: Number, required: true},
        deliveryDays: { type: Number, required: true},
        starRating: { type: Number, default: 0 },
        totalRatingSum: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        isPublished: { type: Boolean, default: false },
        orders: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;