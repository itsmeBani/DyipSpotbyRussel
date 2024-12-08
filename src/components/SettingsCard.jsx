import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
  } from "@material-tailwind/react";
import {useContext} from "react";
import {CurrentUserContext} from "../ContextProvider/CurrentUser.jsx";
import useCheckRole from "../CustomHooks/useCheckRole.js";

   
  function StarIcon() {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5 text-yellow-700"
      >
        <path
          fillRule="evenodd"
          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
          clipRule="evenodd"
        />
      </svg>
    );
  }
   
  export default function SettingsCard() {
      const {CurrentUser}=useContext(CurrentUserContext)
      const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
      const decryptedRole = useCheckRole('role', encryptionKey);

      console.log(CurrentUser)
      return (
      <div   className=" flex ">
        <div
          color="transparent"
          className="flex flex-row items-center gap-5 md:gap-8 "
        >
        <div    >

            <img

                className={"w-[7rem] md:w-[24rem] rounded-full"}
                src={CurrentUser?.photoURL}
                alt="tania andrew"
            />
        </div>

          <div className="flex w-full flex-col ">
            <div className="flex w-full">
              <Typography variant="h5" color="black" className="PlusJakartaSans-Bold">
                  {CurrentUser?.displayName}
              </Typography>
            </div>
            <Typography variant="large" color="blue-gray" className="PlusJakartaSans-Medium">{CurrentUser?.email}</Typography>
            
            <Typography variant="large" color="blue-gray" className="PlusJakartaSans-Medium capitalize">{decryptedRole}</Typography>
          </div>
        </div>
      </div>
    );
  }