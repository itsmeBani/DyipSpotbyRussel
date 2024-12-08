import React from 'react';
import NearbyPassenger from "./NearbyPassenger.jsx";
import SetDestinationButton from "./SetDestinationButton.jsx";
import {SetStatus} from "./SetStatus.jsx";
import {Drawer} from "@material-tailwind/react";

function _LayoutDriver(props) {
    return (
        <div className="w-full px-5 pb-3  relative flex justify-end">

          <div className="flex gap-4 pr-2">
              <NearbyPassenger/>
              <SetDestinationButton/>
          </div>

           <SetStatus/>

        </div>
    );
}

export default _LayoutDriver;
