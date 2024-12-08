import React, { createContext, useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "./CurrentUser.jsx";
import useCheckRole from "../CustomHooks/useCheckRole.js";
import { serverTimestamp, updateDoc } from "firebase/firestore";
import { getUserDocRefById } from "../ReusableFunctions.js";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {

    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);
    const { CurrentUser } = useContext(CurrentUserContext);
    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const decryptedRole = useCheckRole("role", encryptionKey);
    const isDriver =decryptedRole === "passenger" ? "users" : "drivers"
    // useEffect(() => {
    //     if (!navigator.geolocation) {
    //         setError("Geolocation is not supported by your browser");
    //         return false;
    //     }
    //
    //     const watchId = navigator.geolocation.watchPosition(
    //         async (position) => {
    //             const ref = await getUserDocRefById(
    //                 CurrentUser?.providerData[0]?.uid,
    //                 decryptedRole === "passenger" ? "users" : "drivers"
    //             );
    //             setLocation(location)
    //             if (!ref) {
    //                 console.error("Document reference is undefined");
    //                 return;
    //             }
    //
    //             const locationData = {
    //                 latitude: position?.coords?.latitude,
    //                 longitude: position?.coords?.longitude,
    //             };
    //
    //             const additionalData = decryptedRole === "driver" ? { LastUpdated: serverTimestamp() } : {};
    //
    //             try {
    //                 await updateDoc(ref, { ...locationData, ...additionalData });
    //                 console.log(`${decryptedRole} document updated with ID: ${CurrentUser?.providerData[0]?.uid}`);
    //             } catch (e) {
    //                 console.error("Error updating document: ", e);
    //             }
    //         },
    //         (err) => {
    //             setError(err.message);
    //         },
    //         {
    //             enableHighAccuracy: true,
    //
    //         }
    //     );
    //
    //     return () => navigator.geolocation.clearWatch(watchId);
    // }, [location]); // Added dependencies


    useEffect(() => {
        let intervalId;

        if ("geolocation" in navigator) {
            intervalId = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    async (position) =>{

                        console.log(position.coords.latitude, position.coords.latitude)
console.log(CurrentUser?.providerData[0]?.uid)

                        const ref = await getUserDocRefById(
                            CurrentUser?.providerData[0]?.uid,
                            isDriver
                        );


                        console.log(isDriver)
                        if (!ref) {
                            console.error("Document reference is undefined");
                            return;
                        }
                                    const locationData = {
                                        latitude: position?.coords?.latitude,
                                        longitude: position?.coords?.longitude,
                                    };

                                    const additionalData = isDriver ? { LastUpdated: serverTimestamp() } : {};

                                    try {
                                        await updateDoc(ref, { ...locationData, ...additionalData });
                                        console.log(`${isDriver} document updated with ID: ${CurrentUser?.providerData[0]?.uid}`);
                                    } catch (e) {
                                        console.error("Error updating document: ", e);
                                    }



                    },
                    (err) => {
                        setError(err.message);
                    },
                    {
                        enableHighAccuracy: true,
                    }
                );
            }, 5000); // Update every 3 seconds
        } else {
            setError("Geolocation is not supported by your browser");
        }

        // Cleanup interval on component unmount
        return () => {
            clearInterval(intervalId);
        };
    }, [CurrentUser,decryptedRole]);

    return (
        <LocationContext.Provider value={{ error }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => React.useContext(LocationContext);
