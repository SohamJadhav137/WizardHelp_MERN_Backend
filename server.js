import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authorizeRoles, protect } from "./middlewares/authMiddleware.js";
import gigRoutes from "./routes/gigRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
// It loads .env variables into process.env
dotenv.config();

const app = express();

// It allows frontend at port 5173 to communicate with this server
// app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use(cors()); // Temporarily allow all origins
// Parse incoming JSON data in the request body
app.use(express.json());
// Parse cookies from incoming request
app.use(cookieParser());


// app.get('/api/logged-in', protect, (req, res) => {
    //     res.json({ message: `Welcome ${req.user.name}`, user: req.user });
    // });
    
// app.get('/api/seller-only', protect, authorizeRoles("seller"), (req, res) => {
    //     res.json({ message: `Hello seller ${req.user.name}`});
    // });
        
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // Asyncshronously initiates connection to MongoDB
    connectDB();
    console.log(`Server running on port ${PORT}`);
});