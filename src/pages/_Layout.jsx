import React from 'react'
import SidebarWithContentSeparator from "../components/JeepLogs.jsx";
import NavList, {ComplexNavbar} from "../components/Navbar.jsx";

import {NavLink, Outlet, useLocation} from "react-router-dom";
import BottomTabs from "../components/BottomTabs.jsx";

function _Layout() {
    const location = useLocation();

    return (
      <div className=" h-[100dvh]  w-full flex flex-row">
        
        <div className="w-full flex flex-col  ">

          <div className="   flex flex-col h-full  w-full ">
              <ComplexNavbar/>

                <div className={"h-full w-full relative"}>
                    <Outlet/>
                </div>
              {location.pathname !== "/settings" && <BottomTabs />}

          </div>

        </div>

      </div>
  )
}

export default _Layout