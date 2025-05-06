import React, {useContext, useEffect, useState} from 'react';
import SettingsCard from '../components/SettingsCard'
import NotAvailableCard from '../components/NotAvailableCard.jsx';
import ApplyCard from '../components/ApplyCard'
import GeneralCard from '../components/GeneralCard.jsx'
import AllowBackGroundTasking from "../components/SettingsComponent/AllowBackGroundTasking.jsx";
import BottomTabs from "../components/BottomTabs.jsx";
import Mapstyle from "../components/SettingsComponent/Mapstyle.jsx";
import RequestStatus from "../components/SettingsComponent/RequestStatus.jsx";
import {CurrentUserContext} from "../ContextProvider/CurrentUser.jsx";
import useCheckRole from "../CustomHooks/useCheckRole.js";
import {collection, getDoc, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../api/firebase-config.js";
import EditProfile from "../components/SettingsComponent/Profile.jsx";
import {getUserDocRefById} from "../ReusableFunctions.js";

function Settings(props) {
    const [AlreadyApply, setAlreadyApply] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [Applicant, setApplicant] = useState(null); // State to hold fetched user data
    const {CurrentUser} = useContext(CurrentUserContext)
    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const decryptedRole = useCheckRole('role', encryptionKey);









    useEffect(() => {
        setLoading(true);

        try {
            if (CurrentUser?.providerData[0]?.uid) {
                const docRef = collection(db, "Request");
                const q = query(docRef, where("id", "==", CurrentUser?.providerData[0]?.uid));

                const unsubscribe = onSnapshot(
                    q,
                    (querySnapshot) => {
                        try {
                            if (!querySnapshot.empty) {
                                setAlreadyApply(true);
                                const userDoc = querySnapshot.docs[0];
                                console.log(userDoc);
                                setApplicant(userDoc.data());
                            } else {
                                setAlreadyApply(false);
                                setApplicant(null);
                            }
                            setLoading(false);
                        } catch (snapshotError) {
                            console.error("Error processing snapshot: ", snapshotError);
                            setLoading(false);
                        }
                    },
                    (error) => {
                        console.error("Error in onSnapshot: ", error);
                        setLoading(false);
                    }
                );

                return () => unsubscribe();
            }
        } catch (error) {
            console.error("Error in useEffect: ", error);
            setLoading(false);
        }
    }, [CurrentUser]);
    const renderContent = () => {
        switch (true) {
            case decryptedRole === "passenger" && AlreadyApply:
                return <RequestStatus Applicant={Applicant} status={Applicant?.status}/>;
            case decryptedRole === "passenger" && !AlreadyApply:
                return <ApplyCard/>;
        }
    };
    return (
        <div className="p-3  min-w-sm:p-3  md:p-10 h-full  flex  flex-col  w-full">

            <div className="w-full flex md:flex-row  pb-[70px] flex-col gap-4  md:gap-[10rem] ">

                <div className=" ">
                    <div className="PlusJakartaSans-Bold   pb-5 text-[1.5rem] text-[rgb(60,60,60)] text-left">
                        Settings
                    </div>
                    <SettingsCard/>
                </div>
                <div className="flex flex-col w-auto  ">
                    {
                        decryptedRole === "driver" && (
                            <EditProfile/>
                        )
                    }

                    <AllowBackGroundTasking/>

                    {
                        decryptedRole === "passenger" && (
                            <>
                                {isLoading ? <div>loading</div> : renderContent()}
                            </>
                        )
                    }

                    <Mapstyle/>

                    <GeneralCard/>
                </div>
            </div>
            <div className={"fixed bottom-0 w-full left-0"}>
                <BottomTabs/>
            </div>
        </div>
    );
}

export default Settings;