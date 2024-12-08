import React, {useEffect} from 'react';
import useReverseGeocoding from "../../CustomHooks/useReverseGeocoding.js";
import {
    Timeline, TimelineBody,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineItem,
    Typography
} from "@material-tailwind/react";
import {MapPinIcon} from "@heroicons/react/24/solid/index.js";

function AddressTimeline({Startpoint,Destination}) {
    const {setCoordinates:setStartCoordinates,Address:StartpointAddress}=useReverseGeocoding()

    const {setCoordinates:setEndCoordinates,Address:EndpointAddress}=useReverseGeocoding()

    useEffect(()=>{
        setStartCoordinates({ longitude: Startpoint?.longitude, latitude: Startpoint?.latitude });
        setEndCoordinates({ longitude: Destination?.longitude, latitude: Destination?.latitude });
    },[Startpoint,Destination])





    return (
        <Timeline className={"w-auto"}>
            <TimelineItem className="gap-0">
                <TimelineConnector />
                <TimelineHeader>
                    <TimelineIcon className="p-2  shadow-lg" color="blue" variant={"gradient"} >
                        <MapPinIcon  className="h-4 w-4" />
                    </TimelineIcon>
                    <Typography variant="h6" className="PlusJakartaSans-Medium" color="gray">
                        {   StartpointAddress?.data.features[0].properties?.context?.locality?.name +", "+
                            StartpointAddress?.data.features[0].properties?.context?.place?.name   +", "+
                            StartpointAddress?.data.features[0].properties?.context?.region?.name
                        }
                    </Typography>
                </TimelineHeader>
                <TimelineBody className="pb-0">
                    <Typography color="gary" className="font-normal PlusJakartaSans-Medium  leading-5 text-gray-600">
                        Start Point
                    </Typography>
                </TimelineBody>
            </TimelineItem>
            <TimelineItem className="gap-0">

                <TimelineHeader>
                    <TimelineIcon className="p-2  shadow-lg" color="blue" variant={"gradient"} >
                        <MapPinIcon  className="h-4 w-4" />
                    </TimelineIcon>
                    <Typography variant="h6" color="gray" className={"leading-5 PlusJakartaSans-Medium"}>
                        {   EndpointAddress?.data.features[0].properties?.context?.locality?.name +", "+
                            EndpointAddress?.data.features[0].properties?.context?.place?.name   +", "+
                            EndpointAddress?.data.features[0].properties?.context?.region?.name
                        }
                    </Typography>
                </TimelineHeader>
                <TimelineBody className="pb-0 PlusJakartaSans-Medium">
                    <Typography color="gray" className="font-normal  leading-5 text-gray-600">
                        Destination
                    </Typography>
                </TimelineBody>
            </TimelineItem>
        </Timeline>
    );
}

export default AddressTimeline;