    import {ComplexNavbar} from "../components/Navbar";
    import JeepLogs from "../components/JeepLogs";
    import Carousel from "../components/HomeComponents/Carousel";
    import 'mapbox-gl/dist/mapbox-gl.css';
    import {Typography} from "@material-tailwind/react";
    import BottomTabs from "../components/BottomTabs.jsx";
    import {ChartBarIcon} from "@heroicons/react/16/solid/index.js";
    import {UserCircleIcon} from "@heroicons/react/24/solid";
    import {BrowserRouter, Link, Route, Router, Routes, useLocation} from "react-router-dom";
    import React, {useContext} from "react";
    import MostActiveJeeps from "../components/HomeComponents/MostActiveJeeps.jsx";
    import {CurrentUserContext} from "../ContextProvider/CurrentUser.jsx";

    function Home() {
        const location = useLocation();
        const {CurrentUser}=useContext(CurrentUserContext)
        return (
            <div className=" w-full h-full   pt-4  flex-col flex  flex-1 ">
               <div className="flex  md:flex-row  flex-col place-items-center justify-center">
                   <div className="w-full">


                           <Typography className="px-10 text-[20px] PlusJakartaSans-Bold md:text-3xl" color="blue-gray" >
                               {CurrentUser?.displayName}
                           </Typography>


                        <Typography className="px-10 text-[12px]  md:text-[15px] PlusJakartaSans-Medium" color="grey">
                            Lets Track Your ride!
                        </Typography>

                   </div>
                   <div className="w-full place-items-center justify-center md:justify-start flex">
                       <Link to="/">
                       <UserCircleIcon    className={`w-7 h-7  ${location.pathname === "/" ? "text-blue-600" : "text-gray-700"}`}/>
                       </Link>
                       <Link to="/Active-Jeeps">
                       <ChartBarIcon className={`w-7 h-7  ${location.pathname === "/Active-Jeeps" ? "text-blue-600" : "text-gray-700"}`}/>
                       </Link>
                   </div>
               </div>

                {location.pathname === "/" && <Carousel/>}
                {location.pathname === "/Active-Jeeps" && <MostActiveJeeps/>}

            </div>
        );
    }

    export default Home;
