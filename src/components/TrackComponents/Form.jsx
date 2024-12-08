import React, {useContext, useRef, useState} from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogBody, DialogFooter,
    DialogHeader,
    IconButton,
    Input,
    Radio, Spinner,
    Typography
} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/outline/index.js";

import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';

import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {getUserDocRefById} from "../../ReusableFunctions.js";
import {addDoc, collection, serverTimestamp, updateDoc} from "firebase/firestore";
import useFetchDriversOnce from "../../CustomHooks/useFetchDriversOnce";
import defaultImage from "../../assets/defaultuser.png"
import addiamge from "../../assets/add-image.png"
import {CameraIcon} from "@heroicons/react/16/solid/index.js";
import {CurrentUserContext} from "../../ContextProvider/CurrentUser.jsx";
import {db} from "../../api/firebase-config.js";

const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    address: Yup.string().required('Address is required'),
    phoneNumber: Yup.string().required('Phone Number is required').matches(/^[0-9]+$/, 'Phone Number must be a valid number'),
    jeepName: Yup.string().required('Jeep Name is required'),
    image: Yup.mixed().required('Profile Picture is required'),
    jeepImages: Yup.mixed().required('At least one image is required'),
    forhire: Yup.boolean().required('Hire Status is required')
});

function DynamicForm({open,setOpen, handleOpen, data = null, action, handlerefresh}) {

    const {CurrentUser} = useContext(CurrentUserContext)
    const fileInputRef = useRef(null);
    const MultipleImageRef = useRef(null);
    const [openimage, setopenimage] = useState(false)
    const [activejeepimage, setActivejeepimage] = useState(null)
    const [Activeid, setActiveid] = useState(null)
    const [loading, setLoading] = useState(false)
    const handleOpenimage = (image, id) => {

        if (Activeid === id && action === "view") {
            setActivejeepimage(image)
            setopenimage(!openimage)
        }

    }
    const [previewImage, setImagePreview] = useState(null)
    const [previewMultipleImage, setMultipleImagePreview] = useState([])

    const handleDivClick = () => {
        // Trigger the click event on the file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleMultipleImage = () => {
        // Trigger the click event on the file input
        if (MultipleImageRef.current) {
            MultipleImageRef.current.click();
        }
    };
    const handleMultipleFileChange = (event, setFieldValue) => {
        const files = event.target.files; // Get the selected files
        const imageUrls = [];

        for (let i = 0; i < files.length; i++) {
            const imageUrl = URL.createObjectURL(files[i]);
            imageUrls.push(imageUrl); // Add each image URL to the array
        }
        setMultipleImagePreview(imageUrls)
        // Assuming you want to store the file URLs (not the file objects themselves)
        setFieldValue("jeepImages", files);
    };

    const handleFileChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {

            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            setFieldValue("image", file);
        }
    };


    const SetMultipleImage = ({values, setFieldValue}) => {

        return (

            <div className="flex flex-row gap-3 ">
                <input multiple accept="image/*" onChange={(e) => handleMultipleFileChange(e, setFieldValue)}
                       ref={MultipleImageRef} type={"file"} className={"hidden"}/>

                {action !== "view"
                    && <button type={"button"} onClick={handleMultipleImage}
                               className=" shadow-[0_3px_4px_-2px_rgba(0,0,0,0.6)] bg-white  rounded-2xl ">

                        <img src={addiamge} alt="" className="w-[5rem] p-2 rounded-md object-cover h-[5rem] "/>
                    </button>

                }
                {previewMultipleImage.length > 0 ?
                    previewMultipleImage?.slice(0, 3)?.map((url, index) => (
                        <img onClick={() => {
                            handleOpenimage(url, values.id)
                            // setActiveid(id)
                        }} key={index} src={url} alt="" className="w-[5rem] rounded-2xl object-cover h-[5rem] "/>
                    ))
                    : Array.isArray(values?.jeepImages) &&
                    values?.jeepImages?.map((url, index) => (
                        <img onClick={() => {
                            handleOpenimage(url, values.id)
                            setActiveid(values?.id)
                        }} src={url} alt="" className="w-[5rem] rounded-2xl object-cover h-[5rem] "/>
                    ))

                }

            </div>
        )
    }

    async function GetImageDownloadURL(result, isfileUrl) {
        console.log('Processing file(s)...');
        const storage = getStorage();
        const files = result instanceof FileList ? Array.from(result) : Array.isArray(result) ? result : [result];
        if (isfileUrl && isfileUrl.length > 0) {
            const uploadPromises = files.map(async (file) => {
                if (file instanceof File) {
                    const imageRef = ref(storage, `images/${file.name}`);
                    await uploadBytes(imageRef, file);
                    const downloadURL = await getDownloadURL(imageRef);
                    console.log(`Uploaded ${file.name}: ${downloadURL}`);
                    return downloadURL;
                } else {
                    console.warn('Invalid file encountered, skipping:', file);
                    return null;
                }
            });
            const downloadURLs = await Promise.all(uploadPromises);
            console.log('All images uploaded:', downloadURLs.filter(Boolean)); // Filter out nulls
            return downloadURLs.filter(Boolean); // Return only valid URLs
        } else {
            console.warn('No preview options provided. Returning the result as is.');
            return result;
        }
    }


    const SetAvatar = ({values, setFieldValue}) => {
        return (
            <div className=" relative ">
                <img src={previewImage ? previewImage : values.image} alt={""}
                     className={"object-cover w-[10rem] aspect-square rounded-full border-[4px]"}/>
                <input accept="image/*" onChange={(e) => handleFileChange(e, setFieldValue)} ref={fileInputRef}
                       type={"file"} className={"hidden"}/>
                <div onClick={handleDivClick}
                     className={"bg-[#3083FF] w-10 border-4  absolute rounded-full  p-1 bottom-0 right-0"}>
                    <CameraIcon className={"text-white"}/>
                </div>
            </div>
        )
    }
    const SubmitUpdate = async (values, resetForm) => {
        console.log(values)
        setLoading(true)
        // const UpdateRef = await getUserDocRefById(values?.id, "drivers");
        const image = await GetImageDownloadURL(values?.image, previewImage)

        const MulitpleImage = await GetImageDownloadURL(values?.jeepImages, previewMultipleImage)
        const UpdateRef = await getUserDocRefById(CurrentUser?.providerData[0]?.uid, "drivers");
        const req = collection(db, "Request");
        const RequestData = {
            id: CurrentUser?.providerData[0]?.uid,
            profilePictureUrl: Array.isArray(image) ? image[0] : image,
            firstName: values?.firstName,
            lastName: values?.lastName,
            address: values?.address,
            phoneNumber: values?.phoneNumber,
            JeepName: values?.jeepName,
            jeepImages: MulitpleImage,
            forHire: values?.forhire,
            status: "pending",
            date: serverTimestamp(),
        };

        const UpdateInformation = {
            id: CurrentUser?.providerData[0]?.uid,
            imageUrl:Array.isArray(image) ? image[0] : image,
            name: values?.firstName + " " +values?.lastName,
            address: values?.address,
            phoneNumber: values?.phoneNumber,
            jeepName: values?.jeepName,
            jeepImages: MulitpleImage,
            forHire: values?.forhire,
            LastUpdated: serverTimestamp(),
        }


        if (action === "add") {
            await addDoc(req, RequestData);
            setOpen(false)
            resetForm()
        }
        if (action === "update") {
            await updateDoc(UpdateRef, UpdateInformation)
            setOpen(false)
            resetForm()
        }
        setLoading(false)
        setImagePreview(null)
        setMultipleImagePreview([])
    }


    const name = data?.name.split(/\s+/);
    const setAction = action === "view"
    return (
        <>

            <div className=" pb-">


                <Typography className={"PlusJakartaSans-Bold"} variant={"h4"} color={"gray"}>{action === "add"  ? "Request Driver Tracking" : "Update Profile"}</Typography>

                <button  color="blue-gray" className={"absolute top-5 right-5"}
                         onClick={()=>setOpen(false)}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-6 w-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <Formik
                    initialValues={{
                        id: data?.id,
                        firstName: data ? name.length >= 3 ? name[0] + " " + name[1] : name[0] : '',
                        lastName: name ? name[name.length - 1] : '',
                        address: data?.address || '',
                        phoneNumber: data?.phoneNumber || '',
                        jeepName: data?.jeepName || '',
                        image: data?.imageUrl || null,
                        jeepImages: data?.jeepImages || null,
                        forhire: !!data?.forHire,

                    }}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={async (values, {resetForm}) => {
                        await SubmitUpdate(values, resetForm);

                    }}
                >
                    {({errors, touched, handleSubmit, resetForm, setFieldValue, values}) => (
                        <Form className="grid grid-cols-3   gap-1">
                            <div className="flex flex-col gap-1 mb-5 mt-4 w-full col-span-3    place-items-center justify-center">
                                <div className="">
                                    <SetAvatar values={values} setFieldValue={setFieldValue}/>
                                </div>
                                <ErrorMessage name="image" component="div"
                                              className="text-red-500 text-[11px]  text-center PlusJakartaSans-Regular"/>

                            </div>
                            <div className="flex  col-span-3  ">

                                <div className="flex flex-col gap-3 px-4 w-full">
                                    <div>
                                        <Field
                                            name="firstName"
                                            as={Input}
                                            disabled={setAction}
                                            error={errors.firstName && touched.firstName}
                                            color="blue"
                                            label="First Name"
                                            className={errors.firstName && touched.firstName ? 'border-red-500' : ''}
                                        />
                                        <ErrorMessage name="firstName" component="div"
                                                      className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>

                                    </div>
                                    <div>
                                        <Field
                                            name="lastName"
                                            as={Input}
                                            disabled={setAction}
                                            color="blue"
                                            error={errors.lastName && touched.lastName}
                                            label="Last Name"
                                            className={errors.lastName && touched.lastName ? 'border-red-500 PlusJakartaSans-Medium' : ''}
                                        />
                                        <ErrorMessage name="lastName" component="div"
                                                      className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>

                                    </div>
                                    <div>
                                        <Field
                                            name="address"
                                            as={Input}
                                            disabled={setAction}
                                            color="blue"
                                            error={errors.address && touched.address}
                                            label="Address"
                                            className={errors.address && touched.address ? 'border-red-500' : ''}
                                        />
                                        <ErrorMessage name="address" component="div"
                                                      className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                                    </div>
                                    <div className="w-full">
                                        <Field
                                            name="phoneNumber"
                                            as={Input}
                                            disabled={setAction}
                                            color="blue"
                                            label="Phone Number"
                                            error={errors.phoneNumber && touched.phoneNumber}
                                            className={errors.phoneNumber && touched.phoneNumber ? 'border-red-500 PlusJakartaSans-Medium' : ''}
                                        />
                                        <ErrorMessage name="phoneNumber" component="div"
                                                      className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                                    </div>

                                    <div className="w-full">
                                        <Field
                                            name="jeepName"
                                            as={Input}
                                            disabled={setAction}
                                            error={errors.jeepName && touched.jeepName}
                                            color="blue"
                                            label="Jeep Name"
                                            className={errors.jeepName && touched.jeepName ? 'border-red-500 PlusJakartaSans-Medium' : ''}
                                        />
                                        <ErrorMessage name="jeepName" component="div"
                                                      className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col  col-span-3   gap-3 px-4 w-full">




                                <div>

                                    <Typography variant="paragraph" color={"gray"} className="pl-3 PlusJakartaSans-Medium">
                                        is Jeep for hire?
                                    </Typography>
                                    <Field
                                        type="radio"
                                        name="forhire"
                                        value="yes" // String value for this radio option
                                        onChange={() => setFieldValue('forhire', true)} // Store true for "Yes"
                                        as={Radio}
                                        checked={values.forhire === true} // Checked if value is true
                                        disabled={setAction}
                                        color="blue"
                                        label="Yes"
                                    />
                                    <Field
                                        type="radio"
                                        name="forhire"
                                        value="no" // String value for this radio option
                                        onChange={() => setFieldValue('forhire', false)} // Store false for "No"
                                        as={Radio}
                                        checked={values.forhire === false} // Checked if value is false
                                        disabled={setAction}
                                        color="blue"
                                        label="No"
                                    />


                                </div>
                                <ErrorMessage name="forhire" component="div"
                                              className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                            </div>

                            <div className="  pl-4  col-span-5  ">
                                <Typography variant="paragraph" color={"gray"} className=" mb-2 pl-3 PlusJakartaSans-Medium">
                                    Jeep Images :
                                </Typography>
                               <div className="flex gap-3 place-items-center">
                                   <SetMultipleImage values={values} setFieldValue={setFieldValue}/>
                                   <ErrorMessage name="jeepImages" component="div"
                                                 className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                               </div>
                            </div>

                            <div
                                className={"mt-4 col-start-1  flex col-start-1 col-end-4    row-start-5 place-items-center flex-row gap-2 h-auto "}>
                                {
                                    action === "add" ?

                                        <button type="submit" color='blue' onClick={handleSubmit}
                                                className="w-full shadow-md border-2 bg-[#3083FF] PlusJakartaSans-Regular rounded-full text-white  flex place-items-center justify-center py-3 border-[#3083FF] ">
                                            {loading ? <Spinner className="w-5 h-5"/> :
                                                "Send Request"}
                                        </button>
                                        :
                                        <button type="submit" color='blue' onClick={handleSubmit}
                                                className="w-full shadow-md border-2 bg-[#3083FF] PlusJakartaSans-Regular rounded-full text-white  flex place-items-center justify-center py-3 border-[#3083FF] ">
                                            {loading ? <Spinner className="w-5 h-5"/> :
                                                "Update Profile"}
                                        </button>
                                }
                            </div>

                        </Form>
                    )}
                </Formik>
            </div>


        </>
    );
}

export default DynamicForm;
