"use client"
import React, {useEffect, useState} from 'react';
import {doc, getDoc} from "firebase/firestore";
import BuildingModel from "@/app/lib/BuildingModel";
import {db} from "@/app/lib/firebase";
import Image from "next/image";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import {Button, Spinner} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/app/components/icons/VerticalDotsIcon";
import {DeleteIcon} from "@nextui-org/shared-icons";
import clsx from "clsx";
import {ErrorBoundary} from "next/dist/client/components/error-boundary";
import Error from "./error"
import {deleteBuilding} from "@/app/lib/action";
export default function BuildingDetail({params}: { params: { buildingId: string } }) {
    const storage = getStorage();
    const [photoRef, setPhotoRef] = useState("");
    const [mapRef, setMapRef] = useState("")
    const [popUp, setPopUp] = useState(false)

    const id = params.buildingId;
    const [building, setBuilding] = useState<BuildingModel>({
        number: "",
        id: "",
        id_mm: "",
        id_en: 0,
        name: "",
        donor: ""
    });
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

    const PopUp = () => {
        return (
            <div className={clsx("absolute backdrop-blur z-10 h-[130%] w-full items-center  justify-center", {
                "hidden": !popUp,
                "flex transition ease-in-out duration-500": popUp,
            })}>
                <div className={"bg-white w-4/12 h-6/12 m-auto p-5 rounded-xl"}>
                    <h1>အချက်အလက်များဖျက်ရန် သေချာပါသလား။</h1>
                    <div className={"flex gap-5 w-full justify-center mt-10"}>
                        <Button className="bg-amber-500 text-white" onClick={() => setPopUp(false)} size={"md"}
                                variant={"shadow"} endContent={<VerticalDotsIcon/>}>
                            မဖျက်ပါ
                        </Button>
                        <Button className="bg-red-400 text-white" size={"md"} variant={"shadow"}
                                endContent={<DeleteIcon/>} onClick={()=>deleteBuilding(id,building.id_en)}>
                            ဖျက်မည်
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
    // @ts-ignore
    return (

        <div className={"h-full w-full overflow-hidden rounded-lg"}>
            {/*{popUp? <PopUp/> : <></>}*/}
            <PopUp/>
            <div className={"p-10 mx-60 mt-10 mb-20 bg-white rounded-xl  shadow-xl text-center"}>
                {photoRef === "" ?
                    <Spinner>အချက်အလက်များရယူနေသည်</Spinner>
                    : <></>
                }
                <div className={"flex flex-col gap-5"}>
                    <h1 className={"text-2xl"}>{building.name}</h1>
                    <h2 className={"opacity-50"}>{building.number}</h2>
                    <p>{building.donor}</p>
                </div>
                <div className={"flex gap-5 w-full justify-center mt-20"}>
                    {photoRef === "" ?
                        <></>
                        :
                        <div className={"w-5/12"}><Image src={photoRef} alt={"Building Image"} width={500}
                                                         height={500}/></div>

                    }
                    {mapRef === "" ?
                        <></> :
                        <div className={"w-5/12"}><Image src={mapRef} alt={"Building Map"} width={500} height={500}/>
                        </div>}

                </div>
                <div className={"flex gap-5 w-full justify-center mt-10"}>
                    <Button className="bg-amber-500 text-white" size={"lg"} variant={"shadow"}
                            endContent={<VerticalDotsIcon/>}>
                        ပြင်ဆင်မည်
                    </Button>
                    <Button className="bg-red-400 text-white" onClick={() => setPopUp(true)} size={"lg"}
                            variant={"shadow"} endContent={<DeleteIcon/>}>
                        ဖျက်မည်
                    </Button>
                </div>

            </div>

        </div>

    );
}