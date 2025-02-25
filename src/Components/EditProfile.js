import React, { useState } from 'react'
import UserCard from './UserCard';
import { Base_URL } from '../utils/Constants';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/userSlice';

const EditProfile = ({user}) => {
  const dispatch = useDispatch();
    const [firstName,setFirstName] = useState(user.firstName);
    const [lastName,setLastName] = useState(user.lastName);
    const [age,setAge] = useState(user.age);
    const [photoURL,setPhotoUrl] = useState(user.photoURL);
    const [error,setError] = useState("");
    const [showToast , setShowToast]= useState(false);
    const saveProfile = async(e)=>{
    
      try{
        e.preventDefault();
        setError("");
        const response = await axios.put(Base_URL+"/profile/edit",{
          firstName,lastName,age,photoURL
        },{withCredentials:true})
        if(response.status === 200){
          console.log(response);
          dispatch(addUser(response?.data?.data));
          setShowToast(true);
          setTimeout(()=>{
            setShowToast(false);
          },3000);

        }
      }catch(err){
        setError(err.message);
      }
    }
  return (
    <div>
    <div className='relative flex justify-center bg-neutral-100/30 w-screen gap-5'>
    <div className=''>
            <div className=' h-fit w-72 border-2 border-black rounded-md mt-20 z-10 backdrop-blur-2xl font-semibold '>
                <h1 className='text-center text-3xl'>Login</h1>
                <form className='px-3 flex flex-col gap-3' onSubmit={saveProfile}>
                    <div>
                    <label className='text-2xl ' for="first">firstName:</label><br/>
                    <input type="text" id="first" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className='border border-black h-10 w-full' ></input><br/>
                    </div>
                    <div>
                    <label className='text-2xl'for="last">lastName:</label><br/>
                    
                    <input type="text" id="last" value={lastName} onChange={(e)=>setLastName(e.target.value)} className='border border-black h-10 w-full'></input><br/>
                   </div>
                   <div>
                    <label className='text-2xl'for="age">Age:</label><br/>
                    
                    <input type="text" id="age" value={age} onChange={(e)=>setAge(e.target.value)} className='border border-black h-10 w-full'></input><br/>
                    </div><div>
                    <label className='text-2xl'for="photo">photo:</label><br/>
                    
                    <input type="text" id="photo" value={photoURL} onChange={(e)=>setPhotoUrl(e.target.value)} className='border border-black h-10 w-full'></input><br/>
                    </div>
                    {error && (
                    <p className='text-red-500 text-sm md:text-2xl'>{error}</p>
                  )}
                    <button type='submit' className="mx-20 border border-black rounded-md text-2xl my-3">Save Profile</button>
    
    
                    
    
                </form>
            </div>
        </div>
        <div>
        <UserCard user={{firstName,lastName,age,photoURL}}/>
        </div>
        </div>
        {showToast &&(
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 bg-black text-white text-center p-2 w-fit rounded-lg max-w-md z-50">
  <h1>Profile Updated Successfully</h1>
</div>)};


        </div>
      
    
    
  )
}

export default EditProfile