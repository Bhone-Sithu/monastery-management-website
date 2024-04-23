'use server'
import BuildingModel from "@/app/lib/BuildingModel";
import {addDoc, collection, deleteDoc, doc, getDocs, limit, orderBy, query, setDoc} from "@firebase/firestore";
import {db} from "@/app/lib/firebase";
import {deleteObject, getStorage, ref, uploadBytes} from "firebase/storage";
import {permanentRedirect, redirect} from "next/navigation";
import {revalidatePath} from "next/cache";
const storage = getStorage();

const myanmarNumbers = require("myanmar-numbers");


export async function createBuilding(formData: FormData) {
    let lastDocument : BuildingModel ;
    const q = query(
        collection(db, 'buildings'),
        orderBy('id_en', 'desc'),
        limit(1)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        lastDocument = doc.data() as BuildingModel;
    });

    let newId = lastDocument.id_en+1;
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

    redirect(`../buildings/${returnId}`)
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