import React from "react";
import { BASE_URL } from "../constants/constants";
import { useDispatch } from "react-redux";
import { removeFeedUser } from "../Slices/feedSlice";
import { useLocation } from "react-router-dom";

const UserCard = ({ user, toasts }) => {
  const location = useLocation();
  const { _id, firstName, lastName, photoURL, about, gender, age, skills } =
    user;
  const dispatch = useDispatch();

  // Check if toasts is available (only outside "/profile")
  const showToast = location.pathname !== "/profile" && toasts;
  const setToast = showToast ? toasts.setToast : () => {};
  const setToastMessage = showToast ? toasts.setToastMessage : () => {};

  const handleSendRequest = async (status, _id) => {
    const response = await fetch(`${BASE_URL}/request/send/${status}/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      if (status === "interested" && showToast) {
        setToast(true);
        setToastMessage(`Connection request sent to ${firstName}`);
        setTimeout(() => {
          setToast(false);
        }, 1000);
      }
    }
    dispatch(removeFeedUser(_id));
  };

  return (
    <div className='card bg-base-300  md:w-96 mx-2 md:mx-0 shadow-sm'>
      <figure>
        <img
          src={photoURL}
          alt={`${firstName} ${lastName}`}
          className='h-96 w-full object-cover object-top'
        />
      </figure>
      <div className='card-body'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row items-baseline gap-4 md:gap-6'>
            <h2 className='card-title'>
              {firstName} {lastName}
            </h2>
            {age && gender && (
              <p className='opacity-75 font-extralight'>
                {gender}, {age}
              </p>
            )}
          </div>
          {skills && (
            <p className='opacity-70 font-mono'>Skills: {skills.join(",")}</p>
          )}
        </div>

        <p>{about}</p>
        <div className='card-actions justify-end'>
          <button
            className={`btn btn-success ${
              location.pathname === "/profile" ? "hidden" : "block"
            }`}
            onClick={() => handleSendRequest("interested", _id)}
          >
            Interested
          </button>
          <button
            className={`btn btn-warning ${
              location.pathname === "/profile" ? "hidden" : "block"
            }`}
            onClick={() => handleSendRequest("ignored", _id)}
          >
            Ignore
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
