import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../constants/constants";
import { addFeed } from "../Slices/feedSlice";
import ShimmerCard from "./ShimmerCard";
import useFindRequest from "../hooks/useFindRequest";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);
  const fetchUserFeed = async () => {
    const response = await fetch(BASE_URL + "/user/feed", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    dispatch(addFeed(data?.data));
  };
  useEffect(() => {
    fetchUserFeed();
  }, []);
  useFindRequest();
  if (!feed) return <ShimmerCard />;
  if (feed.length === 0) {
    return (
      <div className='min-h-[80vh] flex justify-center items-center'>
        <h1 className='text-center text-red-400 text-2xl font-semibold'>
          No new user found
        </h1>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center py-5'>
      {feed.length > 0 && (
        <UserCard
          user={feed[0]}
          toasts={{ setToast, setToastMessage, toast }}
        />
      )}

      {toast && (
        <div className='toast toast-top toast-center'>
          <div className='alert alert-success mt-16'>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
