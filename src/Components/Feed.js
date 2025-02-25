import React, { useEffect } from 'react'
import { Base_URL } from '../utils/Constants'
import { useDispatch, useSelector } from 'react-redux'
import { addFeed } from '../redux/feedSlice'
import UserCard from './UserCard'

const Feed = () => {
    const dispatch = useDispatch();
    const feed = useSelector((store)=>store.feed);
    const fetchData =async()=>{
        try{
    const response = await fetch(Base_URL+"/user/feed",{
        method:"GET",
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include",
    })
    const data = await response.json();
    console.log(data);
    dispatch(addFeed(data.data));
}
    catch(err){
        
        console.log(err.message)
    }
    }
    useEffect(()=>{
        fetchData();

    },[])
    if(!feed) return;
    if(feed.length === 0) return <h1>no user found</h1>
  return (
    <div className=''>
        {feed&&(
        <UserCard user={feed[0]}/>)}
    </div>
  )
}

export default Feed