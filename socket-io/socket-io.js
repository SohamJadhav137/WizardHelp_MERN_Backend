import { Server } from "socket.io";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });


    // Things to perform after client connects with the server
    io.on("connection", (socket) => {
        const { userId, username } = socket.handshake.auth;
        socket.userId = userId;
        socket.username = username;
        console.log(`🟢 ${username} connected at socket id: ${socket.id}`);

        socket.on("joinRoom", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

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
            } catch (error) {
                console.error("CUSTOM ERROR:", error);
                socket.emit('messageError', { text: 'Failed to send message!' });
            }
        });

        socket.on("leave_conversation", (conversationId) => {
            if (socket.rooms.has(conversationId)) {
                socket.leave(conversationId);
                console.log(`${socket.username} left conversation room Id: ${conversationId}`);
            }
        })

        socket.on("disconnect", () => {
            console.log(`🔴 ${username} got disconnected from socket id: ${socket.id}`);
        });
    });

    return io;
}


export const getIO = () => {
    return io;
}