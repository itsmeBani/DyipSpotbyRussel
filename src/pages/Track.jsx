import {ComplexNavbar} from "../components/Navbar";
import pin from "../assets/pin3.png"

import RenderMap from "../components/Map"
import RenderJeeps from "../components/TrackComponents/RenderJeeps.jsx";
import CategoryButtons from "../components/TrackComponents/CategoryButtons.jsx";
import JeepStatus, {JeepSatatusContext} from "../ContextProvider/JeepStatus.jsx";
import {useContext} from "react";
import {useCookies} from "react-cookie";
import CryptoJS from "crypto-js";
import useCheckRole from "../CustomHooks/useCheckRole.js";
import SetDestinationButton from "../components/DriverComponent/SetDestinationButton.jsx";
import _LayoutDriver from "../components/DriverComponent/_LayoutDriver.jsx";
import {SetStatus} from "../components/DriverComponent/SetStatus.jsx";
import BottomTabs from "../components/BottomTabs.jsx";
function Track() {
    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;

    const {mapRef, FallowDriver,activeJeepId,JeepStatusMoadal,setJeepStatusModal,setActiveJeepId,openBottomSheet, setOpenBottomSheet} = useContext(JeepSatatusContext)
    const decryptedRole = useCheckRole('role', encryptionKey);

    return (

      <JeepStatus>
          <div style={{userSelect: 'none'}} className=" flex   overflow-hidden h-full  w-full">

              <RenderMap/>


              <div className="absolute w-full bottom-2 ">
                  <SetStatus/>
                  {decryptedRole === "passenger"?<RenderJeeps/>:<_LayoutDriver/>}

              </div>

              <div className="absolute  pt-2 w-full top ">

                  <CategoryButtons/>

              </div>

          </div>

      </JeepStatus>
    );
}

export default Track;
