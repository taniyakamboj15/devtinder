import React from "react";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../constants/constants";
import { removeUser } from "../Slices/userSlice";

const Header = () => {
  const location = useLocation();
  const user = useSelector((store) => store?.user?.data);
  const navigate = useNavigate();
  const request = useSelector((store) => store.request);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const response = await fetch(BASE_URL + "/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    dispatch(removeUser());
    navigate("/login");
  };

  return (
    <div
      className={`w-screen bg-gradient-to-b from-black z-20 flex flex-row justify-between items-center px-3 md:px-10 sticky top-0
      `}
    >
      <Link to='/'>
        <img src={logo} alt='DevTinder' className='w-28 md:w-60 ' />
      </Link>
      {user && (
        <div className='dropdown dropdown-hover dropdown-bottom dropdown-end'>
          <img
            src={user.photoURL}
            className='rounded-full h-8 w-8 md:h-14 md:w-14 object-cover ring-2 ring-primary focus:ring-4
        '
            tabIndex={0}
            role='button'
          ></img>
          <ul
            tabIndex={0}
            className='dropdown-content menu bg-neutral-600 rounded-box z-[1] w-52 p-2 shadow'
          >
            <li className={`${location.pathname === "/" ? "hidden" : "block"}`}>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/profile'>Edit Profile</Link>
            </li>
            <li>
              <Link to='/connection'>Connection</Link>
            </li>
            <li>
              <Link to='/request'>
                Requests{" "}
                <sup className='text-blue-400 font-bold'>{request.length}</sup>
              </Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Header;
