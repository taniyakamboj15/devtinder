import React, { useState } from "react";
import { BASE_URL } from "../constants/constants";
import UserCard from "./UserCard";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [skills, setSkills] = useState(user.skills.join(","));
  const [about, setAbout] = useState(user.about);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(false);
  const [photoURL, setPhotoURL] = useState(user.photoURL);

  const handleEditProfile = async () => {
    const response = await fetch(BASE_URL + "/profile/edit", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        age,
        photoURL,
        skills: skills.split(","),
        about,
      }),
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
    setToastMessage(data.message || data.error);
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 3000);
  };

  return (
    <div className='flex md:flex-row flex-col justify-center items-center gap-4 pb-5'>
      <fieldset className='fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box'>
        <legend className='fieldset-legend text-lg font-bold'>
          Edit Profile
        </legend>

        <label className='fieldset-label'>First Name</label>
        <input
          type='text'
          className='input input-bordered w-full'
          placeholder='First Name'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label className='fieldset-label'>Last Name</label>
        <input
          type='text'
          className='input input-bordered w-full'
          placeholder='Last Name'
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <label className='fieldset-label'>Photo URL</label>
        <input
          type='text'
          className='input input-bordered w-full'
          placeholder='Photo URL'
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
        />

        <label className='fieldset-label'>Age</label>
        <input
          type='number'
          className='input input-bordered w-full'
          placeholder='Age'
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />

        <label className='fieldset-label'>About</label>
        <textarea
          className='textarea textarea-bordered w-full'
          placeholder='Tell us about yourself in not more than 80 letters'
          value={about}
          onChange={(e) => setAbout(e.target.value)}
        ></textarea>

        <label className='fieldset-label'>Skills</label>
        <input
          type='text'
          className='input input-bordered w-full'
          placeholder='Skills (e.g. JavaScript, React)'
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />

        <button
          className='btn btn-primary mt-4 w-full'
          onClick={handleEditProfile}
        >
          Save Profile
        </button>
      </fieldset>
      {toast && (
        <div className='toast toast-top toast-center'>
          <div className='alert alert-success mt-16'>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
      <div className='flex flex-col'>
        <h3 className='text-center md:font-semibold '>
          How Your Profile will look!
        </h3>

        <UserCard
          user={{
            firstName,
            lastName,
            age,
            skills: skills.split(","),
            about,
            photoURL,
          }}
        />
      </div>
    </div>
  );
};

export default EditProfile;
