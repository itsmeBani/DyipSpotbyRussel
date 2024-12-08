import React, {useContext} from 'react';
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Drawer,
    IconButton,
    Timeline, TimelineBody, TimelineConnector, TimelineHeader, TimelineIcon, TimelineItem,
    Typography
} from "@material-tailwind/react";
import Jeep from "../../assets/jeep.png"
import useScroll from "../../CustomHooks/useScroll.jsx";
import cross from "../../assets/cross.png"
import useFetchJeeps from "../../CustomHooks/useFetchJeeps.js";
import {useRef} from "react";
import {useDraggable} from "react-use-draggable-scroll";
import {JeepSatatusContext} from "../../ContextProvider/JeepStatus.jsx";
import {
    ChatBubbleBottomCenterIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    PhoneIcon
} from "@heroicons/react/16/solid/index.js";
import {HomeIcon, InformationCircleIcon, MapIcon, MapPinIcon} from "@heroicons/react/24/solid";
import  passengersgroup from "../../assets/users-alt (1).png"
import UserBottomSheet from "./UserBottomSheet.jsx";
function RenderJeeps(props) {
    const {isDragging, handleMouseDown, handleMouseUp, handleMouseMove} = useScroll();
    const {mapRef, FallowDriver,activeJeepId,setActiveJeepId,openBottomSheet,ShowPassenger,setShowPassenger,
        ShowDrivers,setShowDrivers,UserView, setOpenBottomSheet} = useContext(JeepSatatusContext)

    const {LocationData, loading, error, setrefresh, refresh} = useFetchJeeps()







    const ref = useRef();
    const {events} = useDraggable(ref);
    const openDrawerBottom = (lat, long, heading,id) => {
        setActiveJeepId(id)
         }







    console.log(LocationData)
    return (
        <div
            className="flex pl-2 md:pb-2 justify-center w-full  place-items-center"

        >
            <div className="flex w-auto  flex   space-x-3 overflow-x-scroll no-scrollbar"
                 {...events}
                 ref={ref}>
                {LocationData.map((jeep, index, array) => {
                    const statusColor = jeep?.status === "online" ? "bg-[#f0f9f0] border-[#34C759]  text-[#34C759]" : jeep?.status === "waiting" ? "bg-[#fff3c6] border-[#FFCC00]  text-[#FFCC00]" : "bg-[#ffbaba]  border-[#ffbaba] text-[#FF3B30]"
                    return (

                        <Card  onClick={() => {
                            setShowDrivers(true)
                            setShowPassenger(false)
                            openDrawerBottom(jeep?.latitude, jeep?.longitude, jeep?.heading, jeep?.id)
                        }                        }


                               color="white" key={jeep?.id} shadow={false}



                              className=" z-11  scrollbar-hide h-auto flex  flex-row ">

                            <div className=" h-[110px] md:h-[130px]  md:w-[210px] w-[150px] md:p-4 p-3 pr-0   flex">
                                <img alt={"jeep"} draggable={false} style={{userSelect: 'none'}} src={jeep?.jeepImages[0]}
                                     className="object-cover rounded-lg"
                                />
                            </div>

                            <div className="w-full flex-col  justify-center flex p-4">

                                <Typography className="font-bold text-[13px] leading-4  capitalize" style={{userSelect: 'none'}}>
                                    {jeep?.name}

                                </Typography>
                                <Typography className=" whitespace-nowrap   leading-4 text-[14px] font-thin pb-2"
                                            style={{userSelect: 'none'}}>
                                    {jeep?.address?.length > 25 ? jeep.address.slice(0, 9) + "..." : jeep?.address}
                                </Typography>
                                <div>

                                    <div className="place-items-start ">
                                        <Typography style={{userSelect: 'none'}}
                                                    className={`PlusJakartaSans-Bold border-[1px] py-1 px-3 rounded-lg ${statusColor}`}>
                                            {jeep?.status}
                                        </Typography>
                                    </div>

                                    <div>


                                    </div>
                                </div>
                                <div className="absolute bottom-4 right-4 hover:cursor-pointer "
                                    >
                                    <img src={cross} className="w-7 h-7"/>
                                </div>
                            </div>


                        </Card>

                    )
                })

                }
<UserBottomSheet/>
            </div>

        </div>
    );
}

export default RenderJeeps;
