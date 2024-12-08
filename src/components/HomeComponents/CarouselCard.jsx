import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
} from "@material-tailwind/react";

export default function CarouselCard({ DriverInformation, isActive }) {
    const { name, jeepName, phoneNumber, address, forHire, imageUrl } = DriverInformation;
    const screenWidth = window.innerWidth;

    return (
        <Card
            color="transparent"
            shadow={false}
            className={`w-full  ${screenWidth > 500 ? "w-[33rem] px-10" : "w-[20rem] px-3"} ${isActive ? "opacity-100 z-[111] -translate-y-3 " : "opacity-75"} overflow-visible z-100   rounded-2xl bg-gradient-to-t from-blue-800 to-blue-500 select-none`}
        >
            <CardHeader
                color="transparent"
                floated={false}
                shadow={false}
                className="mx-0 flex items-center gap-4 pt-0 pb-1"
            >
                <Avatar
                    size={`${screenWidth > 500 ? "xxl" : "xl"}`}
                    variant="rounded"
                    src={imageUrl}
                    alt="avatar"
                    className="border-4"
                    withBorder={true}
                    color="white"
                />
                <div className="flex w-full flex-col">
                    <div className="flex items-center justify-between PlusJakartaSans-Bold">
                        <Typography variant="h5" className=" text-[17px] " color="white">
                            {name}
                        </Typography>
                    </div>
                    <Typography color="white" className="PlusJakartaSans-Medium leading-3 text-[12px]">Jeepney Driver</Typography>
                    <Typography color="white" className="PlusJakartaSans-Medium leading-3 text-[11px]">{forHire ? "For Hire" : "Not For Hire"}</Typography>
                </div>
            </CardHeader>
            <CardBody className="mb-6 p-0 text-balance text-white">
                <div className="flex flex-row place-items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>
                    <Typography className="PlusJakartaSans-Regular md:text-[15px] text-[12px]">{address}</Typography>
                </div>
                <div className="flex flex-row  place-items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    <Typography className="PlusJakartaSans-Regular md:text-[15px] text-[12px]">{phoneNumber}</Typography>
                </div>
                <div className="flex flex-row place-items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                    <Typography className="PlusJakartaSans-Regular md:text-[15px] text-[12px]">{jeepName}</Typography>
                </div>
            </CardBody>
        </Card>
    );
}
