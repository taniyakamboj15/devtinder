import React, { useState } from 'react'
import logo from "../assets/logo.png"
import { useDispatch, useSelector } from 'react-redux'
import { Base_URL } from '../utils/Constants.js';
import { Link, useNavigate } from 'react-router-dom';
import { removeUser } from '../redux/userSlice';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
    <div className='bg-gradient-to-b from-black z-20 sticky top-0 w-screen flex flex-row justify-between items-center px-3 md:px-10'>
       <Link to="/"> <img className=' w-32 md:w-40 ' src={logo} alt="logo" /></Link>
       
      {user && (
        <div
          className="flex gap-0.5 items-center cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <h1 className="font-bold">Welcome {user.firstName}</h1>
          <img
            src={user.photoURL}
            alt="user icon"
            className="rounded-full h-8 md:h-14"
          />
        </div>
      )}

      {isOpen && (
        <div
          className="absolute right-0 top-full  mt-2 w-40 bg-white shadow-md rounded-lg p-2"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          <ul className="space-y-2">
            <li>
            <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Edit Profile</Link></li>
            <li>
            <Link to="/connection" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Connections</Link></li>
            <li>
            <Link to="/request" className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Request</Link></li>
            
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer"onClick={handleLogOut}>Logout</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Header;