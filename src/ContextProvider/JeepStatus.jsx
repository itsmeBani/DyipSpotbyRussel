import React, {createContext, useEffect, useRef, useState} from "react";
import {auth} from "../api/firebase-config.js";
import { onAuthStateChanged } from 'firebase/auth';
import {useCookies} from "react-cookie";

export const JeepSatatusContext = createContext({});

function JeepSatatus({children}) {


    const mapRef = useRef(null);
    const [openBottomSheet, setOpenBottomSheet] = React.useState(false);
    const [activeJeepId,setActiveJeepId]=useState(null)
    const [JeepStatusModal,setJeepStatusModal]=useState({})
    const [ShowPassenger,setShowPassenger]=useState(true)
    const [ShowDrivers,setShowDrivers]=useState(false)
    const FallowDriver=(lat,long,heading)=>{
        mapRef.current.flyTo({
            center: [long, lat],
            zoom:17,
            animate:true,
            duration:3000,
        })
    }
    const  GotoNearestPassenger=(lat,long,heading)=>{
        mapRef.current.flyTo({
            center: [long, lat],
            zoom:17,
            animate:true,
            duration:3000,
        })
    }


    const UserView=(lat,long,heading)=>{
        mapRef.current.flyTo({
            zoom:13,
            animate:true,
            duration:3000,
        })
    }





    return (
        <JeepSatatusContext.Provider value={{
            mapRef,FallowDriver,activeJeepId,setActiveJeepId,JeepStatusModal,setJeepStatusModal
            ,openBottomSheet, setOpenBottomSheet,ShowPassenger,setShowPassenger,
            ShowDrivers,setShowDrivers,UserView,GotoNearestPassenger
        }}
            >
            {children}
        </JeepSatatusContext.Provider>
    );
}

export default JeepSatatus;