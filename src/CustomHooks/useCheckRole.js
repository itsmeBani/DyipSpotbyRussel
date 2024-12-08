import {useState, useEffect, useContext} from 'react';
import { useCookies } from 'react-cookie';
import CryptoJS from 'crypto-js';
import {CurrentUserContext} from "../ContextProvider/CurrentUser.jsx";

const useCheckRole = (cookieName, encryptionKey) => {
    const [cookies] = useCookies([cookieName]);
    const [role, setRole] = useState(null);
    const { CurrentUser } = useContext(CurrentUserContext);
    // Decrypt the cookie value
    const decryptCookie = (encryptedValue) => {
        if (!encryptedValue) return null; // Return null if the cookie is not available

        try {
            const bytes = CryptoJS.AES.decrypt(encryptedValue, encryptionKey);
            return bytes.toString(CryptoJS.enc.Utf8); // Return decrypted string
        } catch (error) {
            console.error("Error decrypting cookie:", error);
            return null;
        }
    };

    // Use effect to monitor changes to the cookie
    useEffect(() => {
        if (cookies[cookieName]) {
            const decryptedValue = decryptCookie(cookies[cookieName]);
            setRole(decryptedValue);
        } else {
            setRole(null);
        }
    }, [cookies,CurrentUser, cookieName]); // Dependencies include the cookie and its name

    return role; // Return the decrypted role
};

export default useCheckRole;
