// socket.js
import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const createSocketConnection = ({ currentUserId }) => {
  if (!currentUserId) {
    console.warn("No user ID provided for socket connection.");
    return;
  }

  // Always reuse the same socket if already initialized
  if (!socket) {
    socket = io(BASE_URL, {
      query: { userId: currentUserId },
      transports: ["websocket"],
      withCredentials: true,
      autoConnect: false, // Prevent auto connect, we will call connect manually
    });

    // Debug events
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });
  }

  // Ensure it connects only if not connected
  if (!socket.connected) {
    socket.connect();
  }
};

export const getSocket = () => {
  if (!socket) {
    console.warn("Socket not initialized. Returning null.");
    return null;
  }
  return socket;
};
