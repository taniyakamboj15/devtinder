import React, { useEffect } from "react";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Header from "../Components/Header";
import { BASE_URL } from "../constants/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../Slices/userSlice";
import Footer from "../Components/Footer";
import { ToastContainer, Bounce } from "react-toastify";
import { createSocketConnection } from "../constants/socket";
const Body = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const currentUserId = useSelector((state) => state.user?.data?._id);

  const fetchUser = async () => {
    try {
      if (!user?.data) {
        const response = await fetch(BASE_URL + "/profile/view", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          navigate("/login");
        }
        const user = await response.json();
        dispatch(addUser({ data: user.data }));
      } else {
        return;
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      createSocketConnection({ currentUserId });
    }
  }, [currentUserId]);

  return (
    <div className='overflow-x-hidden'>
      <ToastContainer
        position='top-center'
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme='light'
        transition={Bounce}
      />
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Body;
