import React, { useState } from 'react';
import UserCard from './UserCard';
import { Base_URL } from '../utils/Constants';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { motion } from 'framer-motion'; // For animations

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [age, setAge] = useState(user.age);
  const [photoURL, setPhotoUrl] = useState(user.photoURL);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false); // Loading state

  const saveProfile = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true); // Show loading effect

    try {
      const response = await axios.put(
        Base_URL + '/profile/edit',
        { firstName, lastName, age, photoURL },
        { withCredentials: true }
      );

      if (response.status === 200) {
        dispatch(addUser(response?.data?.data));
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 3000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false); // Hide loading effect
    }
  };

  return (
    <div className="flex flex-col  items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-5 pt-28">
      <motion.div
        className="bg-white/30 backdrop-blur-xl shadow-lg border border-gray-200 rounded-2xl p-6 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-5">Edit Profile</h1>
        <form className="flex flex-col gap-4" onSubmit={saveProfile}>
          <div>
            <label className="text-lg font-semibold text-gray-700">First Name</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-700">Last Name</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-700">Age</label>
            <input
              type="text"
              value={age}
              required
              onChange={(e) => setAge(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>
          <div>
            <label className="text-lg font-semibold text-gray-700">Photo URL</label>
            <input
              type="text"
              value={photoURL}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            className="w-full bg-indigo-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-indigo-600 active:scale-95 transition-transform"
            whileTap={{ scale: 0.95 }}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Profile'}
          </motion.button>
        </form>
      </motion.div>

      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-gray-700">How Your Profile Will Look</p>
        <UserCard user={{ firstName, lastName, age, photoURL }} />
      </div>

      {showToast && (
        <motion.div
          className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white text-center p-3 rounded-lg shadow-lg z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Profile Updated Successfully!
        </motion.div>
      )}
    </div>
  );
};

export default EditProfile;
