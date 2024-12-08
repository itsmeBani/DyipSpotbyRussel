import React, {useContext} from 'react';
import {Typography} from "@material-tailwind/react";
import layer1 from  "../../assets/layer1.png";
import layer2 from  "../../assets/layer2.jpg";
import {CurrentUserContext} from "../../ContextProvider/CurrentUser.jsx";

function Mapstyle(props) {
const {mapStyle,refreshMapstyle,setRefreshMapStyle}=useContext(CurrentUserContext)
    const HandleSetMapStyle = (styleUrl) => {
        // Save the selected map style URL to localStorage
        localStorage.setItem('mapStyle', styleUrl);
        setRefreshMapStyle(!refreshMapstyle)
    }
const activeMapStyle = (styleUrl)=>{
    return mapStyle === styleUrl  ?"border-4 border-[#3083FF]" : ""
}






    return (
        <div className="flex mt-2 flex-col">
            <Typography variant="h5" color="blue-gray" className="PlusJakartaSans-Bold"> Map Style </Typography>

            <div className="flex gap-2 mt-2">
                <div  onClick={() => HandleSetMapStyle("mapbox://styles/mapbox/standard")}>
                    <img src={layer1} alt="Layer 1" className={`w-[100px]  ${activeMapStyle("mapbox://styles/mapbox/standard")} rounded-2xl  h-[100px]`} />
                </div>
                <div onClick={() => HandleSetMapStyle("mapbox://styles/mapbox/standard-satellite")}>
                    <img src={layer2} alt="Layer 2" className={`w-[100px]  ${activeMapStyle("mapbox://styles/mapbox/standard-satellite")} rounded-2xl  h-[100px]`} />
                </div>
            </div>
        </div>
    );
}

export default Mapstyle;
