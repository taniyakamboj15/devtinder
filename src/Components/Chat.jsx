import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/constants";
import { getSocket } from "../constants/socket";
import { useDispatch, useSelector } from "react-redux";
import {
  getSharedKey,
  encryptMessage,
  decryptMessage,
} from "../utils/encryption";
import fetchChats from "../utils/getAllChats";
import { FaArrowLeft } from "react-icons/fa";
const Chat = () => {
  const { targetUserId } = useParams();
  const [chatInfo, setChatInfo] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const [typing, setTyping] = useState(false);
  const [chatId, setChatId] = useState(null);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const chats = useSelector((store) => store.chats?.chats) || [];
  const userId = useSelector((store) => store.user?.data?._id);
  const data = useSelector((store) => store.user?.data) || {};
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { firstName, photoURL } = data;
  console.log("chatid :", chatId);
  // Generate shared key for E2EE (AES-256) once both IDs available
  const encryptionKey = useMemo(() => {
    if (!userId || !targetUserId) return null;
    return getSharedKey(userId, targetUserId);
  }, [userId, targetUserId]);

  // Fetch and decrypt chat history
  const fetchChatMessage = useCallback(async () => {
    if (!encryptionKey) return;
    try {
      const response = await fetch(`${BASE_URL}/chat/${targetUserId}`, {
        method: "GET",
        credentials: "include",
      });
      const { data } = await response.json();
      if (!data || !data.message) {
        console.error("No messages found or data is undefined");
        return;
      } else {
        console.log("Fetched chat messages:", data);
      }
      setChatId(data._id);
      const decrypted = data.message.map((msg) => ({
        ...msg,
        text: decryptMessage(msg.text, encryptionKey),
      }));
      setNewMessage(decrypted);
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  }, [targetUserId, encryptionKey]);

  // Fetch Friend Info
  const fetchChatFriendInfo = useCallback(async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/user/chat/info/${targetUserId}`,
        { method: "GET", credentials: "include" }
      );
      const { data } = await response.json();
      setChatInfo(data);
    } catch (err) {
      console.error("Error fetching chat info:", err);
    }
  }, [targetUserId]);
  // Setup socket connection
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;
    if (!socket || !userId || !targetUserId) return;
    // Join chat room
    socket.emit("joinChat", { userId, targetUserId, firstName });
    console.log("Socket connected and joined chat room:");
    const handleTyping = () => setTyping(true);
    const handleStopTyping = () => setTyping(false);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.emit("leaveChat", { userId, targetUserId });
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [userId, targetUserId, firstName]);

  // Handle messageReceived and seen logic separately after chatId is available
  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !chatId || !encryptionKey || !targetUserId || !userId)
      return;

    const handleMessage = async (message) => {
      const decryptedText = decryptMessage(message.text, encryptionKey);
      const fullMessage = { ...message, text: decryptedText };
      setNewMessage((prev) => [...prev, fullMessage]);
      fetchChats(dispatch);
      console.log("New message received:", fullMessage);
      if (fullMessage.senderId?._id === targetUserId) {
        try {
          // console.log("Marking message as seen for target user:", targetUserId);
          // await fetch(`${BASE_URL}/chats/${chatId}/seen`, {
          //   method: "PUT",
          //   credentials: "include",
          // });

          socket.emit("markSeen", {
            chatId,
            seenBy: userId,
            seenFor: targetUserId,
          });
          console.log("Message seen status updated for chatId:", chatId);
        } catch (error) {
          console.error("Error updating seen status:", error);
        }
      }
    };
    socket.on("messageSeen", (data) => {
      setNewMessage((prevMessages) =>
        prevMessages.map((msg) =>
          msg.senderId?._id === userId ? { ...msg, isSeen: true } : msg
        )
      );
      fetchChats(dispatch);
    });

    socket.on("messageReceived", handleMessage);

    return () => {
      socket.off("messageReceived", handleMessage);
    };
  }, [chatId, encryptionKey, targetUserId, userId, dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !targetUserId || !userId) return;
    socket.emit("markSeen", {
      chatId,
      seenBy: userId,
      seenFor: targetUserId,
    });
  }, [chatId, targetUserId, userId]);
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessage, typing]);

  useEffect(() => {
    if (targetUserId && chatId) {
      fetch(`${BASE_URL}/chats/${chatId}/seen`, {
        method: "PUT",
        credentials: "include",
      });
      // setNewMessage((prevMessages) =>
      //   prevMessages.map((msg) =>
      //     msg.senderId?._id === userId ? { ...msg, isSeen: true } : msg
      //   )
      // );
    }
  }, [chatId]);

  const sendMessage = () => {
    if (
      !socketRef.current ||
      !firstName ||
      !inputMessage.trim() ||
      !encryptionKey
    )
      return;
    const encrypted = encryptMessage(inputMessage.trim(), encryptionKey);

    socketRef.current.emit("sendMessage", {
      firstName,
      userId,
      targetUserId,
      text: encrypted,
      userImage: photoURL,
    });
    fetchChats(dispatch); // Update chat list after sending message
    setInputMessage("");
  };

  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
    if (socketRef.current) {
      socketRef.current.emit("typing", { userId, targetUserId });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("stopTyping", { userId, targetUserId });
      }, 1000);
    }
  };

  useEffect(() => {
    fetchChatFriendInfo();
    fetchChatMessage();
  }, [fetchChatFriendInfo, fetchChatMessage]);
  const handleBackToChatList = () => {
    navigate("/chat");
  };

  if (!chatInfo) return null;

  return (
    <div className='md:w-full h-full  bg-gradient-to-br from-teal-100 to-indigo-400 text-gray-500 md:border-2 border-fuchsia-50 rounded-lg relative flex flex-col md:mx-auto'>
      {/* Header */}
      <div className='w-full h-14 border-b border-black bg-primary rounded-t-lg flex justify-between items-center p-3'>
        <div className='flex items-center text-white text-2xl gap-4'>
          {isMobileView && (
            <button
              className='text-white hover:opacity-80 active:scale-90 transition-all'
              onClick={handleBackToChatList}
            >
              <FaArrowLeft size={20} />
            </button>
          )}
          <img
            className='w-12 h-12 object-contain rounded-full  bg-amber-50'
            alt='Profile'
            src={chatInfo.photoURL}
          />
          <div>
            <span>
              {chatInfo.firstName} {chatInfo.lastName}
            </span>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className='flex-1 overflow-y-auto md:px-4 px-2 py-2'>
        {newMessage.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.senderId?._id === userId ? "chat-end" : "chat-start"
            }`}
          >
            <div className='chat-image avatar'>
              <div className='w-10 rounded-full'>
                <img alt='Profile' src={msg.senderId?.photoURL} />
              </div>
            </div>
            <div className='chat-header'>
              {msg.senderId?._id === userId ? "You" : msg.senderId?.firstName}
              <time className='text-xs opacity-50 ml-2'>
                {new Date(msg?.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </time>
            </div>
            <div
              className={`chat-bubble ${
                msg.senderId?._id === userId ? "bg-gray-100" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </div>
            <div>
              {msg.senderId?._id === userId && (
                <span className='text-xs'>
                  {msg.isSeen ? "✓✓ Seen" : "✓ Sent"}
                </span>
              )}
            </div>
          </div>
        ))}
        {/* Typing Indicator */}
        {typing && (
          <div className='w-full  py-2 bg-transparent'>
            <div className='flex items-center gap-2'>
              <div className=' flex items-center justify-center'>
                <img
                  className='w-10 h-10 rounded-full object-cover'
                  alt='Profile'
                  src={chatInfo.photoURL}
                />
              </div>
              <div className='flex items-center gap-1'>
                <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce'></div>
                <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-100'></div>
                <div className='w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-200'></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input and Send Button */}
      <div className='w-full h-16 border-t border-black bg-white p-2 flex gap-2'>
        <input
          placeholder='Type your message'
          className='flex-1 bg-white text-black border border-black p-2 rounded-lg focus:outline-none focus:border-primary'
          value={inputMessage}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className='px-4 py-2 bg-primary text-white rounded-lg hover:opacity-80 active:scale-90 transition-all'
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
