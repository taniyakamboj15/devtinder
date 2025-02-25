import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import Header from './Components/Header';
import Body from './Components/Body';
import Login from './Components/Login';
import SignUp from './Components/SignUp';
import Footer from './Components/Footer';
import { Provider } from 'react-redux';
import appStore from './redux/appStore';
import Feed from './Components/Feed';
import Profile from './Components/Profile';
import Connections from './Components/Connections';
import Request from './Components/Request';
const AppLayout=()=>{
    return(
        <div className='relative overflow-x-hidden'>
            <Provider store={appStore}>
            <Header/>
            <Outlet />
            <Footer/>
            </Provider>
        </div>
    )
}
const appRouter =createBrowserRouter([
    {
        path:"/",
        element:<AppLayout/>,
        children:[ {
        path:"/login",
        element:<Login/>,
    },
    {
        path:"/",
        element:<Body/>,
        },
    {
        path:"/signup",
        element:<SignUp/>,
    },
    {
        path:"/profile",
        element:<Profile/>,
    },
    {
        path:"/connection",
        element:<Connections/>,
    },
    {
        path:"/request",
        element:<Request/>,
    }
    
]
    },
   
])

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={appRouter}/>);
