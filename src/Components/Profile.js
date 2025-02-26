import React, { useEffect } from 'react'
import EditProfile from './EditProfile';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();

  const user = useSelector((store)=>store.user);
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);
  return (
    <div>
      {user &&(
      <EditProfile user={user}/>
      )}
    </div>
  )
}

export default Profile;