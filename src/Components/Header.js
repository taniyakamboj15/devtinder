import React, { useState } from 'react';
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { Base_URL } from '../utils/Constants.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { removeUser } from '../redux/userSlice';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogOut = async () => {
    const response = await fetch(Base_URL + "/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      dispatch(removeUser());
      navigate("/login");
    }
  };

  const user = useSelector((store) => store.user);

  return (
    <div className={`${location.pathname === "/login" ? "absolute" : ""}`}>
      <div className="bg-gradient-to-b from-black z-20 sticky top-0 w-screen flex flex-row justify-between items-center px-3 md:px-10 py-3">
        <Link to="/">
          <img className='w-32 md:w-40' src={logo} alt="logo" />
        </Link>
        {user && (
          <div className="relative">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
              <h1 className="font-bold">Welcome {user.firstName}</h1>
              <img src={user.photoURL} alt="user icon" className="rounded-full h-8 w-8  object-cover md:h-14 md:w-14" />
            </div>
            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Edit Profile</Link>
                <Link to="/connection" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Connections</Link>
                <Link to="/request" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Request</Link>
                <button onClick={handleLogOut} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
