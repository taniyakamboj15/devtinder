import React, { useState, useEffect } from "react";
import { BASE_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Shimmer from "./Shimmer";
import { addRequest, removeRequest } from "../Slices/requestSlice";
import useFindRequest from "../hooks/useFindRequest";

const Request = () => {
  const navigate = useNavigate();
  const request = useSelector((store) => store.request);
  const [toast, setToast] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  const { loading } = useFindRequest();
  const requestReview = async (status, _id) => {
    const response = await fetch(
      BASE_URL + "/request/review/" + status + "/" + _id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      setToast(true);
      setTimeout(() => {
        setToast(false);
        dispatch(removeRequest(_id));
      }, 3000);
    }
  };

  if (loading) return <Shimmer />;
  if (request.length === 0)
    return (
      <h1 className='top-20 text-3xl font-bold text-center min-h-[80vh]'>
        No Requests
      </h1>
    );

  return (
    <div className='top-20 flex flex-col items-center gap-5 px-3 min-h-screen '>
      <h1 className='font-bold text-3xl text-center'>Requests</h1>

      {request.map((req, index) => (
        <div
          key={index}
          className='flex items-center bg-primary shadow-md rounded-lg p-4 md:w-96 w-full gap-4'
        >
          {/* User Image */}
          <img
            src={req.fromUserid.photoURL}
            alt='User Image'
            className='w-24 h-20 rounded-full object-cover'
          />

          {/* User Info & Buttons */}
          <div className='flex flex-col w-full'>
            {/* User Name & Age */}
            <div className='flex justify-between items-center'>
              <div>
                <h2 className='font-semibold text-lg'>
                  {req.fromUserid.firstName} {req.fromUserid.lastName}
                </h2>
                <h3 className='text-fuchsia-100 text-sm'>
                  {req.fromUserid.age} , {req.fromUserid.gender}
                </h3>
              </div>
            </div>

            {/* Buttons - Aligned Right */}
            <div className='flex justify-end gap-3 mt-3'>
              <button
                className='bg-green-500 text-white px-4 py-1 rounded-md hover:bg-green-600 active:scale-95'
                onClick={() => {
                  requestReview("accepted", req._id);
                }}
              >
                Accept
              </button>
              <button
                className='bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600 active:scale-95'
                onClick={() => {
                  requestReview("rejected", req._id);
                }}
              >
                Reject
              </button>
            </div>
          </div>
          {toast && (
            <div className='toast toast-top toast-center mt-16 z-40'>
              <div className='alert alert-success'>
                <span>
                  {req.fromUserid.firstName} added to your Connections.
                </span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Request;
