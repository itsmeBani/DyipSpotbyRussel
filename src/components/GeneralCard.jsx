import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
 } from '@material-tailwind/react';
import {signOut} from "firebase/auth";
import {auth} from "../api/firebase-config.js";
import {useCookies} from "react-cookie";
import {PowerIcon} from "@heroicons/react/24/solid";
export default function GeneralCard() {
    const [cookies, setCookie, removeCookie] = useCookies(['authentication-token']);

    const Logout=async ()=>{
        try {
            await signOut(auth)
            removeCookie('authentication-token')
            removeCookie('role')
        }catch (e) {}
    }
  return (
    <div color="transparent"  className="flex place-items-start mt-5">
    <CardBody className="mb-6 p-0 ">
        <Typography variant="h5" color="blue-gray" className="PlusJakartaSans-Bold"> General </Typography>
            <div onClick={Logout} className="flex px-5 py-2 rounded-lg flex-row gap-1 mt-3 ml-0 hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"  >
               <PowerIcon className="`h-5 w-5 text-red-500"/>
                    <Typography className='text-red-700 place-items-start PlusJakartaSans-Medium'>Log Out</Typography>
            </div>
    </CardBody>
    </div>
  )
}
