'use server'
import BuildingModel from "@/app/lib/BuildingModel";
import {addDoc, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, setDoc} from "@firebase/firestore";
import {db} from "@/app/lib/firebase.mjs";
import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {permanentRedirect, redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
const storage = getStorage();

const myanmarNumbers = require("myanmar-numbers");


export async function createBuilding(formData: FormData) {
    let lastDocument : BuildingModel ;
    let newId = 0;
    const q = query(
        collection(db, 'buildings'),
        orderBy('id_en', 'desc'),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        lastDocument = doc.data() as BuildingModel;

        newId = lastDocument.id_en+1;
    });

    let myanmarId = myanmarNumbers(newId,"my");
    let newNumber = `အမှတ် - (${myanmarId})`;
    let returnId = "";
    const building = {
        donor: formData.get("donor"), id_en: newId, id_mm: myanmarId, name: formData.get("name"), number: newNumber
    }

    try {
        addDoc(collection(db,"buildings"),building).then(result => {
            console.log(result.id);
            console.log("hello")
            returnId = result.id;
        });
    }catch(error){
        return { message: 'Database Error: Failed to add building' };
    }

    const photoMetaData = {
        contentType: 'image/jpeg',
    };
    const photoRef = ref(storage,`photos/photo${newId}.jpeg`)
    // @ts-ignore
    const photoBuffer = Buffer.from(await formData.get("photo").arrayBuffer());
    try {
        await uploadBytes(photoRef, photoBuffer,photoMetaData);
    }catch{
        return { message: 'Database Error: Failed to upload Photo' };
    }

    const mapMetaData = {
        contentType: 'image/png',
    };
    const mapRef = ref(storage,`maps/map${newId}.png`)
    // @ts-ignore
    const mapBuffer = Buffer.from(await formData.get("map").arrayBuffer());
    try {
        await uploadBytes(mapRef, mapBuffer,mapMetaData);
    }catch{
        return { message: 'Database Error: Failed to upload Map' };
    }

    redirect(`../buildings`)
}


export async function deleteBuilding(id:string,id_en:number) {
    try {
        await deleteDoc(doc(db, "buildings", id));
        const storage = getStorage();
        const photoRef = ref(storage, 'photos/photo'+id_en+".jpeg");
        const mapRef = ref(storage, 'maps/map'+id_en+".png");
        await deleteObject(photoRef);
        await deleteObject(mapRef);
    }
    catch (error){
        return { message: 'Database Error: Failed to delete data' };
    }
    revalidatePath("/")
    redirect('/')
}

export async function updateBuilding(formData:FormData) {

    let id_en : any = formData.get("id_en");

    let id = formData.get("id") + "";
    let myanmarId = myanmarNumbers(id_en,"my");
    let newNumber = `အမှတ် - (${myanmarId})`;
    // @ts-ignore
    const building: BuildingModel = {
        id:id,
        donor: formData.get("donor") + "", name: formData.get("name") + "",
        id_en: Number.parseInt(id_en),
        id_mm: myanmarId,
        number : newNumber
    }
    try {
        // @ts-ignore
        const buildingRef = doc(db, 'buildings', id);
        await setDoc(buildingRef,building)
    }catch(error){
        return { message: 'Database Error: Failed to update building' };
    }

    let photo = formData.get("photo") as File;
    if(photo.size){
        const photoMetaData = {
            contentType: 'image/jpeg',
        };
        const photoRef = ref(storage,`photos/photo${id_en}.jpeg`)
        // @ts-ignore
        const photoBuffer = Buffer.from(await formData.get("photo").arrayBuffer());
        try {
            await uploadBytes(photoRef, photoBuffer,photoMetaData);
        }catch{
            return { message: 'Database Error: Failed to update Photo' };
        }

    }

    let map = formData.get("map") as File;
    if(map.size){
        const mapMetaData = {
            contentType: 'image/png',
        };
        const mapRef = ref(storage,`maps/map${id_en}.png`)
        // @ts-ignore
        const mapBuffer = Buffer.from(await formData.get("map").arrayBuffer());
        try {
            await uploadBytes(mapRef, mapBuffer,mapMetaData);
        }catch{
            return { message: 'Database Error: Failed to update Map' };
        }
    }
    revalidatePath(`../../buildings/${id}`)
    redirect(`../../buildings/${id}`)
}
export const fetchBuildings = async () => {
    try {
        const buildingsCollectionRef = collection(db, "buildings");
        const querySnapshot = await getDocs(query(buildingsCollectionRef,orderBy("id_en")));
        const buildingsArr : any[] = []; //Firebase snapshot
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
export const fetchABuilding = async (id:string) => {
    console.log("jhihihihihihih")
    try {
        const docRef = doc(db, "buildings", id);
        const docSnap = await getDoc(docRef);

        let aBuilding = docSnap.data();
        let photo = await getDownloadURL(ref(storage, `photos/photo${aBuilding?.id_en}.jpeg`));
        let map = await getDownloadURL(ref(storage, `maps/map${aBuilding?.id_en}.png`));
        aBuilding = {...aBuilding,photo,map}
        // Set your buildings state with all fetched buildings
        return aBuilding;
    } catch (error) {
        console.error("Error fetching a building:", error);
    }
};