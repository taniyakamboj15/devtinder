import React, { useState, useEffect } from 'react';
import { Base_URL } from '../utils/Constants';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Request = () => {
const navigate = useNavigate();

const user = useSelector((store)=>store.user);
useEffect(() => {
  if (!user) {
    navigate("/");
  }
}, [user, navigate]);
    const [request, setRequest] = useState([]);
    const requestReview = async(status,_id)=>{
        const response = await fetch(Base_URL+"/request/review/"+status+"/"+_id,{
            method:"PUT",
            headers:{
                 "Content-Type": "application/json",
            },
            credentials:"include",
        })
        if(response.ok){
            fetchRequest();
            
        }
    }

    const fetchRequest = async () => {
        console.log("useEffect called fetchRequest");
        try {
            const response = await fetch(`${Base_URL}/user/requests/received`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await response.json();
            setRequest(data.data);
            console.log("API Response:", data);
        } catch (err) {
            console.error("Error fetching requests:", err);
        }
    };

    useEffect(() => {
        console.log("useEffect is called ");
        fetchRequest();
    }, []);

    console.log(request);

    if (request.length === 0) return <h1 className="top-20 text-3xl font-bold text-center">No Requests</h1>;

    return (
        <div className="top-20 flex flex-col items-center gap-5 px-3 min-h-screen">
            <h1 className="font-bold text-3xl text-center">Requests</h1>

            {request.map((req, index) => (
                <div 
                    key={index} 
                    className="flex items-center bg-gray-200 shadow-md rounded-lg p-4 md:w-96 w-full gap-4"
                >
                    {/* User Image */}
                    <img 
                        src={req.fromUserId.photoURL} 
                        alt="User Image"  
                        className="w-16 h-16 rounded-full object-cover"
                    />

                    {/* User Info & Buttons */}
                    <div className="flex flex-col w-full">
                        {/* User Name & Age */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold text-lg">
                                    {req.fromUserId.firstName} {req.fromUserId.lastName}
                                </h2>
                                <h3 className="text-gray-600 text-sm">Age: {req.fromUserId.age}</h3>
                            </div>
                        </div>

                        {/* Buttons - Aligned Right */}
                        <div className="flex justify-end gap-3 mt-3">
                            <button className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600"onClick={() => {requestReview("accepted",req._id)}}>
                                Accept
                            </button>
                            <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600" onClick={() => {requestReview("rejected",req._id)}}>
                                Reject
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Request;
