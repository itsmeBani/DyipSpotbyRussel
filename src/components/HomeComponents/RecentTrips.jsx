import {

    ListItem,
    Card,
    Typography,
    TimelineItem,
    TimelineHeader,
    TimelineIcon,
    TimelineConnector, TimelineBody
} from "@material-tailwind/react";
import {useEffect, useState} from "react";
import Dates from "./Dates.jsx";
import {AutoSizer, List} from "react-virtualized";
import useReverseGeoCoding from "../../CustomHooks/useReverseGeocoding.js";

export default function RecentTrips({RecentTrips,getTableDataFromOneTable}) {

    const [recentTrips, setRecentTrips] = useState([]);
    const [date, setDate] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const fetchRecentTrips = async () => {
        setRefresh(true);
        if (!RecentTrips?.id) {
            return;
        }
        try {
            const {Data} = await getTableDataFromOneTable(RecentTrips?.id, "Trips", "date");
            setRecentTrips(Data);
            setRefresh(false);
        } catch (error) {
            console.error('Error fetching travel history:', error);
        }
    };

    useEffect(() => {
        fetchRecentTrips();
    }, [RecentTrips]);

    const filterRecentTrips = recentTrips?.filter(trip => {
        const tripDate = trip?.date?.seconds ? new Date(trip.date.seconds * 1000) : null;

        if (!tripDate) return false;
        if (!date) {
            return true;
        }
        const selectedDateWithoutTime = new Date(date.setHours(0, 0, 0, 0)) ;
        const tripDateWithoutTime = new Date(tripDate.setHours(0, 0, 0, 0));
        return selectedDateWithoutTime.getTime() === tripDateWithoutTime.getTime();
    });

    const RecentTripsData = filterRecentTrips?.map((trips, index) => {
        const TripslatestTimestamp = trips?.date?.seconds ? new Date(trips.date.seconds * 1000) : null;

        const formattedDatetrips = TripslatestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }).format(TripslatestTimestamp)
            : '';

        const formattedTime = TripslatestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(TripslatestTimestamp)
            : '';

        return {
            EndPointAddress: trips?.EndPointAddress,
            StartPointAddress: trips?.StartPointAddress,
            date: formattedDatetrips,
            key: trips?.id,
            time: formattedTime,
            id: index,
        };
    }) || [];


    const renderRow = ({index, style}) => {
        const item = RecentTripsData[index];

console.log(item)
        return (
            <div  style={style} className={` px-0 md:px-10  pb-3 h-full  justify-between  w-full flex-1 flex flex-row  ${RecentTripsData.length - 1 > index &&   " border-b-2"} gap-10`}>
                <div className=" ">
                    <Typography color="gray" className="PlusJakartaSans-Medium whitespace-nowrap">{item?.date}</Typography>
                    <Typography className="PlusJakartaSans-Medium text-sm">{item?.time}</Typography>
                </div>
                <div className=" w-full pt-2 pl-2">
                    <Typography color="blue" className="PlusJakartaSans-Medium text-[13px] md:text-[15px]">
                        {item?.StartPointAddress.Locality +", "+item?.StartPointAddress.PlaceName + ", "+item?.StartPointAddress?.Region}
                        </Typography>
                    <Typography className="PlusJakartaSans-Medium text-[14px]">Start Point</Typography>

                    <Typography color="blue" className="PlusJakartaSans-Medium text-[13px] md:text-[15px]">{
                        item?.EndPointAddress.Locality +", "+item?.EndPointAddress.PlaceName + ", "+item?.EndPointAddress?.Region
                    }</Typography>
                    <Typography className="PlusJakartaSans-Medium text-[14px]">End Point</Typography>
                </div>
            </div>

        );
    };
    return (

        <div className="h-full w-full   pr-2 ">
            <Dates date={date} setDate={setDate} />
            <div className="w-full flex h-full pb-[4rem]   ">

                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            height={height}
                            width={width}
                            rowCount={RecentTripsData.length}
                            rowHeight={160}
                            rowRenderer={renderRow}
                        />
                    )}
                </AutoSizer>
            </div>
        </div>



    )
}