import React from 'react';
import Passengericon from "../assets/passenger.png";
import Arrivaltime from "../assets/arrivaltime.png";
import speedIcon from "../assets/speed.png";
import Jeep from "../assets/dyipcropted.png";
import "../assets/fonts/PlusJakartaSans-Bold.ttf";
import DownloadCard from "./DownloadCard.jsx";
import { addDoc, collection, query, where, getDocs, serverTimestamp } from "firebase/firestore";
import { auth, googleprovider, db } from "../api/firebase-config";
import { signInWithPopup } from "firebase/auth";
import { useCookies } from "react-cookie";
import GetStartedButton from "./GetStartedButton.jsx";
import CryptoJS from 'crypto-js';
import Logo from  "../assets/SpeedLoc (2).png"
function GetStarted() {
    const [cookies, setCookie, removeCookie] = useCookies(['role']);

    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

    const encryptRole = (role) => {
        return CryptoJS.AES.encrypt(role, encryptionKey).toString(); // Using 'test-key' for testing
    };
    const ContinueWithGoogle = async () => {
        try {
            const user = await signInWithPopup(auth, googleprovider);
            if (user.user.providerData[0].uid) {
                const userRef = collection(db, "users");
                const driverRef = collection(db, "drivers");
                const driverQuery = query(driverRef, where("id", "==", user.user.providerData[0].uid));
                const passengerQuery = query(userRef, where("id", "==", user.user.providerData[0].uid));

                const passengerSnapshot = await getDocs(passengerQuery);
                const driverSnapshot = await getDocs(driverQuery);
                if (!driverSnapshot.empty) {
                    const docId = driverSnapshot.docs[0].id;
                    console.log("Driver already registered: ", docId);
                    setCookie("role", encryptRole("driver"));
                } else {

                    if (!passengerSnapshot.empty) {
                        const docId = passengerSnapshot.docs[0].id;
                        console.log("Passenger already registered: ", docId);
                        setCookie("role", encryptRole("passenger"));
                    } else {
                        const data={
                            id: user?.user?.providerData[0].uid,
                            first: user?._tokenResponse?.firstName,
                            ImageUrl: user?.user?.providerData[0].photoURL,
                            last: user?._tokenResponse?.firstName,
                            role: "passenger", // Default role is passenger
                            latitude: null,
                            CreatedAt: serverTimestamp(),
                            longitude: null,
                            status: "online",
                        }
                        console.log(data)
                        await addDoc(userRef,data);
                        console.log("Passenger registered ");
                        setCookie("role", encryptRole("passenger"));
                    }
                }


                setCookie("authentication-token", user._tokenResponse.idToken);
            }
        } catch (err) {
            console.error("Error during sign-in:", err);
        }
    };

   


    return (
       <div className="h-full flex flex-col  h-screen">
           <div className="pb-10 md:pb-0  flex justify-center pt-5 w-full"> <img src={Logo} alt="" className="h-[30px]"/></div>
           <div className="w-full flex-col-reverse md:flex-row gap-10 md:gap-0  overflow-hidden flex h-full ">

               <div className="w-full flex md:justify-center md:pb-12 md:flex-col md:h-full pb-7 md:pb-0">
                   <div className="md:pl-10 justify-start flex flex-col gap-2 md:gap-0">
                       <h2 className="PlusJakartaSans-Bold text-[2rem] md:text-[3.5rem] text-[rgb(60,60,60)] text-center">
                           Welcome to <span className="text-[#3083FF]">DyipSpot</span>
                       </h2>
                       <p className="px-2 md:px-0 PlusJakartaSans-Medium text-[rgba(60,60,60,0.78)] text-sm text-center">
                           Track Your Jeepneys in Real-Time, See Passenger Counts, and Get Instant Vehicle Updates.
                       </p>
                       <div className="flex flex-row justify-center gap-3 place-items-center mt-3 h-auto ">
                           <GetStartedButton ContinueWithGOOGLE={ContinueWithGoogle} />
                           <div className="hidden md:block">
                               <DownloadCard />
                           </div>
                       </div>
                   </div>
               </div>

               <div className="w-full h-full grid relative grid-row-2 flex-col ">
                   <div className="w-full flex h-full relative ">
                       <img src={speedIcon} className=" w-[10rem] absolute z-10 object-cover top-[7rem] md:top-[13rem] right-5 md:right-10 md:w-[13rem]" alt="" />
                       <img src={Arrivaltime} className=" w-[9rem] absolute object-cover left-10 md:left-24 top-[4rem] md:top-[12rem]  md:w-[13rem]" alt="" />
                       <img src={Passengericon} className= "w-[10rem] absolute object-cover  left-[40%] md:w-[17rem]  md:top-[3rem]  top-13" alt="" />
                       <img src={Jeep} className="absolute object-cover bottom-0 md:h-[60%] -right-[3rem]" alt="" />
                   </div>
               </div>
           </div>
       </div>
    );
}

export default GetStarted;
