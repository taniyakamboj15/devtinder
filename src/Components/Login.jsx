import React, { use, useEffect, useState } from "react";
import backgroundImage from "../assets/bgImage.jpg";
import Header from "./Header";
import { BASE_URL } from "../constants/constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Slices/userSlice";
import Footer from "./Footer";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.data);

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

  const handleLoginForm = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      const response = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const user = await response.json();

      if (!response.ok) {
        setError(user.message || "Login failed. Please try again.");
      } else {
        console.log(user);
        dispatch(addUser({ data: user.data }));
        navigate("/");
      }
    } catch (err) {
      setError("Something went wrong. Please try again." + err);
    }
  };

  return (
    <div className=''>
      <div className='absolute'>
        <Header />
      </div>
      <div
        className='relative h-screen  w-screen flex items-center justify-center'
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Blurred Overlay */}
        <div className='absolute inset-0 bg-black/30 backdrop-blur-3xl'></div>

        {/* Login Content */}
        <div className='relative z-10 text-white text-3xl font-bold m-3.5'>
          <div className='w-full bg-neutral-100/30 backdrop-blur-2xl rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-gray-700'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white'>
                Sign in to your account
              </h1>

              {/* Error Message */}
              {error && (
                <p className='text-red-500 text-sm md:text-2xl'>{error}</p>
              )}

              <form
                className='space-y-4 md:space-y-6'
                onSubmit={handleLoginForm}
              >
                <div>
                  <label
                    htmlFor='email'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Your email
                  </label>
                  <input
                    type='email'
                    id='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className='border border-gray-300 text-sm md:text-2xl font-medium text-gray-950 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-white/30 backdrop-blur-3xl'
                    placeholder='name@company.com'
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor='password'
                    className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'
                  >
                    Password
                  </label>
                  <input
                    type='password'
                    id='password'
                    placeholder='••••••••'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className='border border-gray-300 text-sm md:text-2xl text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 bg-white/30 backdrop-blur-3xl'
                    required
                  />
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-start'>
                    <input
                      id='remember'
                      type='checkbox'
                      className='w-4 h-4 border border-gray-300 rounded bg-gray-50'
                    />
                    <label
                      htmlFor='remember'
                      className='ml-3 text-sm text-gray-500'
                    >
                      Remember me
                    </label>
                  </div>
                  <a
                    href='#'
                    className='text-sm font-medium text-primary-600 hover:underline dark:text-primary-500'
                  >
                    Forgot password?
                  </a>
                </div>
                <button
                  type='submit'
                  className='w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                >
                  Sign in
                </button>
                <p className='text-sm font-light text-white'>
                  Don’t have an account yet?{" "}
                  <button
                    type='button'
                    onClick={() => navigate("/signup")}
                    className='font-medium text-primary-600 hover:underline'
                  >
                    Sign up
                  </button>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
