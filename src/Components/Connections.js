import React, { useEffect, useState } from 'react'
import { Base_URL } from '../utils/Constants'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Shimmer from './Shimmer';

const Connections = () => {
const [connection,setConnection] = useState([]);
const navigate = useNavigate();
const [loading , setLoading] = useState(true);

const user = useSelector((store)=>store.user);
useEffect(() => {
  if (!user) {
    navigate("/");
  }
}, [user, navigate]);
const fetchConnection = async()=>{
            try{
                const response = await fetch(Base_URL+"/user/connection",{
                    method:"GET",
                    headers:{
                        "Content-Type":"application/json",
                    },
                    credentials:"include",

                })
                const data = await response.json();
                setConnection(data.data);
                
                console.log(data);
            }catch(err){

            }finally{
              setLoading(false);
            }
        }
        useEffect(()=>{
            fetchConnection();
        },[]);
  if(loading) return <Shimmer />;
  if(connection.length=== 0)return <h1 className='text-red-400 text-center text-2xl font-semibold'>No connection found</h1>;
    
  return (
    <div className=" flex flex-col items-center gap-5 min-h-screen px-3 ">
    <h1 className="font-bold text-3xl text-center">Connections</h1>
    
    {connection.map((con, index) => (
      <div 
        key={index} 
        className="flex items-center bg-gray-200 shadow-md rounded-lg p-4 md:w-96 gap-4 w-full"
      >
        {/* User Image - Rounded */}
        <img 
          src={con.photoURL} 
          alt="User Image"  
          className="w-16 h-16 rounded-full object-cover"
        />
  
        {/* User Info */}
        <div>
          <h2 className="font-semibold text-lg">{con.firstName} {con.lastName}</h2>
          <h3 className="text-gray-600 text-sm">Age: {con.age}</h3>
        </div>
      </div>
    ))}
  </div>
  
  )
}

export default Connections;