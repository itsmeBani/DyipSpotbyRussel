import React, {useContext, useState} from 'react';
import {Drawer, IconButton, Spinner, Typography} from "@material-tailwind/react";
import NearbyPassenger from "./NearbyPassenger.jsx";
import {auth, db} from "../../api/firebase-config.js";

import {SearchBox} from '@mapbox/search-js-react';
import {CurrentUserContext} from "../../ContextProvider/CurrentUser.jsx";
import {collection, getDocs, updateDoc, query, where, doc, addDoc, serverTimestamp} from "firebase/firestore";
import {getUserDocRefById} from "../../ReusableFunctions.js";

function SetDestinationButton(props) {
    const [open, setOpen] = useState(false)
    const {CurrentUser} = useContext(CurrentUserContext)
    const [successMsg,setSuccessMsg]=useState(null)
    const [StartPoint, setStartPoint] = useState(null)
    const [EndPoint, setEndPoint] = useState(null)
    const [StartPointError, setStartPointError] = useState(null)
    const [EndPointError, setEndPointError] = useState(null)
    const [loading, setLoading] = useState(false)
    const OpenSetDestinationButton = () => {
        setOpen(true)
    }

    const CloseSetDestinationButton = () => {
        setOpen(false)

    }
    const [value, setValue] = React.useState('');
    const handleChange = (e) => {
        console.log(e)
    };

    const handleStartPoint = (coords) => {

        const {coordinates, context} = coords.features[0].properties
        const StartPointData = {
            startPoint: [coordinates?.longitude, coordinates?.latitude],
            Region: context.region?.name || "",
            PlaceName: context.place?.name  || "",
            Locality: context.locality?.name  || ""
        }
        setStartPoint(StartPointData)
    }


    const handleEndPoint = (coords) => {
        const {coordinates, context} = coords.features[0].properties
        const EndPointData = {
            EndPoint: [coordinates?.longitude, coordinates?.latitude],
            Region: context.region?.name || "",
            PlaceName: context.place?.name || "",
            Locality: context.locality?.name || "",
        }
        setEndPoint(EndPointData)

    }
    const getCurrentLocation = async () => {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
            } else {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        console.log(position.coords)
                    },
                    (error) => {
                        alert('Unable to retrieve your location.');
                        reject(error);
                    }
                );
            }
        });
    };


    const SetRoute = async () => {
        setLoading(true)
        if (StartPoint === null){
              getCurrentLocation()

            setStartPointError( "Start Point is Required")
            setLoading(false)
            return false;
        }
        if (EndPoint === null){
            setEndPointError("Destination is Required")
            setLoading(false)
            return false;
        }

        const driverRef = await getUserDocRefById(CurrentUser.providerData[0].uid, "drivers")
        const DriverDocRef = await getUserDocRefById(CurrentUser.providerData[0].uid, "drivers");
        const TripRef = collection(db, 'drivers', DriverDocRef.id, 'Trips');

        try {
            await updateDoc(driverRef, {
                status: "online",
                startpoint: {
                    latitude: StartPoint?.startPoint[1],
                    longitude: StartPoint?.startPoint[0]
                },
                endpoint: {
                    latitude: EndPoint?.EndPoint[1],
                    longitude: EndPoint?.EndPoint[0]
                },
            })

            const Trips = {
                startpoint: {
                    latitude: StartPoint?.startPoint[1],
                    longitude: StartPoint?.startPoint[0]
                },
                endpoint: {
                    latitude: EndPoint?.EndPoint[1],
                    longitude: EndPoint?.EndPoint[0]
                },
                StartPointAddress: {
                    Locality: StartPoint?.Locality,
                    Region: StartPoint?.Region,
                    PlaceName: StartPoint?.PlaceName
                },
                EndPointAddress: {
                    Locality: EndPoint?.Locality,
                    Region: EndPoint?.Region,
                    PlaceName: EndPoint?.PlaceName
                },
                date: serverTimestamp(),
                id: CurrentUser.providerData[0].uid
            }

            console.log(Trips)
            await addDoc(TripRef, Trips)
            setEndPointError(null)
            setStartPointError(null)
            setValue('')
            setLoading(false)
            setSuccessMsg("Added Route Successfully")
            setTimeout(() => {
                setSuccessMsg(null);
            }, 2000);
            setTimeout(() => {
                CloseSetDestinationButton()
            }, 2000);

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <>


            <Drawer
                placement="right"
                open={open}
                overlay={false}
                size={400}
                onClose={CloseSetDestinationButton}
                className="p-4 shadow-[-9px_0_10px_rgba(0,0,0,0.7)] flex flex-col h-full justify-center"
            >

                <button  color="blue-gray" className={"absolute top-5 right-5"}
                         onClick={CloseSetDestinationButton}>
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


                <Typography color="gray" variant="h4" className="PlusJakartaSans-Bold ">Set Route</Typography>
                <div className="p-4 flex justify-center  flex-col  gap-3 ">
                    <div>
                        <Typography color={"blue"} className=" PlusJakartaSans-Medium">Start Point</Typography>
                        <SearchBox
                            options={{
                                language: 'fil',
                                country: 'ph',
                            }}
                            marker={true}
                            placeholder={"My location"}
                            theme={{

                                variables: {
                                    borderRadius: '10px',
                                    colorPrimary: '#FF5733',
                                    boxShadow: null,
                                    border: "solid 1.5px #ccc",
                                },
                            }}
                            onClear={() => setStartPoint(null)}
                            value={value}
                            onRetrieve={(e) => handleStartPoint(e)}
                            onChange={(e) => handleChange(e)}
                            accessToken="pk.eyJ1IjoiamlvdmFuaTEyMyIsImEiOiJjbHl6bWE1Ymkxb2o5MmtzYngxaGJuMWljIn0.olBgfruAbty0QZdtvASqoQ"
                        />

                        {StartPointError &&
                            <p className="PlusJakartaSans-Medium text-[13px] text-red-400">{StartPointError}</p>}
                    </div>
                    <div>
                        <Typography color={"blue"} className=" PlusJakartaSans-Medium">Destination Point</Typography>
                        <SearchBox
                            options={{
                                language: 'fil',
                                country: 'ph',
                            }}
                            placeholder="Destination"
                            theme={{
                                variables: {
                                    borderRadius: '10px',
                                    colorPrimary: '#FF5733',
                                    boxShadow: null,

                                    border: "solid 1.5px #ccc",
                                },
                            }}
                            onClear={() => setEndPoint(null)}
                            value={value}
                            onChange={(e) => handleChange(e)}
                            onRetrieve={(e) => handleEndPoint(e)}
                            accessToken="pk.eyJ1IjoiamlvdmFuaTEyMyIsImEiOiJjbHl6bWE1Ymkxb2o5MmtzYngxaGJuMWljIn0.olBgfruAbty0QZdtvASqoQ"
                        />
                        {EndPointError &&
                            <p className="PlusJakartaSans-Medium text-[13px] text-red-400">{EndPointError}</p>}


                    </div>

                    <div>

                        <button onClick={SetRoute}
                                className={"bg-[#3083FF] w-full py-3 rounded-full flex place-items-center  justify-center text-white PlusJakartaSans-Medium shadow-lg"}>
                            {loading ? <Spinner color={"white"}/> : "Set Route"}
                        </button>
                        <p className="text-center p-2 text-green-600">  {successMsg}</p>
                    </div>
                </div>
            </Drawer>

            <IconButton onClick={OpenSetDestinationButton} className="w-10 h-10 p-8  rounded-xl bg-[#3083FF]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 " fill={"#fff"} viewBox="0 0 512 512">
                    <path
                        d="M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8C59.8 473 0 402.5 0 352c0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9c-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"/>
                </svg>
            </IconButton>

        </>


    );
}

export default SetDestinationButton;