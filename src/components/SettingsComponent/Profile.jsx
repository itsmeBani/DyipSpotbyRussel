import {CardBody, Drawer, Spinner, Typography} from "@material-tailwind/react";
import {PowerIcon} from "@heroicons/react/24/solid/index.js";

import React, {useContext, useState} from 'react';
import {PencilIcon, PencilSquareIcon} from "@heroicons/react/16/solid/index.js";
import DynamicForm from "../TrackComponents/Form.jsx";
import {getUserDocRefById} from "../../ReusableFunctions.js";
import {getDoc} from "firebase/firestore";
import {CurrentUserContext} from "../../ContextProvider/CurrentUser.jsx";

function EditProfile() {
    const [open, setOpen] = React.useState(false);
    const {CurrentUser}=useContext(CurrentUserContext)
    const handleOpen = () => setOpen((cur) => !cur);
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    const [isLoading, setLoading] = useState(false)
    const [Applicant, setApplicant] = useState(null); // State to hold fetched user data

    const [DriverInformation,setDriverInformation]=useState(null)

    const OpenEditProfileBottomSheet = async () => {
        setLoading(true)
        try {

            const CurrentUserdocRef = await getUserDocRefById(CurrentUser.providerData[0].uid, "drivers");
            if (CurrentUserdocRef) {
                const userDocSnap = await getDoc(CurrentUserdocRef);
                if (userDocSnap.exists()) {
                    setDriverInformation(userDocSnap.data());
                    setLoading(false)
                    setOpen((cur) => !cur);

                }
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setLoading(false)
        }


    }
    return (
        <div  color="transparent" className="flex place-items-start ">
            <CardBody onClick={OpenEditProfileBottomSheet} className="mb-1 p-0 flex flex-col ">
                <Typography variant="h5" color="blue-gray" className="PlusJakartaSans-Bold"> Profile </Typography>
                <div className="flex place-items-center group hover:cursor-pointer ml-2 mt-2">
                    <PencilSquareIcon className={"h-8 w-8 text-gray-800 group-hover:text-blue-700"}/>
                    <Typography variant={"paragraph"} className="PlusJakartaSans-Medium flex gap-2 ml-2 group-hover:text-blue-600">
                        Personal Information
                        {isLoading &&     <Spinner color={"blue"}/>}
                    </Typography>
                </div>
            </CardBody>
            <Drawer
                placement={screenWidth > 680 ? "right" : "bottom"}
                size={screenWidth > 680 ? screenHeight/1.8 : screenHeight/1.2}

                open={open} handleOpen={handleOpen}
                overlay={false}
                className="px-4 py-10  border-t-2  no-scrollbar rounded-t-[20px] overflow-y-scroll  px-10 "
            >
            <DynamicForm open={open} setOpen={setOpen} data={DriverInformation}
                         action={"update"}/>
            </Drawer>
        </div>
    );
}

export default EditProfile;