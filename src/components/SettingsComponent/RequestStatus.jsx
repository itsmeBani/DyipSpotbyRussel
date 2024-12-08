import React, { useContext, useState } from "react";
import {CheckIcon, XCircleIcon, CheckBadgeIcon,ClockIcon,NoSymbolIcon } from "@heroicons/react/24/solid"; // Import Heroicons
import {auth, db} from "../../api/firebase-config";
import {addDoc, collection, getDocs, query, deleteDoc,serverTimestamp, where} from "firebase/firestore";
import useCheckRole from "../../CustomHooks/useCheckRole.js";
import {CurrentUserContext} from "../../ContextProvider/CurrentUser.jsx";
import {signOut} from "firebase/auth";
import {useCookies} from "react-cookie";
import {Spinner} from "@material-tailwind/react";

function PendingOrApproved({ status = null, Applicant }) {
    const [cookies, setCookie, removeCookie] = useCookies(['authentication-token']);

    console.log(Applicant)
    const {CurrentUser} = useContext(CurrentUserContext)
    const [loading,setloading]=useState(false)
    const encryptionKey = import.meta.env.VITE_ENCRYPTION_KEY;
    const decryptedRole = useCheckRole('role', encryptionKey);

    const handlePress = async () => {
        if (normalizeStatus(status) === "pending" || normalizeStatus(status) === "cancelled") {
            await CancelRequest();
        }
        if (normalizeStatus(status) === "approved") {
            await LoginAsDriver();
        }
    };

    const getStatusIcon = () => {
        const iconStyles = { width: 24, height: 24, color: getIconColor() };
        switch (normalizeStatus(status)) {
            case "approved":
                return <CheckBadgeIcon style={iconStyles} />;
            case "pending":
                return <ClockIcon style={iconStyles} />;
            case "cancelled":
                return <NoSymbolIcon style={iconStyles} />;
            default:
                return null;
        }
    };

    const normalizeStatus = (status) => status?.trim().toLowerCase() || "";

    const getIconColor = () => {
        switch (normalizeStatus(status)) {
            case "approved":
                return "#08c552";
            case "pending":
                return "#FECA5BFF";
            case "cancelled":
                return "#FF5252FF";
            default:
                return "#000000";
        }
    };

    const getStatusColor = () => {
        switch (normalizeStatus(status)) {
            case "approved":
                return "#F0F9F0FF";
            case "pending":
                return "#fff8e6";
            case "cancelled":
                return "#ffe6e6";
            default:
                return "#fff";
        }
    };

    const getHighlightColor = () => {
        switch (normalizeStatus(status)) {
            case "approved":
                return "rgba(8,197,82,0.76)";
            case "pending":
                return "#FECA5BFF";
            case "cancelled":
                return "#FF5252FF";
            default:
                return "#feca5b";
        }
    };

    const getButtonText = () => {
        if (normalizeStatus(status) === "approved") return "Login as driver";
        if (normalizeStatus(status) === "pending") return "Cancel";
        if (normalizeStatus(status) === "cancelled") return "Reapply";
        return "";
    };


    const CancelRequest = async () => {
        setloading(true)
        try {
            await deleteDocumentsById(db, "Request", CurrentUser?.providerData[0]?.uid);

        } catch (err) {
            console.error("Error cancelling request: ", err);
            setloading(false);
        }finally {
            setloading(false);
        }
    };

    async function deleteDocumentsById(db, tableName, id) {
        try {
            const docRef = collection(db, tableName);
            const q = query(docRef, where("id", "==", id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
                await Promise.all(deletePromises);
                console.log(`Documents from table "${tableName}" with id "${id}" deleted successfully.`);
            } else {
                console.log(`No matching documents found in table "${tableName}" for id "${id}".`);
            }
        } catch (err) {
            console.error(`Error deleting documents from table "${tableName}" for id "${id}":`, err);
        }
    }


    const LoginAsDriver = async () => {
        setloading(true)
        try {

            await AddNewDriverTracking()

            await deleteDocumentsById(db, "users",CurrentUser?.providerData[0]?.uid)
                  setloading(false)
            await signOut(auth)
            removeCookie('authentication-token')
            removeCookie('role')
            return true;
        } catch (exception) {
            return false;
        }finally {
            setloading(false)
        }
    }


    const AddNewDriverTracking = async () => {
        try {
            const ref = collection(db, "drivers");
            // const loc= await Location.getLastKnownPositionAsync()

            const NewDriverData = {
                id: CurrentUser?.providerData[0]?.uid,
                LastUpdated: serverTimestamp(),
                endpoint: {},
                estimatedarrivaltime: "",
                heading: 0,
                address: Applicant?.address,
                imageUrl: Applicant?.profilePictureUrl,
                jeepImages: Applicant?.jeepImages,
                latitude: 16.9,
                jeepName:Applicant?.JeepName,
                longitude:  120.4,
                name: Applicant?.firstName + " " + Applicant?.lastName,
                passengers: "",
                phoneNumber: Applicant?.phoneNumber,
                speed: 0,
                forHire:Applicant?.forHire,
                starpoint:{},
                status: "offline",

            }
            console.log(NewDriverData, "s")
            await addDoc(ref, NewDriverData);
            console.log("New Driver added ");
        } catch (e) {
            console.log(e)
        }
    }


    return (
        <div style={{ ...styles.container, backgroundColor: getStatusColor() }} className={"overflow-hidden "}>
            <div style={styles.highlightBar(getHighlightColor())}></div>
            <div  className="flex flex-row w-full justify-between">

                <div style={styles.details} className="pl-2">
                    <img
                        src={Applicant?.profilePictureUrl}
                        alt="Avatar"
                        style={styles.avatar}
                    />
               <div>
                   <div>
                       <div style={styles.name}>
                           {(Applicant?.firstName + " " + Applicant?.lastName).length > 17
                               ? Applicant?.firstName + " " + Applicant?.lastName.slice(0, 17) + "..."
                               : Applicant?.firstName + " " + Applicant?.lastName}
                       </div>
                       <div style={styles.description}>Applying for Jeep tracking</div>

                   </div>
                   <div className={"flex"} >

                       <p   className="px-2 text-[13px] PlusJakartaSans-Medium" style={styles.status(getHighlightColor())}>

                           {status}
                       </p>
                   </div>
               </div>
                </div>
             <div className={"flex flex-col justify-between"}>
                 <div className={" place-items-end   "}>{getStatusIcon()}</div>
                 <button
                     onClick={handlePress}
                     disabled={loading}
                     className="px-10"
                     style={
                         normalizeStatus(status) === "approved"
                             ? styles.approvedButton
                             : styles.cancelButton
                     }
                 >
                     {loading ? (
                         <Spinner color={"white"}/>
                     ) : (
                         <span className="PlusJakartaSans-Medium"
                             style={
                                 normalizeStatus(status) === "approved"
                                     ? styles.approvedButtonText
                                     : styles.cancelButtonText
                             }
                         >
              {getButtonText()}
            </span>
                     )}
                 </button>
             </div>
            </div>
        </div>
    );
}

export default PendingOrApproved;

const styles = {
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "10px",
        padding: "10px",

        position: "relative",
        border: "1px solid #ddd",
    },
    highlightBar: (color) => ({
        width: "7px",
        height: "100%",
        backgroundColor: color,
        position: "absolute",
        left: 0,
    }),
    content: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "10px",
        flexGrow: 1,
    },
    iconContainer: {
        flexShrink: 0,
    },
    avatar: {
        width: "90px",
        height: "90px",
        borderRadius: "10px",
        objectFit: "cover",
    },
    details: {
        display: "flex",
        flexDirection: "row",
        gap: "20px",
    },
    name: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#555",
    },
    description: {
        fontSize: "12px",
        color: "#777",
    },
    status: (color) => ({
        fontSize: "10px",
        padding: "5px 10px",
        borderRadius: "20px",
        backgroundColor: color,
        color: "#fff",

    }),
    approvedButton: {
        border: "1px solid rgba(8,197,82,0.76)",
        padding: "5px 15px",
        borderRadius: "20px",
        backgroundColor: "transparent",
        color: "rgba(8,197,82,0.76)",
        cursor: "pointer",
    },
    cancelButton: {
        border: "1px solid #FF5252FF",
        padding: "5px 15px",
        borderRadius: "20px",
        backgroundColor: "transparent",
        color: "#FF5252FF",
        cursor: "pointer",
    },
    approvedButtonText: {
        fontSize: "12px",
        fontWeight: "bold",
    },
    cancelButtonText: {
        fontSize: "12px",
        fontWeight: "bold",
    },
};