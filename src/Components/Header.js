import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux'
import { Base_URL } from '../utils/Constants.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { removeUser } from '../redux/userSlice';


const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(location.pathname)
  const handleLogOut = async()=>{
    const response = await fetch(Base_URL+ "/logout",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      credentials:"include"
    })
    if(response.ok){
      dispatch(removeUser());
      console.log("removed user")
      navigate("/login");
    }

  }

  const user = useSelector((store)=>store.user);
  return (
    <div className={`${location.pathname === "/login" ? "absolute" : ""}`}>
    <div className={`bg-gradient-to-b from-black z-20 sticky top-0 w-screen flex flex-row justify-between items-center px-3 md:px-10 `}>
       <Link to="/"> <img className=' w-32 md:w-40 ' src={logo} alt="logo" /></Link>
       
      {user && (
        <div
          className="flex gap-0.5 items-center cursor-pointer"
        >
          <h1 className="font-bold">Welcome {user.firstName}</h1>
          <div className="dropdown dropdown-hover dropdown-bottom dropdown-end">
          <img
            src={user.photoURL}
            alt="user icon"
            className="rounded-full h-8 md:h-14"
          />
  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
  <li>
            <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit Profile</Link></li>
            <li>
            <Link to="/connection" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Connections</Link></li>
            <li>
            <Link to="/request" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Request</Link></li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"onClick={handleLogOut}>Logout</li>
  </ul>
</div>
         
        </div>
      )}
    </div>
    </div>
  )
}

export default Header;