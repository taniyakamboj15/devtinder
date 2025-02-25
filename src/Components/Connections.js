import React, { useEffect, useState } from 'react'
import { Base_URL } from '../utils/Constants'

const Connections = () => {
const [connection,setConnection] = useState([]);
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

            }
        }
        useEffect(()=>{
            fetchConnection();
        },[]);
        if(connection.length=== 0)return <h1>No connection found</h1>;
    
  return (
    <div className=" flex flex-col items-center gap-5">
    <h1 className="font-bold text-3xl text-center">Connections</h1>
    
    {connection.map((con, index) => (
      <div 
        key={index} 
        className="flex items-center bg-gray-200 shadow-md rounded-lg p-4 w-96 gap-4 "
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