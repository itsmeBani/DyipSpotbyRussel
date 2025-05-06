import React, {useContext, useEffect, useState} from 'react';
import {getUserDocRefById} from "../../ReusableFunctions.js";
import {JeepSatatusContext} from "../../ContextProvider/JeepStatus.jsx";
import useReverseGeoCoding from "../../CustomHooks/useReverseGeocoding.js";
import axios from "axios";
import {Drawer, Typography} from "@material-tailwind/react";
import Currenloc from "../../assets/currentloc.png";
import {InformationCircleIcon} from "@heroicons/react/24/outline";

function HeaderPopup(props) {

    const {
        activeJeepId,
        JeepStatusModal,
        openBottomSheet,
        setOpenBottomSheet
    } = useContext(JeepSatatusContext)
    const ScreenWidth =window.innerWidth
    const [predictAddress, setPredictAddress] = useState(null)
    const ConvertedEstimatedArrivalTime = Math.floor(JeepStatusModal?.distance?.routes[0]?.duration / 60) || 0;
    const ConvertedDistance = Math.floor(JeepStatusModal?.distance?.routes[0]?.distance / 1000) || 0;
    const currentLocation = JeepStatusModal?.currentLocation || [0, 0];
    const {Address, setCoordinates} = useReverseGeoCoding();
    const ConvertedLatestDate = new Date((JeepStatusModal?.LastUpdated?.seconds * 1000 + Math.floor(JeepStatusModal?.LastUpdated?.nanoseconds / 1000000)))
    const MonthDay = ConvertedLatestDate.toLocaleString('en-US', {month: 'short', day: 'numeric'}); // Example: "Oct 25"
    const hours = ConvertedLatestDate.getHours();
    const minutes = ConvertedLatestDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const today = new Date();
    const TodayArray = [today.getMonth(), today.getDate(), today.getFullYear()]
    const DriverLatUpdated = [ConvertedLatestDate.getMonth(), ConvertedLatestDate.getDate(), ConvertedLatestDate.getFullYear()]
    const PresentDateFormat = formattedHours + ":" + formattedMinutes + " " + ampm
    const PastDateFormat = MonthDay + ",  " + formattedHours + " " + ":" + formattedMinutes + " " + ampm
console.log(ConvertedDistance)
    let checkifPresent = {
        today: 0,
        past: 0
    }
    for (let i = 0; i <= DriverLatUpdated.length - 1; i++) {
        if (DriverLatUpdated[i] > TodayArray[i]) {
            checkifPresent.today += 1
        } else if (TodayArray[i] > DriverLatUpdated[i]) {
            checkifPresent.past += 1
        }
    }

    const PredictDestination = async () => {
        try {
            const doc = await getUserDocRefById(activeJeepId, "drivers");
            const response = await axios.get(`https://predictdestination-2z3l.onrender.com/predict/${doc.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response);
            setPredictAddress(response.data);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    setPredictAddress(null);
                }
            } else {
                console.error("An error occurred:", error.message);
            }
        }
    };

    useEffect(() => {
            PredictDestination().then()
        setCoordinates({longitude: currentLocation[1], latitude: currentLocation[0]});
    }, [JeepStatusModal])
    return (
        <Drawer
            placement="top"
            open={openBottomSheet}

            overlay={false}
            size={ScreenWidth < 500 ? 150 : 300 }

            className="bg-unset place-items-end z-unset   shadow-none  flex justify-center    rounded-t-[30px] w-full">


            <div style={{
                background: 'linear-gradient(160deg, #48B2FC, #1C7FFF, #1C7FFF)',
            }}
                 className={"w-auto relative gap-4 rounded-xl shadow-md flex flex-col  h-auto  bg-white"}>


                <div className={"p-5 flex pb-0  divide-x  justify-between divide-solid " }>

                    <div className="relative px-1 md:px-5">
                        <Typography color={"white"} className="PlusJakartaSans-Medium">Arrival Time</Typography>
                        <Typography color={"white"} className={"PlusJakartaSans-Medium -leading-3"}> <span
                            className={"PlusJakartaSans-Bold text-[25px] md:text-[30px]"}>

                            {JeepStatusModal?.destination && !Object.keys(JeepStatusModal?.destination).length <= 0 && ConvertedEstimatedArrivalTime ? ConvertedEstimatedArrivalTime : 0}

                        </span> min</Typography>


                    </div>
                    <div className="relative px-5">
                        <Typography color={"white"} className="PlusJakartaSans-Medium">Speed</Typography>
                        <Typography color={"white"} className={"PlusJakartaSans-Medium -leading-3"}> <span
                            className={"PlusJakartaSans-Bold text-[25px] md:text-[30px]"}>{
                            JeepStatusModal?.speed ?    parseInt(JeepStatusModal?.speed) :0
                        }</span>  m/s</Typography>
                    </div>
                    <div className="relative px-5">
                        <Typography color={"white"} className="PlusJakartaSans-Medium">Distance</Typography>
                        <Typography color={"white"} className={"PlusJakartaSans-Medium -leading-3"}> <span
                            className={"PlusJakartaSans-Bold text-[25px] md:text-[30px]"}>
                            {
                                JeepStatusModal?.destination && !Object.keys(JeepStatusModal?.destination).length <= 0 && ConvertedDistance ? ConvertedDistance : 0
                            }


                        </span> km</Typography>
                    </div>
                </div>
                {JeepStatusModal?.destination && Object.keys(JeepStatusModal?.destination).length <= 0 && (
                    <div className="flex-1 px-8 relative flex items-center">
                        <div className="w-full p-3 bg-white border border-white rounded-lg">
                            <div className="flex flex-row gap-1">
                                <InformationCircleIcon className="h-6 text-[#FFAA33] w-6"/>
                                <div className="pr-2">
                                    <p className="text-[#FFAA33] font-medium text-sm">
                                        Driver has not set a destination
                                    </p>

                                    <div className="flex flex-row gap-1">
                                        <p className="text-[#3083FF] flex gap-3 PlusJakartaSans-Regular text-sm">
                                            Predicted Destination:
                                            <span className="PlusJakartaSans-Medium text-[#3083FF]">
                                                 {predictAddress ?
                                                     `   ${predictAddress[1]?.endpoint_address?.brgy}, ${predictAddress[1]?.endpoint_address?.city}, ${predictAddress[1]?.endpoint_address?.province}`
                                                     : "...loading"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className={" px-5 mdpx-10 flex pb-5 gap-10 justify-between" }>
                    <div className={"flex place-items-center gap-2"} >
                        <img src={Currenloc} className="w-7 h-7"/>
                        <div>
                            <Typography color={"white"} className={"PlusJakartaSans-Medium text-[13px] md:text-[15px]  -leading-3"}>
                                Current location
                            </Typography>
                            <Typography color={"white"} className={"PlusJakartaSans-Regular text-[12px] md:text-[14px]  leading-3"}>
                                {Address?.data?.features[0]?.properties?.context?.locality?.name + ", " +
                                    "" + Address?.data?.features[0]?.properties?.context?.place?.name + ", " +
                                    "" + Address?.data?.features[0]?.properties?.context?.region?.name}
                            </Typography>
                        </div>



                    </div>
                    <div className="">
                        <div>

                            <Typography color={"white"} className={"PlusJakartaSans-Medium text-[13px] md:text-[15px]  -leading-3"}>
                                Last Updated
                            </Typography>
                            <Typography color={"white"} className={"PlusJakartaSans-Regular text-[12px] md:text-[14px]    leading-3"}>
                                {checkifPresent.today > checkifPresent.past ?
                                    PresentDateFormat
                                    : checkifPresent.today < checkifPresent.past ?
                                        PastDateFormat
                                        : PresentDateFormat}
                            </Typography>
                        </div>
                    </div>

                </div>


                {openBottomSheet &&
                    <svg className="absolute text-[#1C7FFF]  h-7  w-full left-0 top-full" x="0px" y="0px"
                    viewBox="0 0 255 255" xmlSpace="preserve"><polygon className="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
                }

            </div>


        </Drawer>

    );
}

export default HeaderPopup;