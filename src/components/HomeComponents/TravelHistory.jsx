import {
    Timeline,
    TimelineItem,
    TimelineConnector,
    TimelineHeader,
    TimelineIcon,
    TimelineBody,
    Typography,
} from "@material-tailwind/react";
import {HomeIcon, BellIcon, CurrencyDollarIcon, MapPinIcon} from "@heroicons/react/24/solid";

import {useEffect, useState} from "react";
import Dates from '/src/components/HomeComponents/Dates.jsx'
import {AutoSizer, List} from "react-virtualized";

export function TravelHistory({DriverInformation, getTableDataFromOneTable}) {
const screenWidth=window.innerWidth

    const [travelHistory, setTravelHistory] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const [date, setDate] = useState(null);
    const fetchTravelHistory = async () => {
        setRefreshing(true);
        if (!DriverInformation?.id) {
            setRefreshing(false);
            return;
        }

        try {

            const {Data} = await getTableDataFromOneTable(DriverInformation?.id, "travelHistory", "Date");
            const TestfilterTravelHistory = Data?.filter((history, index, self) => {
                const tripDate = history?.Date?.seconds ? new Date(history.Date.seconds * 1000) : null;
                if (!tripDate) return false;
                const tripDateWithoutTime = new Date(tripDate);
                tripDateWithoutTime.setHours(0, 0, 0, 0);
                const tripIdentifier = `${history.address}_${tripDateWithoutTime.getTime()}`;
                return self.findIndex(t => {
                    const tDate = t?.Date?.seconds ? new Date(t.Date.seconds * 1000) : null;
                    if (!tDate) return false;
                    const tDateWithoutTime = new Date(tDate);
                    tDateWithoutTime.setHours(0, 0, 0, 0);
                    return `${t.address}_${tDateWithoutTime.getTime()}` === tripIdentifier;
                }) === index;
            });

            setTravelHistory(TestfilterTravelHistory);
            setRefreshing(false);
        } catch (error) {
            console.error('Error fetching travel history:', error);
            setRefreshing(false); // Reset refreshing state in case of error
        }
    };


    useEffect(() => {
        fetchTravelHistory().then()
    }, [DriverInformation]);


    const filterTravelHistory = travelHistory?.filter(history => {
        const tripDate = history?.Date?.seconds ? new Date(history.Date.seconds * 1000) : null;

        if (!tripDate) return false;
        if (!date) {
            return true;
        }
        const selectedDateWithoutTime = new Date(date.setHours(0, 0, 0, 0));
        const tripDateWithoutTime = new Date(tripDate.setHours(0, 0, 0, 0));
        return selectedDateWithoutTime.getTime() === tripDateWithoutTime.getTime();
    });


    const TravelHistoryList = filterTravelHistory?.map((driver) => {
        const latestTimestamp = driver?.Date?.seconds ? new Date(driver.Date.seconds * 1000) : null;
        const formattedDate = latestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }).format(latestTimestamp)
            : '';
        const formattedTime = latestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(latestTimestamp)
            : '';
        return (
            {
                time: formattedTime,
                title: driver?.address || driver?.LocalityName,
                description: formattedDate,
                key: driver?.id && driver?.id
            })
    }) || []


    const renderRow = ({index, style}) => {
        const item = TravelHistoryList[index];

        return (

            <TimelineItem style={style} className="gap-0">
                <TimelineHeader>

                    <TimelineIcon className="p-2 bg-[#3083FF]">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                    </TimelineIcon>
                    <Typography color="gray" className="font-normal  text-[13px] md:text-[15px] PlusJakartaSans-Medium text-gray-600">
                        {item.title}
                    </Typography>
                </TimelineHeader>


                {  TravelHistoryList.length - 1 > index &&
                    <TimelineConnector/>
                }
                <TimelineBody className={"shadow-none "}>
                    <Typography color="gray" className="font-normal text-[13px] md:text-[15px] PlusJakartaSans-Bold text-gray-600">
                        {item?.time}
                    </Typography>
                    <Typography color="gray" className="font-normal text-[13px] md:text-[15px] PlusJakartaSans-Medium text-gray-600">
                        {item?.description}
                    </Typography>
                </TimelineBody>
            </TimelineItem>

        );
    };

    return (

        <div className="h-full w-full   pr-2 ">
            <Dates date={date} setDate={setDate}/>
            <div className="w-full flex h-full pb-[4rem]   ">

                <AutoSizer>
                    {({height, width}) => (
                        <List
                            height={height}
                            width={width}
                            rowCount={TravelHistoryList.length}
                            rowHeight={screenWidth < 600 ? 80 : 100}
                            rowRenderer={renderRow}
                        />
                    )}
                </AutoSizer>
            </div>
        </div>
    );
}