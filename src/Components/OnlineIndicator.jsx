import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { getSocket } from "../constants/socket";

const OnlineIndicator = ({ userId }) => {
  const [status, setStatus] = useState({
    isOnline: false,
    lastSeen: null,
  });
  const currentUserId = useSelector((store) => store.user?.data?._id);
  const socketRef = useRef();

  useEffect(() => {
    if (!userId || !currentUserId) return;

    const socket = getSocket();
    if (!socket) return;
    socketRef.current = socket;

    // 1. Check initial status
    const checkStatus = async () => {
      try {
        // First try Socket.IO for real-time status
        socket.emit("checkOnlineStatus", { userId }, (response) => {
          setStatus({
            isOnline: response.isOnline,
            lastSeen: response.lastSeen,
          });
        });
      } catch (err) {
        console.error("Status check failed:", err);
      }
    };

    //timeout to check status every 5 seconds
    checkStatus();
    const statusCheckInterval = setInterval(() => {
      checkStatus();
    }, 30000);
    statusCheckInterval;

    // 2. Listen for real-time updates
    socket.on("userStatusChanged", ({ userId: changedUserId, isOnline }) => {
      console.log("User status changed:", changedUserId, isOnline);
      if (changedUserId === userId) {
        setStatus((prev) => ({
          ...prev,
          isOnline,
          lastSeen: isOnline ? new Date() : prev.lastSeen,
        }));
      }
    });

    return () => {
      socket.off("userStatusChanged");
    };
  }, [userId, currentUserId]);

  // 3. Format last seen time
  const formatLastSeen = (date) => {
    if (!date) return "recently";
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 1) return "just now";
    if (minutes < 60) return `${Math.floor(minutes)} min ago`;
    //if more than 59than show hours if it is more thsn 24 hours then show last seen yesterday and is hours greadter than 48 than show last seen days ago
    if (minutes < 1440) return `${Math.floor(minutes / 60)} hours ago`;
    if (minutes < 2880) return "yesterday";
    if (minutes < 43200) return `${Math.floor(minutes / 1440)} days ago`;

    return `${Math.floor(minutes / 60)} hours ago`;
  };

  return (
    <div className='flex items-center gap-1'>
      <span
        className={`inline-block w-2 h-2 rounded-full ${
          status.isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {!status.isOnline && status.lastSeen && (
        <span className='text-xs text-gray-500'>
          {formatLastSeen(status.lastSeen)}
        </span>
      )}
    </div>
  );
};

export default OnlineIndicator;
