import {collection, getDocs, orderBy, query} from "firebase/firestore";
import db from './firebase.mjs';

// const {db} = require("./firebase");
// const {collection, getDocs, orderBy, query} = require("firebase/firestore");
const fetchBuildings = async () => {
    try {
        console.log("hi")
        const buildingsCollectionRef = collection(db, "buildings");
        const querySnapshot = await getDocs(query(buildingsCollectionRef,orderBy("id_en")));
        const buildingsArr = []; //Firebase snapshot
        querySnapshot.forEach((doc) => {
            // Build your buildings array using document data and IDs
            buildingsArr.push({ ...doc.data(), id: doc.id });
        });
        // Set your buildings state with all fetched buildings
        return buildingsArr;
    } catch (error) {
        console.error("Error fetching buildings:", error);
    }
};
export default fetchBuildings;