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
import { Server } from "socket.io";
import uploadRoutes from "./routes/uploadRoutes.js";
import catRoutes from './routes/catRoutes.js';
import Message from "./models/message.js";
import Conversation from "./models/conversation.js";
import deleteRoute from "./routes/deleteFileRoute.js";

const app = express();

app.use(cors({origin: "http://localhost:5173", methods: ["GET", "POST", "DELETE", "PUT", "PATCH"], credentials: true}));
// cors: cross origin resource sharing
// credentials: It allows requests to include credentials like cookies, authorization headers, JWT in cookies etc. 

////////////// Socket.io setup ///////////////////////

const server = http.createServer(app);

// Linking socket.io with http server
const io = new Server(server, {
    cors : {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(express.json());

connectDB();

// Things to perform after client connects with the server
io.on("connection", (socket) => {
    const { userId, username } = socket.handshake.auth;
    socket.userId = userId;
    socket.username = username;
    console.log(`🟢 ${username} connected at socket id: ${socket.id}`);

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`${username} joined conversation of Id: ${conversationId}`);
    });

    socket.on("send_message", async (messageData) => {
        console.log(messageData)

        try {
            const newMessage = new Message({
                conversationId: messageData.conversationId,
                senderId: messageData.senderId,
                text: messageData.text
            });

            const savedMessage = await newMessage.save();

            await Conversation.findByIdAndUpdate(
                messageData.conversationId,
                {
                    lastMessage: messageData.text,
                    updatedAt: Date.now()
                },
                { new: true }
            );
            
            const broadcastMessage = {
                ...savedMessage.toObject(),
                senderId: {
                    _id: socket.userId,
                    username: socket.username
                }
            };

            io.to(messageData.conversationId).emit("receive_message", broadcastMessage);
        } catch(error) {
            console.error("CUSTOM ERROR:", error);
            socket.emit('messageError', { text: 'Failed to send message!' });
        }
    });

    socket.on("leave_conversation", (conversationId) => {
        if(socket.rooms.has(conversationId)) {
            socket.leave(conversationId);
            console.log(`${socket.username} left conversation room Id: ${conversationId}`);
        }
    })

    socket.on("disconnect", () => {
        console.log(`🔴 ${username} got disconnected from socket id: ${socket.id}`);
    });    
});

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

const PORT = process.env.PORT || 5000;

//////////////////// COMMENTING BELOW CODE FOR SOCKET.IO /////////////////////////

// app.listen(PORT, () => {
//     // Asyncshronously initiates connection to MongoDB
//     connectDB();
//     console.log(`Server running on port ${PORT}`);
// });

server.listen(PORT, () => console.log(`Server running on ${PORT}`));