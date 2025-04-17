import React, { useEffect, useState } from "react";
import Header from "./Header";
import { BASE_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { addUser } from "../Slices/userSlice";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("Skills (e.g. JavaScript, React)");
  const [about, setAbout] = useState("Tell us about yourself");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch(BASE_URL + "/profile/view", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response.ok) {
        navigate("/");
      }
    };
    fetchUser();
  }, []);
  const handleSignUp = async (e) => {
    e.preventDefault();
    setSigningUp(true);
    try {
      const response = await fetch(BASE_URL + "/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          skills,
          age,
          about,
          gender,
        }),
        credentials: "include",
      });

      const data = await response.json();

      console.log(data);

      if (!response.ok) {
        setError(data.message || "signup failed");
      } else {
        setError("");
        dispatch(addUser(data.data));
        navigate("/profile");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSigningUp(false);
    }
  };

  return (
    <>
      <div className='absolute'>
        <Header />
      </div>
      <div className='flex justify-center items-center pt-20'>
        <form onSubmit={handleSignUp}>
          <fieldset className='fieldset w-xs bg-base-200 border border-base-300 p-4 rounded-box '>
            <legend className='fieldset-legend text-lg font-bold'>
              Sign Up
            </legend>
            {error && (
              <p className='text-red-500 text-sm md:text-2xl'>{error}</p>
            )}

            <label className='fieldset-label'>First Name</label>
            <input
              type='text'
              className='input input-bordered w-full'
              placeholder='First Name'
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
              }}
            />

            <label className='fieldset-label'>Last Name</label>
            <input
              type='text'
              className='input input-bordered w-full'
              placeholder='Last Name'
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />

            <label className='fieldset-label'>Email</label>
            <input
              type='email'
              className='input input-bordered w-full'
              placeholder='Email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />

            <label className='fieldset-label'>Age</label>
            <input
              type='number'
              className='input input-bordered w-full'
              placeholder='Age'
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
              }}
            />

            <label className='fieldset-label'>Gender</label>
            <select
              className='select select-bordered w-full'
              value={gender}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            >
              <option value=''>Select Gender</option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
              <option value='Others'>Others</option>
            </select>

            <label className='fieldset-label'>About</label>
            <textarea
              className='textarea textarea-bordered w-full'
              placeholder='Tell us about yourself'
              value={about}
              onChange={(e) => {
                setAbout(e.target.value);
              }}
            ></textarea>

            <label className='fieldset-label'>Skills</label>
            <input
              type='text'
              className='input input-bordered w-full'
              placeholder='Skills (e.g. JavaScript, React)'
              value={skills}
              onChange={(e) => {
                setSkills(e.target.value);
              }}
            />

            <label className='fieldset-label'>Password</label>
            <input
              type='password'
              className='input input-bordered w-full'
              placeholder='Password'
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />

            <button className='btn btn-primary mt-4 w-full' type='submit'>
              {signingUp ? "Signing Up..." : "Sign Up"}
            </button>
            <p className='text-sm font-light text-white'>
              Already have an account?{" "}
              <button
                type='button'
                onClick={() => navigate("/login")}
                className='font-medium text-primary-600 hover:underline'
              >
                Sign In
              </button>
            </p>
          </fieldset>
        </form>
      </div>
    </>
  );
};

export default SignUp;
