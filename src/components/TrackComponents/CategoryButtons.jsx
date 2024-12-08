import React, {useContext} from 'react';
import useScroll from "../../CustomHooks/useScroll.jsx";
import JeepIcon from "../JeepIcon.jsx";
import {UserGroupIcon, UserIcon} from "@heroicons/react/16/solid/index.js";
import WeatherIndicator from "./WeatherIndicator.jsx";
import {JeepSatatusContext} from "../../ContextProvider/JeepStatus.jsx";
import {Badge} from "@material-tailwind/react";
import useFetchLocation from "../../CustomHooks/useFetchLocation.js";

function CategoryButtons(props) {
    const { isDragging, handleMouseDown, handleMouseUp, handleMouseMove } = useScroll();
    const {
        mapRef,
        FallowDriver,
        activeJeepId,
        JeepStatusModal,
        setJeepStatusModal,
        setActiveJeepId,
        openBottomSheet,
        setOpenBottomSheet,ShowPassenger,setShowPassenger,
        ShowDrivers,setShowDrivers,UserView
    } = useContext(JeepSatatusContext);

    const isShowPassenger = ShowPassenger ? "text-white bg-[#3083FF]" : "text-[#3083FF] bg-[white]"
    const isShowDriver = ShowDrivers ? "text-white bg-[#3083FF]" : "text-[#3083FF] bg-[white]"

    const [userLocationData] = useFetchLocation("users");

    const FilterPassenger = userLocationData?.filter(user => user?.status === "waiting");


    const [driverLocationData] = useFetchLocation("drivers");
    const FilterJeeps = driverLocationData?.filter(user => user?.status === "waiting"  ||  user?.status === "online");


    return (

   <div>
       <div
           className="p-3 flex w-full gap-2 h-auto overflow-x-hidden no-scrollbar"
           style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
           onMouseDown={handleMouseDown}
           onMouseLeave={handleMouseUp}
           onMouseUp={handleMouseUp}
           onMouseMove={handleMouseMove}
       >
           <Badge content={FilterPassenger?.length}  withBorder className={`${ShowPassenger ? " bg-[#fff] text-[#3083FF]" : "bg-[#3083FF]" }`}>
               <button onClick={()=>{
                   if(!ShowDrivers) return false
                   UserView()
                   setShowDrivers(false)
                   setShowPassenger(!ShowPassenger)
               }
               } className={`flex  place-items-center ${isShowPassenger} gap-2 whitespace-nowrap PlusJakartaSans-Medium  shadow-lg py-2 px-4 rounded-full `}>
                   <UserGroupIcon className={"w-6 h-6"}/> Passengers
               </button>
           </Badge>
           <Badge content={FilterJeeps?.length}  withBorder className={`${ShowDrivers ? " bg-[#fff] text-[#3083FF]" : "bg-[#3083FF]" }`}>
           <button onClick={()=>{
               if(!ShowPassenger) return false
               UserView()
               setShowPassenger(false)
               setShowDrivers(!ShowDrivers)
           }
           } className={`flex  place-items-center ${isShowDriver} gap-2 whitespace-nowrap PlusJakartaSans-Medium  shadow-lg py-2 px-4 rounded-full `}>
               <JeepIcon color={ShowDrivers ? "white" :"#3083FF"}/>   Jeeps
           </button>
           </Badge>

       </div>
  <div className={" relative"}>
      <WeatherIndicator/>
  </div>
   </div>
    );
}

export default CategoryButtons;