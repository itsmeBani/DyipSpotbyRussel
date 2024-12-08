import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import CarouselCard from './CarouselCard';
import useFetchJeeps from "../../CustomHooks/useFetchJeeps.js";
import JeepLogs from "../JeepLogs.jsx";
import {getUserDocRefById} from "../../ReusableFunctions.js";
import {collection, getDocs, query, orderBy} from "firebase/firestore";
import {db} from "../../api/firebase-config.js";

export default () => {

    const {LocationData, loading, error, setrefresh, refresh} = useFetchJeeps()
    const screenWidth = window.innerWidth;

    const mappedDrivers = LocationData?.map((driver) => ({
        id: driver?.id,
        name: driver?.name,
        latitude: driver?.latitude,
        longitude: driver?.longitude,
        status: driver?.status,
        address: driver?.address,
        imageUrl: driver?.imageUrl,
        speed: driver?.speed,
        jeepName: driver?.jeepName,
        heading: driver?.heading,
        forHire: driver?.forHire,
        estimatedArrival: driver?.estimatedarrivaltime,
        passengers: driver?.passengers,
        phoneNumber: driver?.phoneNumber,
        JeepImages: driver?.jeepImages,
    })) || []

    async function getTableDataFromOneTable(id, tableNAME, OrderBy) {
        const DriverDocRef = await getUserDocRefById(id, "drivers");
        const travelHistoryRef = collection(db, 'drivers', DriverDocRef?.id, tableNAME);
        const orderedQuery = query(travelHistoryRef, orderBy(OrderBy, 'desc'));
        const querySnapshot = await getDocs(orderedQuery);
        const Data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        return {Data}
    }

    return (
        <Swiper
            effect={'coverflow'}
            grabCursor={true}
            loop={true}
            centeredSlides={true}
            touchMoveStopPropagation={true}
            slidesPerView={'auto'}
            spaceBetween={15}
            coverflowEffect={{
                rotate: 30,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: true,
            }}
            onSlideChange={(swiper) => console.log(swiper)}

            className='py-2 md:py-5 px-1 md:px-10 w-full h-full '
        >
            {mappedDrivers.map((DriverInformation, index) => {
                return (

                    <SwiperSlide key={DriverInformation.id} className="h-full w-full -z-50 pt-5 ">
                        {({isActive}) => (
                            <div className='h-full flex flex-col w-full  '>
                                <CarouselCard isActive={isActive} DriverInformation={DriverInformation}/>
                                <div className=' relative  h-full'>
                                    <JeepLogs getTableDataFromOneTable={getTableDataFromOneTable}
                                              DriverInformation={DriverInformation} sActive={isActive}/>
                                </div>
                            </div>
                        )}


                    </SwiperSlide>

                )

            })

            }


        </Swiper>
    );
};