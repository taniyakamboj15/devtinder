import React, { useState } from 'react'
import backgroundImage from "../assets/bgImage.jpg"
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { Base_URL } from '../utils/Constants';
import { useEffect } from 'react';

const Login = () => {
    const navigate = useNavigate();
    const [firstName,setFirstName] = useState("");
    const [lastName,setLastName] = useState("");
    const [isLoginForm,setIsLoginForm]= useState(true);
    const[email,setEmail]= useState("");
    const[password,setPassword]= useState("");
    const [error , setError] = useState("")
    const dispatch = useDispatch();
    const userData = useSelector((store)=>store.user);

    const handleLoginForm =async(e)=>{

        e.preventDefault();
        try{
        const response = await fetch(Base_URL+"/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({email,password}),
           credentials:"include",
        });
 
        const data = await response.json();

        if (!response.ok) {
        setError(data.message || "Login failed");
        }else{

        setError("");
        dispatch(addUser(data.data));
        navigate("/");
    }
        

    }catch(err){
        console.log(err);
    }}
    const handleSignUp = async(e)=>{
      e.preventDefault();
      try{
      const response = await fetch(Base_URL+"/signup",{
          method:"POST",
          headers:{
              "Content-Type":"application/json"
          },
          body:JSON.stringify({firstName,lastName,email,password}),
         credentials:"include",
      });

      const data = await response.json();

      if (!response.ok) {
      setError(data.message || "signup failed");
      }else{

      setError("");
      dispatch(addUser(data.data));
      navigate("/profile");
  }
      

  }catch(err){
      console.log(err);
  }}

    
    const fetchData =async()=>{
       const response = await fetch(Base_URL+"/profile/view",{
          method:"GET",
          headers:{
            "Content-Type":"application/json"
          },
          credentials:"include",
        })
        if(response.ok){
          navigate("/");
        }
    }
    useEffect(()=>{
      fetchData();

    },[])

  return (
    <div className='relative h-screen w-screen flex items-center justify-center'
    style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
        <div className='absolute inset-0 bg-black/30 backdrop-blur-3xl'></div>
        <div className='bg-neutral-100/30 h-fit w-72 border-2 border-black rounded-md  z-10 backdrop-blur-2xl font-semibold '>
            <h1 className='text-center text-3xl'>{isLoginForm ? "Login" : "signup"}</h1>
            <form className='px-3 flex flex-col'  onSubmit={isLoginForm ? handleLoginForm : handleSignUp}>
              {!isLoginForm && (<>           <label className='text-2xl ' for="first">firstName:</label>
                <input type="text" id="first" value={firstName} onChange={(e)=>setFirstName(e.target.value)} className='border border-black h-10' ></input>
                <label className='text-2xl'for="last">lastName:</label>
                
                <input type="text" id="last" value={lastName} onChange={(e)=>setLastName(e.target.value)} className='border border-black h-10 '></input></>)}
 
                <label className='text-2xl ' for="Email">Email:</label>
                <input type="text" id="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className='border border-black h-10' ></input>
                <label className='text-2xl'for="pass">Password:</label>
                
                <input type="password" id="pass" value={password} onChange={(e)=>setPassword(e.target.value)} className='border border-black h-10 '></input>
                {error && (
                <p className='text-red-500 text-sm md:text-2xl'>{error}</p>
              )}
                <button type='submit' className="mx-20 border border-black rounded-md text-2xl my-3">{isLoginForm ? "Login" : "signup"}</button>
                <div>
                  <p className='cursor-pointer ' onClick={()=>setIsLoginForm((value)=> !value)}>{isLoginForm ? "Dont have an account? signup" : "already have an account? login now"}</p>
                </div>
            </form>
            
        </div>
    </div>
  )
}

export default Login;