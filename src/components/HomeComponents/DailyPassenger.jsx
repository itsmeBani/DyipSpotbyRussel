import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  LineController, // Import the LineController
} from "chart.js";
import React, { useEffect, useRef, useState } from "react";
import { getUserDocRefById } from "../../ReusableFunctions.js";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../api/firebase-config.js";
import useScroll from "../../CustomHooks/useScroll.jsx";

// Register the required components, including LineController
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController // Register the LineController
);

const DailyPassenger = ({PassengersData}) => {



    const screenWidth = window.innerWidth;

    const [activeLogsIndex, setActiveLogsIndex] = useState(0)

    const CurrentDate = new Date()
    const fullMonthName = new Intl.DateTimeFormat('en-US', {month: 'short'}).format(CurrentDate);
    const fullYear = CurrentDate.getFullYear().toString()
    const {isDragging, handleMouseDown, handleMouseUp, handleMouseMove} = useScroll();

    console.log(fullYear)
    const [duration, setDuration] = useState(null)
    const [activeMonth, setActiveMonth] = useState(fullMonthName);
    const [activeYear, setActiveYear] = useState(fullYear);
    const [PassengerCount, setPassengerCount] = useState([])
    const [refresh, setRefresh] = useState(false)
    const fetchDailyPassengers = async () => {

      try {
        const passengRef = await getUserDocRefById(PassengersData?.id, "drivers");
        const DailyPassenger = collection(db, 'drivers', passengRef?.id, "DailyPassenger");
        const orderedQuery = query(DailyPassenger, orderBy("Date", 'asc'));
        const querySnapshot = await getDocs(orderedQuery);
        const Data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const timeout = setTimeout(() => {
          setDuration(2000)

        }, 30);
        setPassengerCount(Data)
        setRefresh(false)
        return () => clearTimeout(timeout);


      } catch (e) {
        console.log(e)
      }
    };


    const groupByMonthYear = (records) => {
      return records.reduce((grouped, record) => {
        const dateParts = record.Date.split(' ');
        const month = months.indexOf(dateParts[0].slice(0, 3));
        const year = dateParts[2];
        if (!grouped[year]) {
          grouped[year] = {};
        }
        if (!grouped[year][months[month]]) {
          grouped[year][months[month]] = [];
        }
        grouped[year][months[month]].push(record);
        return grouped;
      }, {});
    };

    const filterRecords = (year, month) => {
      const groupedRecords = groupByMonthYear(PassengerCount);
      return groupedRecords[year] && groupedRecords[year][month] ? groupedRecords[year][month] : [];
    };

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const years = ['2024', '2025', '2026'];
    const filteredRecords = filterRecords(activeYear, activeMonth);
    const aggregatedData = filteredRecords.reduce((acc, record) => {
      const date = record.Date.split(' at ')[0];
      if (acc[date]) {
        acc[date].Passengers += record?.NoOfPassengers;
      } else {
        acc[date] = {Date: date, Passengers: record?.NoOfPassengers};
      }

      return acc;
    }, {});


    const result = Object.values(aggregatedData);

    console.log(result)
    // const PassengersDatas = result?.map((value, index, array) => {
    //   const [month, day, year] = value?.Date.split(/[\s,]+/);
    //   return (
    //       {
    //         day: index, value: value?.Passengers, dataPointLabelComponent: () =>
    //
    //             <View
    //                 style={{
    //                   elevation: 4,
    //                   backgroundColor: "white",
    //                   borderRadius: 100,
    //                   display: "flex",
    //                   alignItems: "center",
    //                   justifyContent: "center",
    //                   borderWidth: 1,
    //                   borderColor: "#3083FF"
    //                 }}
    //             >
    //               <Text style={{
    //                 color: '#3083FF',
    //                 fontSize: 10,
    //                 paddingHorizontal: 15,
    //
    //                 fontFamily: "PlusJakartaSans-Medium",
    //               }}>{value?.Passengers}</Text>
    //
    //             </View>, label: activeMonth + " " + day
    //       }
    //   )
    // })

    const scrollViewRef = useRef(null);

    const scrollToMonth = (index) => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({x: index * screenWidth, animated: true});

      }
    };

    useEffect(() => {
      setRefresh(true)
      fetchDailyPassengers().then();
      scrollToMonth(months.indexOf(activeMonth))
    }, [PassengersData]);



console.log(result)
    const hardcodedData = [
      { month: "Jan", passengers: 10 },
      { month: "Feb", passengers: 20 },
      { month: "Mar", passengers: 30 },
      { month: "Apr", passengers: 30 },
      { month: "May", passengers: 0 },
      { month: "Jun", passengers: 40 },
      { month: "Jul", passengers: 50 },
      { month: "Aug", passengers: 75 },
      { month: "Sep", passengers: 50 },
      { month: "Oct", passengers: 60 },
      { month: "Nov", passengers: 80 },
      { month: "Dec", passengers: 90 },
    ];
    const chartData = {
      labels: result.map(({Date}) => {
        const [month, day, year] =Date.split(/[\s,]+/);
        return activeMonth+" "+day
      }),
      datasets: [
        {
          label: "Passengers",

          backgroundColor: "rgba(48,131,255,0.4)",
          borderColor: "rgb(48,131,255)",
          fill: true,
          pointStyle: 'circle',
          data: result.map(({Passengers}) => Passengers),
          lineTension: 0.4

        },

      ],
    };
    return (



        <div className="flex h-full justify-between flex-col">
          <div
              className="px-2   flex w-full gap-1  overflow-x-hidden no-scrollbar "
              style={{cursor: isDragging ? 'grabbing' : 'grab'}}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseUp}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
          >
            {

              years.map((item, index) => {

                return (

                    <button key={index} onClick={() => {
                      setActiveYear(item)
                    }}
                            className={`whitespace-nowrap text-[12px] flex place-items-center border-2  border-[#3083FF] gap-1 shadow-md py-0 md:py-1 px-3 rounded-full  ${item === activeYear ? "text-white bg-[#3083FF]" : "text-[#3083FF]"}  "`}>
                      {/*{item?.icon}*/}
                      {item}
                    </button>
                )
              })
            }
          </div>
        <Chart type="line"  data={chartData} className="flex" options={chartData} />
          <div
              className="px-2 pb-1  grid grid-cols-5  md:grid-cols-9 w-full gap-1   overflow-x-hidden no-scrollbar "
              style={{cursor: isDragging ? 'grabbing' : 'grab'}}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseUp}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
          >
            {

              months.map((item, index) => {

                return (

                    <button key={index} onClick={() => {
                      setActiveMonth(item)
                    }}
                            className={`whitespace-nowrap text-[12px] flex place-items-center border-2  border-[#3083FF] gap-1 shadow-md py-0 px-3 rounded-full  ${item === activeMonth ? "text-white bg-[#3083FF]" : "text-[#3083FF]"}  "`}>
                      {/*{item?.icon}*/}
                      {item}
                    </button>
                )
              })
            }
          </div>

        </div>

    )
  }
  export default DailyPassenger;
