import React, { useState, useEffect } from 'react';
import { Base_URL } from '../utils/Constants';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Shimmer from './Shimmer';
import { addRequest, removeRequest } from '../redux/requestsSlice';
import useFindRequest from '../hooks/usefindRequests';

const Request = () => {
const navigate = useNavigate();
const request = useSelector((store) => store.request)

const dispatch = useDispatch();
const user = useSelector((store)=>store.user);
useEffect(() => {
  if (!user) {
    navigate("/");
  }
}, [user, navigate]);
const {loading} = useFindRequest();
const requestReview = async(status,_id)=>{
        const response = await fetch(Base_URL+"/request/review/"+status+"/"+_id,{
            method:"PUT",
            headers:{
                 "Content-Type": "application/json",
            },
            credentials:"include",
        })
        if(response.ok){
           dispatch(removeRequest(_id))  
        }
    }


    if(loading) return <Shimmer />
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
                            <button className="bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 active:scale-95"onClick={() => {requestReview("accepted",req._id)}}>
                                Accept
                            </button>
                            <button className="bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 active:scale-95" onClick={() => {requestReview("rejected",req._id)}}>
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
