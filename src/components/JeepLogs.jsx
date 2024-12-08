import React, {useState} from "react";
import Logo from '../assets/SpeedLoc (2).png';
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Button, TabPanel, TabsBody, TabsHeader, Tabs, Tab,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import {ChevronRightIcon, ChevronDownIcon} from "@heroicons/react/24/outline";
import {TravelHistory} from "./HomeComponents/TravelHistory";
import useScroll from "../CustomHooks/useScroll.jsx";
import DailyPassenger from "../components/HomeComponents/DailyPassenger.jsx"
import RecentTrips from "./HomeComponents/RecentTrips.jsx";

export default function JeepLogs({isActive,DriverInformation,getTableDataFromOneTable}) {
    const {isDragging, handleMouseDown, handleMouseUp, handleMouseMove} = useScroll();


    const [activeLogsIndex, setActiveLogsIndex] = useState(0)


    function RenderLogs() {
        switch (activeLogsIndex) {
            case  0:
                return <DailyPassenger getTableDataFromOneTable={getTableDataFromOneTable} PassengersData={DriverInformation} />
            case  1:
                return <TravelHistory getTableDataFromOneTable={getTableDataFromOneTable} DriverInformation={DriverInformation}/>
            case  2:
                return <RecentTrips getTableDataFromOneTable={getTableDataFromOneTable} RecentTrips={DriverInformation}/>
        }
    }

    const TabName =
        [{
            id: 0,
            name: "Daily Passengers",


           },
            {
                id: 1,
                name: "Travel History",

            }, {
                id: 2,
                name: "Recent Trips",
            }
]


    const HandleSetActiveLogs = (index) => {
        setActiveLogsIndex(index)

    }

    return (
        <div
            className={` flex-col flex h-full  flex-1 absolute overflow-hidden   shadow-none    select-none rounded-none  gap-0  w-full  pl-4  ${isActive ? "opacity-100" : " opacity-100"}`}>
            <div
                className=" flex w-full gap-2 pb-3 pt-3 h-auto overflow-x-hidden no-scrollbar "
                style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
              {

                TabName.map((item,index)=>{

                  return (

                      <button key={index} onClick={() => {
                        HandleSetActiveLogs(item?.id)
                      }} className={`whitespace-nowrap text-gray-600 flex place-items-center md:text-[13px]  shadow-md PlusJakartaSans-Medium md:pt-3 md:pt-3 md:pb-3 pt-2 pb-2 px-3 text-[10px] rounded-full  ${item?.id === activeLogsIndex && "text-white bg-[#3083FF]"}  "`}>
                        {item?.name}
                      </button>
                  )
                })
              }
            </div>


            <div className="h-full  overflow-y-hidden   w-full    flex">

                {RenderLogs()}

            </div>
        </div>
    );
}
