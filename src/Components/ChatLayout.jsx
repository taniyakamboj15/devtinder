import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { BASE_URL } from "../constants/constants";
import { getSharedKey, decryptMessage } from "../utils/encryption";
import fetchChats from "../utils/getAllChats";
import { useDispatch } from "react-redux";
import OnlineIndicator from "../Components/OnlineIndicator";
import {
  getFormattedDay,
  getFormattedTime,
} from "../utils/getFormatDayandTime";
import { FaArrowLeft } from "react-icons/fa";

const ChatLayout = () => {
  const { targetUserId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user?.data?._id);
  const chats = useSelector((state) => state.chats?.chats) || [];
  const dispatch = useDispatch();
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);

  useEffect(() => {
    fetchChats(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const openChat = (id) => {
    navigate(`/chat/${id}`);
  };

  // Show only chat list on mobile when no chat is selected
  const showOnlyList = isMobileView && targetUserId;
  // Show only chat window on mobile when chat is selected
  const showOnlyChat = isMobileView && targetUserId;
  // Show both on desktop
  const showBoth = !isMobileView;

  return (
    <div className='flex h-[calc(100vh-34px)] md:h-[calc(100vh-50px)]'>
      {/* Sidebar - shown on desktop always, on mobile only when no chat selected */}
      {(showBoth || !targetUserId) && (
        <div className='w-full md:w-1/3 border-r border-gray-300 bg-white overflow-y-auto'>
          <div className='p-4 text-xl font-semibold border-b'>Chats</div>
          {chats.length === 0 && (
            <p className='text-center text-gray-500 p-4'>No chats yet</p>
          )}
          {chats.map((chat) => {
            const otherUser = chat.user;
            const sharedKey = getSharedKey(userId, otherUser._id);
            const decryptedText = decryptMessage(
              chat.lastMessage?.text || "",
              sharedKey
            );
            const hasUnseen = chat.unseenCount > 0;
            if (!otherUser) return null;

            return (
              <div
                key={chat.chatId}
                onClick={() => openChat(otherUser._id)}
                className={`cursor-pointer px-4 py-3 hover:bg-gray-100 flex items-center gap-3 border-b-2 border-gray-600 ${
                  targetUserId === otherUser._id ? "bg-gray-200" : ""
                }`}
              >
                <img
                  src={otherUser.photoURL}
                  alt='Profile'
                  className='w-10 h-10 rounded-full object-cover'
                />
                <div className='flex-1'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center'>
                      <span>{chat.user.name}</span>
                      <OnlineIndicator userId={chat.user._id} />
                    </div>
                    <div className='text-gray-600'>
                      {getFormattedDay(chat.lastMessage.time)}
                    </div>
                  </div>
                  <div className='text-sm text-gray-600 flex justify-between items-center'>
                    <div className='text-sm text-gray-600 truncate'>
                      {chat.lastMessage.senderId === userId
                        ? "You:"
                        : chat.lastMessage.senderName}
                      {": "}
                      {decryptedText || "Start chatting..."}
                    </div>
                    <div className='flex items-center gap-2'>
                      <span className='text-xs text-gray-400'>
                        {getFormattedTime(chat.lastMessage?.time)}
                      </span>
                      {hasUnseen && (
                        <span className='bg-blue-500 text-white text-xs font-bold px-2 py-[2px] rounded-full'>
                          {chat.unseenCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chat window - shown on desktop always, on mobile only when chat selected */}
      {(showBoth || targetUserId) && (
        <div className='w-full md:w-2/3 bg-gray-100 flex flex-col'>
          {/* {isMobileView && targetUserId && (
            // <button
            //   onClick={handleBackToChatList}
            //   className='p-2 text-gray-600 hover:text-gray-800 md:hidden'
            // >
            //   <FaArrowLeft size={20} />
            // </button>
          )} */}
          {!targetUserId && showBoth ? (
            <div className='text-center text-gray-600 text-xl m-auto'>
              Start chatting with your friend
            </div>
          ) : (
            <div className='w-full h-full'>
              <Outlet />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatLayout;
