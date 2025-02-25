import React from 'react'
import { Base_URL } from '../utils/Constants';
import { useDispatch } from 'react-redux';
import { removeFeed } from '../redux/feedSlice';
import { useLocation } from 'react-router-dom';

const UserCard = ({user}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {firstName,lastName,age,photoURL,_id}=user;
  const handleSendRequest = async(status,_id)=>{
    const response = await fetch(Base_URL+"/request/send/"+status+"/"+_id,{
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      credentials: "include",
      
    })
    dispatch(removeFeed(_id));
    
  }
  return (

    <div className='border-4 border-black rounded-lg w-fit  h-fit  top-20  bg-black md:mx-auto mx-4'>
      <img className='w-96 h-96 object-cover' src={photoURL} alt="dummy photo"/>
      <div className='flex gap-3 items-center mt-3'>
        <h1 className=' font-bold text-2xl px-3 text-white'>{firstName} {lastName}</h1>
        <p className='text-white text-2xl '>{age}</p>
      </div>
      <div className='flex gap-5 my-5 justify-center'>
        <button className={`border border-black rounded-md bg-pink-400 p-2 w-24 ${location.pathname === "/profile" ? "hidden" :"block "}`}onClick={()=>{handleSendRequest("interested",_id)}}>interested</button>
        <button  className={`border border-black rounded-md bg-blue-400 w-24 p-2 ${location.pathname === "/profile" ? "hidden" :"block "} `}onClick={()=>{handleSendRequest("ignored",_id)}}>ignore</button>

      </div>
    </div>
  )
}

export default UserCard;