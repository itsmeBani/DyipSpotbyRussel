import { useState, useEffect } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase-config";

const useFetchLocation = (tablename, id ) => {
    const [LocationData, setLocationData] = useState(null);

    useEffect(() => {
        let unsubscribe;

        if (id) {
            const docRef = doc(db, tablename, id);
            unsubscribe = onSnapshot(docRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setLocationData({
                        id: docSnapshot.id,
                        ...docSnapshot.data(),
                    });
                } else {
                    setLocationData(null);
                }
            });
        } else {
            unsubscribe = onSnapshot(collection(db, tablename), (snapshot) => {
                const Data = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLocationData(Data);
            });
        }

        return () => unsubscribe();
    }, []);

    return [LocationData];
};

export default useFetchLocation;
