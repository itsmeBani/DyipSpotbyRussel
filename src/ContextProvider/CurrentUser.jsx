import React, {createContext, useEffect, useRef, useState} from "react";
import {auth} from "../api/firebase-config.js";
import { onAuthStateChanged } from 'firebase/auth';
import {useCookies} from "react-cookie";
import useCheckRole from "../CustomHooks/useCheckRole.js";

export const CurrentUserContext = createContext({});

function CurrentUserProvider({children}) {
    const [CurrentUser, setCurrentUser] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['authentication-token']);
   const [refreshMapstyle,setRefreshMapStyle] = useState(false)
    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const decryptedRole = useCheckRole("role", encryptionKey);
    const [mapStyle, setMapStyle] = useState('');

   const InitializeMapstyle=()=>{

       const savedStyle = localStorage.getItem('mapStyle');
       if (savedStyle) {
           setMapStyle(savedStyle);
           console.log(savedStyle)
       } else {
           setMapStyle("mapbox://styles/mapbox/standard");
       }
   }

    useEffect(() => {
        InitializeMapstyle()
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                console.log("User is signed in with Google:", currentUser);
                setCurrentUser(currentUser);
            } else {
                removeCookie("authentication-token")
                console.log("No user is signed in.");
                setCurrentUser(null);
            }
        });

        return () => unsubscribe();
    }, [refreshMapstyle,decryptedRole,cookies]);



    return (
        <CurrentUserContext.Provider value={
            {
                CurrentUser,mapStyle,refreshMapstyle,setRefreshMapStyle
            }}>
            {children}
        </CurrentUserContext.Provider>
    );
}

export default CurrentUserProvider;