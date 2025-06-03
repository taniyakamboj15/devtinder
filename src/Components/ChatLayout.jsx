import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
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
const ChatLayout = () => {
  const { targetUserId } = useParams();
  //   const [chats, setChats] = useState([]);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user?.data?._id);
  const chats = useSelector((state) => state.chats?.chats) || [];
  const dispatch = useDispatch();
  useEffect(() => {
    fetchChats(dispatch);
  }, [dispatch]);

  const openChat = (id) => navigate(`/chat/${id}`);

  return (
    <div className='flex h-[96vh] md:h-[93vh] overflow-y-clip'>
      {/* Sidebar */}
      <div className='w-full md:w-1/3 border-r border-gray-300 bg-white overflow-y-auto'>
        <div className='p-4 text-xl font-semibold border-b '>Chats</div>
        {chats.length === 0 && (
          <p className='text-center text-gray-500 p-4'>No chats yet</p>
        )}
        {chats.map((chat) => {
          const otherUser = chat.user; // directly from your data
          const sharedKey = getSharedKey(userId, otherUser._id);
          const decryptedText = decryptMessage(
            chat.lastMessage?.text || "",
            sharedKey
          );
          const hasUnseen = chat.unseenCount > 0;
          if (!otherUser) return null; // safety check

          return (
            <div
              key={chat.chatId}
              onClick={() => openChat(otherUser._id)}
              className={`cursor-pointer px-4 py-3 hover:bg-gray-100 flex items-center gap-3  ${
                targetUserId === otherUser._id ? "bg-gray-200" : ""
              }`}
            >
              <img
                src={otherUser.photoURL}
                alt='Profile'
                className='w-10 h-10 rounded-full object-cover'
              />
              <div className='flex-1 '>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <span>{chat.user.name}</span>
                    <OnlineIndicator userId={chat.user._id} />
                  </div>
                  <div className='text-gray-600'>
                    {" "}
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

      {/* Chat window */}
      <div className='w-full md:w-2/3 bg-gray-100 flex items-center justify-center'>
        {!targetUserId ? (
          <div className='text-center text-gray-600 text-xl'>
            Start chatting with your friend
          </div>
        ) : (
          <div className='w-full h-full '>
            {/* Render Chat Component here */}
            <Outlet />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
