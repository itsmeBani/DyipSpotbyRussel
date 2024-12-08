import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Typography } from '@material-tailwind/react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../api/firebase-config.js';
import useFetchDriversOnce from '../../CustomHooks/useFetchDriversOnce.js';
import { getUserDocRefById } from '../../ReusableFunctions.js';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MostActiveJeeps() {
    const { LocationData, loading, error, setRefresh, refresh } = useFetchDriversOnce();
    const [date, setDate] = useState(null);
    const [data, setData] = useState([]);
    const [activecardId, setActivecardId] = useState();
    const [travelHistoryCount, setTravelHistoryCount] = useState([]);
    const [maxValueTrips, setMaxValueTrips] = useState(60);
    const [maxValueTravel, setMaxValueTravel] = useState(60);

    const getTableDataFromOneDriver = async (id, tableName, orderByField) => {
        const ref = await getUserDocRefById(id, 'drivers');
        const travelHistoryRef = collection(db, 'drivers', ref?.id, tableName);
        const orderedQuery = query(travelHistoryRef, orderBy(orderByField, 'desc'));
        const querySnapshot = await getDocs(orderedQuery);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const countDataFromTables = async (jeepId, tableName, orderByField) => {
        try {
            const data = await getTableDataFromOneDriver(jeepId, tableName, orderByField);
            return data;
        } catch (e) {
            console.error(e);
        }
    };

    const fetchTripsAndTravelHistory = async () => {
        if (!LocationData) return;



        const tripsData = await Promise.all(LocationData.map(async (driver) => {
            const tripsCount = await countDataFromTables(driver?.id, 'Trips', 'date');
            const travelHistory = await countDataFromTables(driver?.id, 'travelHistory', 'Date');
            return {
                value: tripsCount.length,
                id: driver?.id,
                name: driver?.name,
                travelCount: travelHistory.length,
                imageUrl: driver?.imageUrl,
                label: driver?.jeepName,
                jeepImages: driver?.jeepImages[0],
            };
        }));

        setMaxValueTrips(Math.max(...tripsData.map(item => item.value)));
        setData(tripsData);

        const travelHistoryData = await Promise.all(LocationData.map(async (driver) => {
            const travelHistoryCount = await countDataFromTables(driver?.id, 'travelHistory', 'Date');
            return {
                travelCount: travelHistoryCount.length,
                label: driver?.jeepName,
            };
        }));

        setMaxValueTravel(Math.max(...travelHistoryData.map(item => item.travelCount)));
        setTravelHistoryCount(travelHistoryData);

    };

    useEffect(() => {
        fetchTripsAndTravelHistory();
    }, [LocationData]);

    const tripsChartData = {
        labels: data?.map(({ label }) => label),
        datasets: [
            {
                label: 'Trips',
                data: data?.map(({ value }) => value),
                backgroundColor: '#3083FF',
                borderColor: '#3083FF',
                borderWidth: 1,
                maxLength: 100,
            },
        ],
    };

    const travelHistoryChartData = {
        labels: travelHistoryCount?.map(({ label }) => label),
        datasets: [
            {
                label: 'Travel History',
                data: travelHistoryCount?.map(({ travelCount }) => travelCount),
                backgroundColor: '#7677ff',
                borderColor: '#7677ff',
                borderWidth: 1,
                maxLength: 100,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: '#3083FF',
                    font: {
                        family: 'PlusJakartaSans-Medium',
                        size: 12,
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#3083FF',
                    font: {
                        family: 'PlusJakartaSans-Medium',
                        size: 12,
                    },
                },
            },
        },
        responsive: true,
    };

    const chartOptions2 = {
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: ${context.raw}`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    color: '#7677FF',
                    font: {
                        family: 'PlusJakartaSans-Medium',
                        size: 11.5,
                    },
                },
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: '#7677FF',
                    font: {
                        family: 'PlusJakartaSans-Medium',
                        size: 11.5,
                    },
                },
            },
        },
        responsive: true,
    };

    return (
        <div className="flex flex-col h-full ">
            <div className="px-5 md:px-20 pt-5 flex   overflow-scroll no-scrollbar grid-cols-1 md:grid-cols-2 grid-rows-1 gap-3">
                <div className="p-3 md:p-10 w-[500px] md:w-full bg-[rgb(214,234,252)] rounded-2xl">
                    <Typography variant={"h5"} className={"PlusJakartaSans-Bold text-[#3083FF]"}>Trips</Typography>
                    <Typography variant={"paragraph"} className="text-[#3083FF] PlusJakartaSans-Medium pb-5">
                        Visualization of vehicle trips shows total trips
                    </Typography>
                    <Bar data={tripsChartData} className={"flex"} options={chartOptions} />
                </div>

                <div className="p-3 w-[500px] md:w-full bg-[#E4E1FE] rounded-2xl">
                    <Typography variant={"h5"} className={"PlusJakartaSans-Bold text-[#7677ff]"}>Travel History</Typography>
                    <Typography variant={"paragraph"} className="text-[#7677ff] PlusJakartaSans-Medium pb-5">
                        Travel history shows the count of places the jeep has visited.
                    </Typography>
                    <Bar data={travelHistoryChartData} className={"flex"} options={chartOptions2} />
                </div>
            </div>

            <div className="grid grid-cols-auto h-[100px] md:grid-cols-4 p-10 pt-3 gap-1">
                {data &&
                    data
                        .sort((a, b) => {
                            const sumA = (a.value || 0) + (a.travelCount || 0);
                            const sumB = (b.value || 0) + (b.travelCount || 0);
                            return sumB - sumA;
                        })
                        .map((jeep, index) => {
                            return (
                                <div
                                    key={jeep.id}
                                    onClick={() => setActivecardId(jeep.id)}
                                    style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        padding: "10px",
                                        backgroundColor: activecardId === jeep.id ? "#3083FF" : "white",
                                        borderRadius: "10px",
                                        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                        cursor: "pointer",
                                        gap: "10px",
                                    }}
                                >
                                    <div
                                        style={{
                                            height: "50px",
                                            width: "50px",
                                            backgroundColor: "grey",
                                            borderRadius: "10px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            src={jeep.jeepImages}
                                            alt="Jeep"
                                            style={{ height: "100%", width: "100%", objectFit: "cover" }}
                                        />
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "row", gap: "10px", alignItems: "center" }}>
                                        <div className="flex flex-col justify-between place-items-center">
                                            <p
                                                style={{
                                                    color: activecardId === jeep.id ? "white" : "#605f5f",
                                                    margin: 0,
                                                }}
                                            >
                                                Total Trips
                                            </p>
                                            <p className="PlusJakartaSans-Bold text-[24px]"
                                               style={{
                                                   color: activecardId === jeep.id ? "white" : "#3083FF",
                                                   margin: 0,
                                                   fontWeight: "bold",
                                               }}
                                            >
                                                {jeep.value}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                height: "90%",
                                                width: "2px",
                                                backgroundColor: activecardId === jeep.id ? "white" : "#605f5f",
                                                borderRadius: "100px",
                                                opacity: 0.3,
                                            }}
                                        />
                                        <div className="flex flex-col justify-between place-items-center">
                                            <p className="PlusJakartaSans-Medium"
                                               style={{
                                                   color: activecardId === jeep.id ? "white" : "#605f5f",
                                                   margin: 0,
                                               }}
                                            >
                                                Travels
                                            </p>
                                            <p className="PlusJakartaSans-Bold text-[24px]"
                                               style={{
                                                   color: activecardId === jeep.id ? "white" : "#3083FF",
                                                   margin: 0,
                                                   fontWeight: "bold",
                                               }}
                                            >
                                                {jeep.travelCount}
                                            </p>
                                        </div>
                                        <div
                                            style={{
                                                height: "90%",
                                                width: "2px",
                                                backgroundColor: activecardId === jeep.id ? "white" : "#605f5f",
                                                borderRadius: "100px",
                                                opacity: 0.3,
                                            }}
                                        />
                                        <div className="flex flex-col justify-between place-items-center">
                                            <p className="PlusJakartaSans-Medium"
                                               style={{
                                                   color: activecardId === jeep.id ? "white" : "#605f5f",
                                                   margin: 0,
                                               }}
                                            >
                                                Top
                                            </p>
                                            <p className="PlusJakartaSans-Bold text-[24px]"
                                               style={{
                                                   color: activecardId === jeep.id ? "white" : "#3083FF",
                                                   margin: 0,
                                                   fontWeight: "bold",
                                               }}
                                            >
                                                {index + 1}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
            </div>
        </div>
    );
}

export default MostActiveJeeps;
