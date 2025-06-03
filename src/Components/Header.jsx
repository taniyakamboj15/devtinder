import React, { useRef } from "react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../constants/constants";
import { removeUser } from "../Slices/userSlice";
import { MessageCircle, House, UsersRound, UserPlus } from "lucide-react";
import { createSocketConnection, getSocket } from "../constants/socket";
import fetchChats from "../utils/getAllChats";
import { useEffect } from "react";
import { toast } from "react-toastify";
import notification from "../assets/notification.wav";
const Header = () => {
  const location = useLocation();
  const user = useSelector((store) => store?.user?.data);
  const navigate = useNavigate();
  const request = useSelector((store) => store.request);
  const dispatch = useDispatch();
  const currentUserId = useSelector((store) => store?.user?.data?._id);
  const { targetUserId } = useParams();
  const socketRef = useRef();
  const soundRef = useRef(new Audio(notification));

  const handleLogout = async () => {
    const response = await fetch(BASE_URL + "/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (socketRef.current) {
      try {
        socketRef.current.disconnect();
        console.log("Socket disconnected on logout.");
      } catch (err) {
        console.error("Error disconnecting socket:", err);
      }
    }
    dispatch(removeUser());
    navigate("/login");
  };
  useEffect(() => {
    if (!currentUserId) return;

    const socket = getSocket();
    if (!socket) {
      console.warn(
        "Socket not ready in Header component. Skipping listener setup."
      );
      return;
    }

    socketRef.current = socket;

    socket.on("newMessageNotification", (data) => {
      const isInActiveChat = targetUserId && data.senderId === targetUserId;
      const shouldNotify = !isInActiveChat && data.shouldRefresh;

      if (shouldNotify) {
        soundRef.current.play();
        toast(`New message from ${data.senderName}`);
      }

      fetchChats(dispatch);
    });

    socket.on("chatUpdated", () => {
      fetchChats(dispatch);
    });

    return () => {
      socket.off("newMessageNotification");
      socket.off("chatUpdated");
      //disconnect the socket when the component unmounts
    };
  }, [dispatch, currentUserId, targetUserId]);

  return (
    <div
      className={`w-screen  md:h-[7vh]  z-20 flex flex-row justify-between items-center px-3 md:px-10 sticky top-0 shadow-md shadow-gray-600
      `}
    >
      <Link to='/'>
        <img src={logo} alt='DevTinder' className='w-16 md:w-32  ' />
      </Link>
      {user && (
        <div className='hidden md:flex items-center gap-10'>
          <Link
            to='/'
            className='btn btn-ghost btn-circle hover:bg-neutral-600'
          >
            <House className='h-6 w-6' />
          </Link>
          <Link
            to='/connection'
            className='btn btn-ghost btn-circle hover:bg-neutral-600'
          >
            <UsersRound className='h-6 w-6  group' />
          </Link>
          <Link
            to='/request'
            className='btn btn-ghost btn-circle hover:bg-neutral-600'
          >
            <UserPlus className='h-6 w-6' />
            <sup className='text-blue-400 font-bold'>{request.length}</sup>
          </Link>
          <Link
            to='/chat'
            className='btn btn-ghost btn-circle hover:bg-neutral-600'
          >
            <MessageCircle className='h-6 w-6' />
          </Link>
        </div>
      )}

      {user && (
        <div className='flex items-center gap-3'>
          <div className='md:hidden flex items-center gap-3'>
            <Link to='/chat'>
              <MessageCircle className='h-6 w-6' />
            </Link>
          </div>
          <div className='dropdown dropdown-hover dropdown-bottom dropdown-end'>
            <img
              src={user.photoURL}
              className='rounded-full h-6 w-6 md:h-10 md:w-10 object-cover ring-2 ring-primary focus:ring-4
        '
              tabIndex={0}
              role='button'
            ></img>
            <ul
              tabIndex={0}
              className='dropdown-content menu bg-neutral-600 rounded-box z-[1] w-52 p-2 shadow'
            >
              <li
                className={`${location.pathname === "/" ? "hidden" : "block"}`}
              >
                <Link to='/'>Home</Link>
              </li>
              <li>
                <Link to='/profile'>Edit Profile</Link>
              </li>
              <li className='md:hidden'>
                <Link to='/connection'>Connection</Link>
              </li>
              <li className='md:hidden'>
                <Link to='/request'>
                  Requests{" "}
                  <sup className='text-blue-400 font-bold'>
                    {request.length}
                  </sup>
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
