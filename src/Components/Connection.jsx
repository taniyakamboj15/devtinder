import React, { useEffect, useState } from "react";
import { BASE_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Shimmer from "./Shimmer";

const Connections = () => {
  const [connection, setConnection] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const user = useSelector((store) => store.user);
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  const fetchConnection = async () => {
    try {
      const response = await fetch(BASE_URL + "/user/connection", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const data = await response.json();
      setConnection(data.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchConnection();
  }, []);
  if (loading) return <Shimmer />;
  if (connection.length === 0)
    return (
      <div className='flex items-center min-h-[70vh] justify-center'>
        <h1 className='text-red-400 text-center text-2xl font-semibold'>
          No connection found
        </h1>
      </div>
    );

  return (
    <div className=' flex flex-col items-center gap-5 min-h-screen px-3 '>
      <h1 className='font-bold text-3xl text-center'>Connections</h1>

      {connection.map((con, index) => (
        <div
          key={index}
          className='flex items-center bg-primary shadow-md rounded-lg p-4 md:w-96 gap-4 w-full justify-between'
        >
          {/* User Image - Rounded */}
          <div className='flex items-center gap-4'>
            <img
              src={con.photoURL}
              alt='User Image'
              className='w-16 h-16 rounded-full object-cover'
            />

            {/* User Info */}
            <div>
              <h2 className='font-semibold text-lg'>
                {con.firstName} {con.lastName}
              </h2>
              <h3 className='text-fuchsia-100 text-sm'> {con.age}</h3>
            </div>
          </div>
          <div>
            <button
              className='bg-secondary w-20 py-2 rounded-md hover:opacity-90 active:scale-95'
              onClick={() => navigate(`/chat/${con._id}`)}
            >
              Chat
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Connections;
