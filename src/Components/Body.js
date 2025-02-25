import React from 'react'
import { Base_URL } from '../utils/Constants';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addUser } from '../redux/userSlice';
import { useEffect } from 'react';
import Feed from './Feed';

const Body = () => {
  const userData = useSelector((store)=>store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchUser = async() => {
    if(userData)return;
    try{
  const response = await fetch(Base_URL+"/profile/view",{
    method:"GET",
    headers:{
      "Content-Type":"application/json"
    },
    credentials:"include",
  })
  const data = await response.json();
 
  dispatch(addUser(data.data));
  if(!response.ok){
    navigate("/login");

  }
    }catch(err){
      
  
    }
  }
  useEffect(()=>{
    fetchUser();

  },[]);

  return(
    <div><Feed />
    </div>
  )
}

export default Body;