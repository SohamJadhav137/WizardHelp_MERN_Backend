import express from "express";
import dotenv from "dotenv";
// It loads .env variables into process.env
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authorizeRoles, protect } from "./middlewares/authMiddleware.js";
import gigsRoutes from "./routes/gigsRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

import http from "http";
import uploadRoutes from "./routes/uploadRoutes.js";
import catRoutes from './routes/catRoutes.js';
import Message from "./models/message.js";
import Conversation from "./models/conversation.js";
import deleteRoute from "./routes/deleteFileRoute.js";
import userRoutes from "./routes/userRoutes.js";
import { initSocket } from "./socket-io/socket-io.js";

const app = express();

app.use(cors({origin: "http://localhost:5173", methods: ["GET", "POST", "DELETE", "PUT", "PATCH"], credentials: true}));
// cors: cross origin resource sharing
// credentials: It allows requests to include credentials like cookies, authorization headers, JWT in cookies etc. 

const server = http.createServer(app);

// Linking socket.io with http server
initSocket(server);

app.use(express.json());

connectDB();

// It allows frontend at port 5173 to communicate with this server
// app.use(cors()); // Temporarily allow all originss
// Parse incoming JSON data in the request body
// Parse cookies from incoming request
// app.use(cookieParser());

// app.get('/api/logged-in', protect, (req, res) => {
    //     res.json({ message: `Welcome ${req.user.name}`, user: req.user });
    // });
    
// app.get('/api/seller-only', protect, authorizeRoles("seller"), (req, res) => {
    //     res.json({ message: `Hello seller ${req.user.name}`});
    // });
        
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/category', catRoutes);
app.use('/api/s3', deleteRoute);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;

//////////////////// COMMENTING BELOW CODE FOR SOCKET.IO /////////////////////////

// app.listen(PORT, () => {
//     // Asyncshronously initiates connection to MongoDB
//     connectDB();
//     console.log(`Server running on port ${PORT}`);
// });

server.listen(PORT, () => console.log(`Server running on ${PORT}`));