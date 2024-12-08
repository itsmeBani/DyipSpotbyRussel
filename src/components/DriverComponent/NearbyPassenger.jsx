import React, {useContext, useEffect, useState} from 'react';
import {IconButton, Typography} from "@material-tailwind/react";
import nearbypassenger from "../../assets/nearbyPassenger.png"
import {CurrentUserContext} from "../../ContextProvider/CurrentUser.jsx";
import useFetchLocation from "../../CustomHooks/useFetchLocation.js";
import {JeepSatatusContext} from "../../ContextProvider/JeepStatus.jsx";
import {getRoute} from "../../api/DirectionApi.js";
import * as geolib from "geolib";
import {getUserDocRefById} from "../../ReusableFunctions.js";
import {getDoc} from "firebase/firestore";
function NearbyPassenger(props) {


    const { GotoNearestPassenger} = useContext(JeepSatatusContext)
    const [userLocationData] = useFetchLocation("users");
    const [driverLocationData] = useFetchLocation("drivers");
    const [PassengerDistance, setPassengerDistance] = useState()
    const FilterCurrentUser = userLocationData?.filter(user => user?.status === "waiting");
    const {CurrentUser} = useContext(CurrentUserContext)

    const [DriverCoordinates, setDriverCoordinates] = useState(null)



    async function NearestPassenger() {
        const users = FilterCurrentUser?.map(user => ({
            latitude: user?.latitude || 0.0,
            longitude: user?.longitude || 0.0,
        })) || [];
        if (users.length === 0) {
            return null;
        }
        const distantUsers = users.filter(user => {
            const distance = geolib.getDistance({latitude: DriverCoordinates?.latitude, longitude: DriverCoordinates?.longitude}, user);
            return distance >= 0;
        });



        return geolib.findNearest(
            {latitude: DriverCoordinates?.latitude, longitude: DriverCoordinates?.longitude},
            distantUsers
        );
    }

    const GetCurrentDriverLocation = async () => {
        try {
            const DriverUserdocRef = await getUserDocRefById(CurrentUser?.providerData[0].uid, "drivers");
            if (DriverUserdocRef) {
                const userDocSnap = await getDoc(DriverUserdocRef);
                if (userDocSnap.exists()) {
                    setDriverCoordinates({
                        latitude:userDocSnap?.data().latitude,
                        longitude:userDocSnap?.data().longitude
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching user data:', err);

        }
    }

    const HandleNearestPassenger = async () => {

        const nearestPassenger = await NearestPassenger();
        await  GotoNearestPassenger(nearestPassenger?.latitude,nearestPassenger?.longitude)
    }

    const fetchNearestPassenger = async () => {
        try {
            const nearestPassenger = await NearestPassenger();
            if (!nearestPassenger) {
                setPassengerDistance(null)
                return;
            }

            const response = await getRoute(
                [DriverCoordinates?.longitude, DriverCoordinates?.latitude],
                {
                    latitude: nearestPassenger.latitude,
                    longitude: nearestPassenger.longitude,
                }
            );

            if (response?.routes?.[0]?.distance != null) {
                const distance = response.routes[0].distance;

                console.log(distance)
                setPassengerDistance(distance);
            } else {
                console.log("Route response does not contain a valid distance.");
            }
        } catch (error) {
            console.log("Error finding nearest passenger:", error);
        }
    };

    useEffect(() => {
        if (userLocationData && driverLocationData) {
            GetCurrentDriverLocation().then()
            fetchNearestPassenger().then();
        }
    }, [userLocationData, driverLocationData]);











    return (

        <button onClick={HandleNearestPassenger} style={{
            background: 'linear-gradient(160deg, #48B2FC, #1C7FFF, #1C7FFF)',
        }} className=" h-8 p-8 rounded-xl bg-[#3083FF] shadow-2xl place-items-center gap-4 flex flex-row">
              <img src={nearbypassenger} className={"flex-1 h-13 w-8"} />


            <div className="w-full justify-center">
           <Typography className="PlusJakartaSans-Regular leading-2  text-[13px] md:text-[19px] text-white">Passenger nearby</Typography>
                <Typography className="leading-3 PlusJakartaSans-Bold mb-1 text-white   md:text-[19px] text-start">


                    {PassengerDistance ? PassengerDistance > 1000 ? (PassengerDistance / 1000).toFixed(1) : PassengerDistance?.toFixed(1)
                        : 0} {PassengerDistance && PassengerDistance > 1000 ? "KM" : "M"}
            </Typography>
            </div>
        </button>
    );
}

export default NearbyPassenger;