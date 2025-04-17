import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../constants/constants";
import { createSocketConnection } from "../constants/socket";
import { useSelector } from "react-redux";
import {
  getSharedKey,
  encryptMessage,
  decryptMessage,
} from "../utils/encryption";

const Chat = () => {
  const { targetUserId } = useParams();
  const [chatInfo, setChatInfo] = useState(null);
  const [inputMessage, setInputMessage] = useState("");
  const [newMessage, setNewMessage] = useState([]);
  const [typing, setTyping] = useState(false);

  const socketRef = useRef(null);
  const chatEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const userId = useSelector((store) => store.user?.data?._id);
  const data = useSelector((store) => store.user?.data) || {};
  const { firstName, photoURL } = data;

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

  useEffect(() => {
    if (!userId || !targetUserId || !encryptionKey) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { firstName, userId, targetUserId });

    socket.on("messageReceived", (message) => {
      const decryptedText = decryptMessage(message.text, encryptionKey);
      setNewMessage((prev) => [...prev, { ...message, text: decryptedText }]);
    });

    socket.on("typing", () => setTyping(true));
    socket.on("stopTyping", () => setTyping(false));

    return () => {
      socket.disconnect();
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [userId, targetUserId, encryptionKey, firstName]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [newMessage, typing]);

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

  if (!chatInfo) return null;

  return (
    <div className='md:w-[60vw] h-[80vh] md:mx-auto bg-gradient-to-br from-teal-100 to-indigo-400 text-gray-500 border-2 border-fuchsia-50 rounded-lg relative flex flex-col mx-2'>
      {/* Header */}
      <div className='w-full h-14 border-b border-black bg-primary rounded-t-lg flex justify-between items-center p-3'>
        <div className='flex items-center text-white text-2xl gap-4'>
          <img
            className='w-12 h-12 object-contain rounded-full  bg-amber-50'
            alt='Profile'
            src={chatInfo.photoURL}
          />
          <p>
            {chatInfo.firstName} {chatInfo.lastName}
          </p>
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
