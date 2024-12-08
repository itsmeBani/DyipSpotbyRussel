import React from 'react';
import {CogIcon, HomeIcon, HomeModernIcon, TruckIcon} from "@heroicons/react/24/solid";
import {Typography} from "@material-tailwind/react";
import JeepIcon from "./JeepIcon.jsx";
import {Link} from "react-router-dom";

function BottomTabs(props) {
    return (
        <div className="w-full border-t-2 border-[#272727]/0.2 flex justify-evenly md:hidden pt-1  bg-white sm:flex">
            <Link to={"/"}>
                <div className={"h-full justify-center place-items-center flex flex-col"}>
                    <HomeIcon className="w-5 h-6 text-center text-gray-600 "/>
                    <Typography color={"gray"} className="PlusJakartaSans-Medium  text-[12px]">Home</Typography>
                </div>
            </Link>
            <Link to={"/track"}>
                <div className={"h-full justify-center place-items-center flex flex-col"}>
                    <JeepIcon color={"#616161"} width={13} height={20}/>
                    <Typography color={"gray"} className="PlusJakartaSans-Medium text-[12px]">Track</Typography>
                </div>
            </Link>
            <Link to={"/settings"}>
                <div className={"h-full justify-center place-items-center flex flex-col"}>
                    <CogIcon className="w-5 h-6 text-center text-gray-600"/>
                    <Typography color={"gray"} className="PlusJakartaSans-Medium text-[12px]">Settings</Typography>
                </div>
            </Link>
        </div>

    );
}

export default BottomTabs;