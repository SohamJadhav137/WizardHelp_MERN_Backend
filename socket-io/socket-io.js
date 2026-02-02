import { Server } from "socket.io";
import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

let io = null;

export const initSocket = (server) => {
    console.log("Init socket initiated!!!")
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true
        }
    });


    // Things to perform after client connects with the server
    io.on("connection", (socket) => {
        const { userId, username } = socket.handshake.auth;

        if(!userId){
            socket.disconnect();
            return;
        }

        socket.userId = userId;
        socket.username = username;
        console.log(`🟢 Backend connected to frontend at socket id: ${socket.id}`);

        socket.on("join-user-room", (userId) => {
            socket.join(`user:${userId}`);
            console.log(`User ${socket.username} joined its own room at id: ${userId}`);
        });

        socket.on("join_conversation", (conversationId) => {
            socket.join(`conv:${conversationId}`);
            console.log(`💬 ${username} joined conversation of Id: ${conversationId}`);
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

                const updatedConv = await Conversation.findByIdAndUpdate(
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

                io.to(`conv:${messageData.conversationId}`).emit("receive_message", broadcastMessage);

                const { buyerId, sellerId } = updatedConv;

                io.to(`user:${buyerId}`).emit('last_message_update', {
                    conversationId: updatedConv._id,
                    lastMessage: updatedConv.lastMessage,
                    updatedAt: updatedConv.updatedAt
                });

                io.to(`user:${sellerId}`).emit('last_message_update', {
                    conversationId: updatedConv._id,
                    lastMessage: updatedConv.lastMessage,
                    updatedAt: updatedConv.updatedAt
                });
            } catch (error) {
                console.error("CUSTOM ERROR:", error);
                socket.emit('messageError', { text: 'Failed to send message!' });
            }
        });

        socket.on("leave_conversation", (conversationId) => {
            const room = `conv:${conversationId}`;

            if (socket.rooms.has(room)) {
                socket.leave(conversationId);
                console.log(`❌ ${socket.username} left conversation room Id: ${conversationId}`);
            }
        })

        socket.on("disconnect", (reason) => {
            console.log(`🔴 Frontend got disconnected from socket | Reason: ${reason}`);
        });
    });

    return io;
}


export const getIO = () => {
    return io;
}