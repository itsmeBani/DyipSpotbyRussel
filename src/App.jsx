import { useState } from 'react'
import './App.css'
import  {auth} from "./api/firebase-config.js";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import _Layout from "./pages/_Layout.jsx";
import Home from "./pages/Home.jsx";
import Track from "./pages/Track.jsx";
import Settings from "./pages/Settings.jsx";
import Landing from "./pages/Landing.jsx";
import {useCookies} from "react-cookie";
import CurrentUserProvider from "./ContextProvider/CurrentUser.jsx";
import {LocationProvider} from "./ContextProvider/Location.jsx";
const router = createBrowserRouter([
    {
        path: '/',
        element: <_Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/Active-Jeeps',
                element: <Home />,
            },
            {
                path: '/track',
                element: <Track />,
            },
            {
                path: '/settings',
                element: <Settings />,
            }
        ],
    },
]);

function App() {
    const [cookies, setCookie, removeCookie] = useCookies(['authentication-token']);
  return (
    <CurrentUserProvider>
        <LocationProvider>
            {
                cookies["authentication-token"] && cookies["role"] ? <RouterProvider router={router}/> : <Landing/>
            }
        </LocationProvider>
    </CurrentUserProvider>
  )
}

export default App
