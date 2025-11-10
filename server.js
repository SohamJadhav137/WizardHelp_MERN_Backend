import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import { authorizeRoles, protect } from "./middlewares/authMiddleware.js";
import gigRoutes from "./routes/gigRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import http from "http";
import { Server } from "socket.io";
import uploadRoutes from "./routes/uploadRoutes.js";

// It loads .env variables into process.env

const app = express();

app.use(cors({origin: "http://localhost:5173", methods: ["GET", "POST", "DELETE", "PUT"], credentials: true}));

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
    console.log(`🟢 ${username} at socket id connected: ${socket.id}`);

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`${username} joined conversation of Id: ${conversationId}`);
    });

    socket.on("send_message", (data) => {
        const {conversationId, text} = data;
        // console.log("Received message:",data);
        // io.emit("receiveMessage", data);
        const senderId = socket.userId;
        io.to(conversationId).emit("receive_message", {
            senderId,
            username: socket.username,
            text,
            createdAt: new Date()
        });
    });

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
app.use('/api/gigs', gigRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);

const PORT = process.env.PORT || 5000;

//////////////////// COMMENTING BELOW CODE FOR SOCKET.IO /////////////////////////

// app.listen(PORT, () => {
//     // Asyncshronously initiates connection to MongoDB
//     connectDB();
//     console.log(`Server running on port ${PORT}`);
// });

server.listen(PORT, () => console.log(`Server running on ${PORT}`));