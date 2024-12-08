import React, {useContext, useEffect, useState} from 'react';
import {
    Avatar,
    Drawer,
    IconButton,
    Timeline, TimelineBody,
    TimelineConnector, TimelineHeader, TimelineIcon,
    TimelineItem,
    Typography
} from "@material-tailwind/react";
import {ChatBubbleOvalLeftEllipsisIcon, PhoneIcon} from "@heroicons/react/16/solid/index.js";
import {InformationCircleIcon, MapPinIcon} from "@heroicons/react/24/solid/index.js";
import passengersgroup from "../../assets/users-alt (1).png";
import {JeepSatatusContext} from "../../ContextProvider/JeepStatus.jsx";

import {collection, onSnapshot, query, where} from "firebase/firestore";
import {getRoute} from "../../api/DirectionApi.js";
import {db} from "../../api/firebase-config.js";
import useReverseGeocoding from "../../CustomHooks/useReverseGeocoding.js";
import AddressTimeline from "./AddressTimeline.jsx";
import  Currenloc from  "../../assets/currentloc.png"
import HeaderPopup from "./HeaderPopup.jsx";
function UserBottomSheet(props) {
    const {
        mapRef,
        FallowDriver,
        activeJeepId,
        JeepStatusModal,
        setJeepStatusModal,
        setActiveJeepId,
        openBottomSheet,
        setOpenBottomSheet
    } = useContext(JeepSatatusContext)
    const closeDrawerBottom = () => {
        setJeepStatusModal(null)
        setActiveJeepId(null)
        setOpenBottomSheet(false);
    }

    const screenWidth = window.innerWidth;


    const [jeepData, setJeepData] = useState();
    const [loading, setLoading] = useState(true)
    const fetchDriverData = () => {
        console.log(screenWidth)
        setLoading(true);
        try {

            const driverRef = collection(db, "drivers");
            const driverQuery = query(driverRef, where("id", "==", activeJeepId));

            return onSnapshot(driverQuery, async (snapshot) => {
                if (!snapshot.empty) {
                    const driver = snapshot.docs[0].data();
                    console.log("Fetching data for jeep ID: ", activeJeepId);

                    await setJeepStatusModal({
                        speed: driver?.speed,
                        currentLocation: [driver?.latitude, driver?.longitude],
                        destination: driver?.endpoint,
                        LastUpdated: driver?.LastUpdated,
                        distance: driver?.endpoint && Object.keys(driver?.endpoint).length > 0
                            ? await getRoute([driver?.longitude, driver?.latitude], driver?.endpoint)
                            : null,
                    });

                    await FallowDriver(driver?.latitude, driver?.longitude, driver?.heading)
                    setJeepData(driver);

                    setLoading(false);
                    setTimeout(() => {
                        setOpenBottomSheet(true);
                    }, 1000);

                }
            });
        } catch (error) {
            console.error("Error fetching driver data: ", error);
            setOpenBottomSheet(false);
        }
    };

    useEffect(() => {
        if (!activeJeepId) {
            setOpenBottomSheet(false);
            return
        }
        const unsubscribe = fetchDriverData();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [activeJeepId]);


    return (

        <div className="">


<HeaderPopup/>
            <Drawer
                placement="bottom"
                open={openBottomSheet}

                overlay={false}
                size={screenWidth > 642 ? 230 :250}

                className=" bg-white  p-5 px-5 pb-0 md:px-20 rounded-t-[30px] w-full"
            >

                <button  color="blue-gray" className={"absolute top-5 right-5"}
                       onClick={closeDrawerBottom}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <div className="flex flex-col pt-10 no-scrollbar  md:flex-row overflow-y-auto  md:place-items-center md:justify-center w-full  h-full  gap-5 md:gap-10">
                    <div className="flex   flex-col gap-3 place-items  md:border-r-4 md:pr-10 ">
                      <div className="flex gap-1 place-items-center gap-10  h-full">
                          <div className="flex  place-items-center w-full px gap-3">
                              <Avatar size={"lg"} variant={"circular"} src={jeepData?.imageUrl} alt="avatar"/>
                              <div>
                                  <Typography color="gray" variant={"paragraph"}
                                              className="PlusJakartaSans-Medium opacity-80 leading-3">Driver</Typography>
                                  <Typography color={"blue-gray"} variant={"paragraph"}
                                              className={"PlusJakartaSans-Bold opacity-70"}><>{jeepData?.name}</> </Typography>
                              </div>


                          </div>

                          <div className="flex flex-row justify-center place-items-center gap-2">
                              <IconButton variant={"gradient"} color={"blue"} className="bg-[#3083FF] rounded-full  ">
                                  <ChatBubbleOvalLeftEllipsisIcon className={"w-7 h-7 text-white p-0.5"}/>

                              </IconButton>
                              <IconButton variant={"gradient"} color={"blue"} className="bg-[#3083FF] rounded-full">
                                  <PhoneIcon className={"w-7 h-7 text-white p-0.5"}/>
                              </IconButton>
                          </div>
                      </div>

                            <div className="flex  gap-4 pl-2  hidden md:flex  pr-10 place-items-center">
                                <img src={passengersgroup} className="h-10 w-10 "/>
                                <div>
                                    <Typography color="gray" className={"PlusJakartaSans-Medium"}>No of

                                        Passengers</Typography>

                                   <Typography  className="PlusJakartaSans-Bold text-[15px] leading-3 " color="gray">

                                       <span
                                           className="PlusJakartaSans-Bold text-[19px] leading-3 text-[#3083FF]">{jeepData?.passengers}</span>/10

                                   </Typography>
                                </div>
                            </div>
                    </div>
                    {
                        jeepData?.endpoint && jeepData?.startpoint &&
                        Object.keys(jeepData.endpoint).length > 0 &&
                        Object.keys(jeepData.startpoint).length > 0
                            ? (
                                <div className="flex   place-items-center justify-center flex-col md:border-r-4 pr-10">
                                    <AddressTimeline
                                        Startpoint={jeepData?.startpoint}
                                        Destination={jeepData?.endpoint}
                                    />

                                </div>
                            )
                            : null
                    }

                    <div className="flex  gap-4 pl-2  block md:hidden  pr-10 place-items-center">
                        <img src={passengersgroup} className="h-10 w-10 "/>
                        <div>
                            <Typography color="gray" className={"PlusJakartaSans-Medium"}>No of

                                Passengers</Typography>

                            <Typography  className="PlusJakartaSans-Bold text-[15px] leading-3 " color="gray">

                                   <span
                                       className="PlusJakartaSans-Bold text-[19px] leading-3 text-[#3083FF]">{jeepData?.passengers}</span>/10

                            </Typography>         </div>
                    </div>

                    <div className="flex  mb-5 gap-2">

                        <div
                            className="bg-blue-200 md:w-[300px] h-full p-5 bg-[#DCEBFE]/80 border-[#1E3FAE] border-[1.2px] rounded-lg">
                            <Typography className={"PlusJakartaSans-Bold text-[14px] flex  gap-1 text-[#1E3FAE]"}
                                        variant={"paragraph"}>
                                <InformationCircleIcon className="w-6 h-6"/> Seat Capacity Alert
                            </Typography>
                            <Typography className={"PlusJakartaSans-Medium text-[14px] text-[#1E3FAE]"}
                                        variant={"paragraph"}>
                           <>
                               If a larger passenger boards,
                               please
                               be aware that the seating capacity may be affected
                           </>
                            </Typography>
                        </div>
                    </div>

                </div>

            </Drawer>
        </div>

    );
}

export default UserBottomSheet;