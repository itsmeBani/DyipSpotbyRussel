import React, {useState} from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
    Button, TabPanel, TabsBody, TabsHeader, Tabs, Tab, Dialog,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    PowerIcon, CalendarDateRangeIcon,
} from "@heroicons/react/24/solid";
import useScroll from "../../CustomHooks/useScroll.jsx";
import {DayPicker} from "react-day-picker";
import "react-day-picker/style.css";


export default function Dates({isActive,date,setDate}) {
    const {isDragging, handleMouseDown, handleMouseUp, handleMouseMove} = useScroll();


    const [activeLogsIndex, setActiveLogsIndex] = useState(0)
    const [open, setOpen] = useState(false);





    const TabName =
        [{
            id: 0,
            name: "All",
            event: ()=>setDate(null)


           },
            {
                id: 1,
                name: "Today",
                event: ()=>setDate(new Date)

            }, {
                id: 2,
                name: date ? date.toLocaleDateString() : 'Select a date',
            event: ()=>setOpen(true),
            icon:<CalendarDateRangeIcon className={`h-5 w-5 ${2=== activeLogsIndex ? "text-white " : "text-[#3083FF]"}  `}/>
            }
]


    const HandleSetActiveLogs = (index,event) => {
        setActiveLogsIndex(index)
        event()

    }
    const handleOpen = () => setOpen(!open);

    const [selected, setSelected] = useState();

    return (
        <Card
            className={`  shadow-none  select-none rounded-none  gap-1 flex w-full    `}>
            <div
                className="px-3 pb-3 flex w-full gap-2 h-auto overflow-x-hidden no-scrollbar "
                style={{cursor: isDragging ? 'grabbing' : 'grab'}}
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
            >
              {

                TabName.map((item,index)=>{

                  return (

                      <button key={index} onClick={() => {
                        HandleSetActiveLogs(item?.id,item?.event)
                      }} className={`whitespace-nowrap flex place-items-center text-[12px] border-2  border-[#3083FF] gap-1 shadow-md py-1 px-3 rounded-full  ${item?.id === activeLogsIndex ? "text-white bg-[#3083FF]" : "text-[#3083FF]"}  "`}>
                          {item?.icon}
                          {item?.name}
                      </button>
                  )
                })
              }
            </div>

            <Dialog open={open} className={"bg-transparent shadow-none"} handler={handleOpen}>
             <div className="flex  place-items-center    justify-center">
            <div className={"bg-white p-10 rounded-2xl"}>
                <DayPicker
                    captionLayout="dropdown"
                    defaultMonth={new Date()}
                    startMonth={new Date(2024, 6)}
                    endMonth={new Date(2025, 9)}
                    mode="single"

                    selected={selected}
                    onSelect={(e)=>{
                        setDate(e)
                        setOpen(false)
                    }}
                />
              <div className="flex w-full justify-end">
                  <Button variant={"outlined"} onClick={()=>setOpen(false)} className="PlusJakartaSans-Medium" color={"blue"}>Cancel</Button>
              </div>
            </div>

             </div>
            </Dialog>
        </Card>
    );
}
