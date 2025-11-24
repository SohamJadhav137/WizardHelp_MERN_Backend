import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        gigId: { type: mongoose.Types.ObjectId, ref: "Gig", required: true },
        sellerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        buyerId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
        price: { type: Number, required: true },
        status: { type: String, enum: ["active", "delivered", "completed", "revision", "request-cancellation", "cancelled"], default: "active"},
        deliveryFiles: { type: [
            {
                url: { type: String, required: true},
                fileName: { type: String, required: true},
                fileType: { type: String, required: true},
                fileSize: { type: Number, required: true},
            }
        ], default: []},
        sellerNote: { type: String, default: "" },
        buyerNote: { type: String, default: "" },
        deliveredAt: { type: Date, default: null },
        completedAt: { type: Date, default: null },
        dueDate: { type: Date, required: true},
        totalRevisions: { type: Number, required: true },
        revisionCount: { type: Number, default: 0 },
        cancellationRequestedBy: { type: String, enum: ['buyer', 'seller'], default: null},
        cancellationReason: { type: String },
        previousStatus: { type: String,  enum: ["active", "delivered", "revision", null], default: null}
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;