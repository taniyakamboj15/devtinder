import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "../Components/Login";
import Body from "./Body";
import Feed from "../Components/Feed";
import Profile from "../Components/Profile";
import Error from "../Components/Error";
import Connection from "../Components/Connection";
import Request from "../Components/Request";
import SignUp from "../Components/SignUp";
import Chat from "../Components/Chat";
const App = () => {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Body />,
      errorElement: <Error />,
      children: [
        {
          path: "/",
          element: <Feed />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/connection",
          element: <Connection />,
        },
        {
          path: "/request",
          element: <Request />,
        },
        {
          path: "/chat/:targetUserId",
          element: <Chat />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
      errorElement: <Error />,
    },
    {
      path: "/signup",
      element: <SignUp />,
      errorElement: <Error />,
    },
  ]);
  return <RouterProvider router={appRouter} />;
};

export default App;
