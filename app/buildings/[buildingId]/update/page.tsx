"use client"
import {Button} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {PlusIcon} from "@/app/components/icons/PlusIcon";
import {createBuilding} from "@/app/lib/action";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/lib/firebase";
import BuildingModel from "@/app/lib/BuildingModel";
import {getDownloadURL, ref} from "firebase/storage";

export default function BuildingCreate() {

    useEffect(() => {
        const fetchBuilding = async () => {
            try{
                const docRef = doc(db, "buildings", id);
                const docSnapshot = await getDoc(docRef);
                const buildingData = docSnapshot.data() as BuildingModel;
                try {
                    let photo = await getDownloadURL(ref(storage, `photos/photo${buildingData.id_en}.jpeg`));
                    setPhotoRef(photo);
                }catch(error){

                    return{message:"Failed to download photo"}
                }
                try{
                    let map = await getDownloadURL(ref(storage, `maps/map${buildingData.id_en}.png`));
                    setMapRef(map);
                }catch{
                    return{message:"Failed to download map"}
                }
                setBuilding(buildingData);
            }catch{
                return{message:"Failed to get data"}
            }
        }
        fetchBuilding();
    }, [])
    return (
        <div className="h-screen w-screen overflow-hidden">
            <form action={createBuilding} className="bg-white w-5/12 mx-auto py-10 px-16 mt-10 rounded-xl shadow-xl">
                <h1 className={"text-center "}>Form update</h1>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Name :</label>
                    <input type={"text"} name={"name"} className={"border-1 border-gray-300 rounded-md w-full p-2"}  required/>
                </div>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Donor :</label>
                    <input type={"text"} name={"donor"} className={"border-1 border-gray-300 rounded-md w-full p-2"}/>
                </div>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Photo :</label>
                    <input type={"file"} name={"photo"} className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                </div>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Map :</label>
                    <input type={"file"} name={"map"} className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                </div>
                <div className={"w-full"}>
                    <Button className="bg-amber-500 text-white w-full mt-10" size={"lg"} variant={"shadow"} type={"submit"}
                            endContent={<PlusIcon/>}>
                        မဖျက်ပါ
                    </Button>
                </div>
            </form>
        </div>
    )
}