import {
    Tooltip,
    IconButton,
    SpeedDialHandler,
    SpeedDialAction,
    SpeedDialContent,
    SpeedDial, Typography, Spinner
} from "@material-tailwind/react";

import {PlusIcon} from "@heroicons/react/16/solid/index.js";
import {CogIcon, HomeIcon, Square3Stack3DIcon} from "@heroicons/react/24/solid";
import {useContext, useEffect, useState} from "react";
import {CurrentUserContext} from "../../ContextProvider/CurrentUser.jsx";
import useFetchDriversOnce from "../../CustomHooks/useFetchDriversOnce.js";
import {getDoc, updateDoc} from "firebase/firestore";
import {getUserDocRefById} from "../../ReusableFunctions.js";
import useCheckRole from "../../CustomHooks/useCheckRole.js";

export function SetStatus() {
    const [open, setOpen] = useState(false);




    const {CurrentUser} = useContext(CurrentUserContext)
    const [isVisible, setIsVisible] =useState(false);
    const [loading, setloading] = useState(false)
    const  [refresh,setRefresh] = useState(false)
    const {setrefresh,refresh:refreshjeeps} = useFetchDriversOnce();
    const [currentStatus, setCurrentStatus] =useState(null)
    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const decryptedRole = useCheckRole('role', encryptionKey);



    const setStatus = async (status) => {

        const UserStatus = {
            status: status
        };

        if (decryptedRole === "driver" && status === "offline"){
            UserStatus.endpoint = {}
            UserStatus.startpoint ={}
        }

        setloading(true)
        const CurrentUserdocRef = await getUserDocRefById(CurrentUser?.providerData[0]?.uid, decryptedRole === "passenger" ? "users" : "drivers");

        try {
            await updateDoc(CurrentUserdocRef, UserStatus);

            setIsVisible(false)
            setRefresh(!refresh)
            setloading(false)
            setrefresh(!refreshjeeps)
        } catch (e) {


        }

    }
    useEffect(() => {
        const getStatus = async () => {
            setloading(true)
            try {

                const CurrentUserdocRef = await getUserDocRefById(CurrentUser.providerData[0].uid, decryptedRole === "passenger" ? "users" : "drivers");
                if (CurrentUserdocRef) {
                    const userDocSnap = await getDoc(CurrentUserdocRef);
                    if (userDocSnap.exists()) {
                        setCurrentStatus(userDocSnap.data().status);
                        setloading(false)
                    }
                }
            } catch (err) {
                console.error('Error fetching user data:', err);


            }
        };
      if (CurrentUser?.providerData[0]?.uid){

          getStatus().then();
      }
    }, [refresh,CurrentUser]);




const activerColor = currentStatus === "online" ? "bg-[rgba(52,199,89,0.64)]"  : currentStatus === "waiting"?  "bg-[rgba(255,204,0,0.67)]" :"bg-[rgba(255,59,48,0.74)]"
    return (

        <div className="right-10 -top-5 absolute w-[100px] h bg-black ">
            <div className="absolute bottom-0 right-0 ">
                <SpeedDial open={open} handler={setOpen} color={"blue"}>
                    <SpeedDialHandler>
                        <IconButton size="lg" className="rounded-full md:scale-100 scale-75 bg-white ">
                            <div className="flex place-items-center justify-center  ">
                              <span className="relative flex ">
                              <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${activerColor} opacity-75`}></span>
                                <span className={`relative inline-flex h-9 w-9 rounded-full  ${activerColor}`} ></span></span>

                                {loading &&   <Spinner color="gray" className={"absolute h-5 w-4"}/>}
                            </div>
                        </IconButton>
                    </SpeedDialHandler>
                    <SpeedDialContent  className=" p-0 gap-0 w-[100px]">
                        <SpeedDialAction onClick={()=>setStatus("online")} className="flex scale-90 flex-row gap-3  px-2 pl-2">
                            <div className={"h-[30px] w-[30px] bg-green-600 rounded-full "}/>
                            <Typography color={"gray"} className="PlusJakartaSans-Medium text-sm"> Online</Typography>
                        </SpeedDialAction>
                        <SpeedDialAction onClick={()=>setStatus("waiting")} className="flex scale-90 flex-row gap-2 px-2 pl-2">
                            <div className={"h-[30px] w-[30px] bg-yellow-600 rounded-full p-1"}/>
                            <Typography color={"gray"} className="PlusJakartaSans-Medium text-sm">Waiting</Typography>
                        </SpeedDialAction>
                        {decryptedRole === "driver"
                                 &&    <SpeedDialAction onClick={()=>setStatus("offline")} className="flex scale-90 flex-row gap-2 px-2 pl-2">
                                <div className={"h-[30px] w-[30px] bg-red-600 rounded-full p-1"}/>
                                <Typography color={"gray"} className="PlusJakartaSans-Medium text-sm">Offline</Typography>
                            </SpeedDialAction>
                        }
                    </SpeedDialContent>
                </SpeedDial>
            </div>
        </div>

    );
}