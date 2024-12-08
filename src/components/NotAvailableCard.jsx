import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
  } from "@material-tailwind/react";
   
import  {ExclamationTriangleIcon} from   "@heroicons/react/24/solid"

  export default function NotAvailableCard({children}) {
    return (
      <Card shadow={false} className=" mb-5 bg-[rgba(30,63,174,0.12)] border border-[rgba(30,63,174,0.82)]">
        <CardHeader
          color="transparent"
          floated={false}
          shadow={false}
          className="mx-0 mt-0 p-4  flex items-center gap-4  "
        >
     <ExclamationTriangleIcon className="w-10" color={"rgba(30,63,174,0.82)"}/>
          <div className="flex w-full gap-0.5">
            <div className="flex flex-col  justify-between">
              <Typography variant="h6" color="blue-gray" className="text-left opacity-80 leading-5 PlusJakartaSans-Bold">
                Not Available
              </Typography>
                <Typography className="PlusJakartaSans-Medium blue leading-5 opacity-90" >
                    This feature is currently unavailable on the web version. Please try accessing it from our mobile app for the full experience
                </Typography>
            </div>
          </div>
        </CardHeader>


      <div className="px-3 md:px-10 pb-4 md-pb-10  flex">
          {children}
      </div>
      </Card>
    );
  }