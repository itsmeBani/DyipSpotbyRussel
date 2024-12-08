import React from "react";
import {Avatar, Drawer, IconButton} from "@material-tailwind/react";
import {
    Button,
    Dialog,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Input,
    Checkbox,
} from "@material-tailwind/react";
import DynamicForm from "./TrackComponents/Form.jsx";
import {XMarkIcon} from "@heroicons/react/24/outline/index.js";

export default function ApplyModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    return (
        <>
            <Button onClick={handleOpen}
                    ripple={false}

                    className="mt-4 md:mt-0 w-full md:w-auto PlusJakartaSans-Bold whitespace-nowrap px-20 overflow-hidden rounded-full relative shadow-2xl  bg-white text-blue-500  flex items-center justify-center"
            >Apply Now!
                <img src="/src/assets/dyipcropted.png" alt="Jeep icon" className="h-full -right-3 mr-2 absolute"/>
            </Button>


            <Drawer
                placement={screenWidth > 680 ? "right" : "bottom"}
                size={screenWidth > 680 ? screenHeight/1.8 : screenHeight/1.2}

                open={open} handleOpen={handleOpen}
                overlay={false}
                className="px-4 py-10  border-t-2  no-scrollbar rounded-t-[20px] overflow-y-scroll  px-10 "
            >


                <DynamicForm open={open} setOpen={setOpen} data={null}
                             action={"add"}/>

            </Drawer>
        </>
    );
}