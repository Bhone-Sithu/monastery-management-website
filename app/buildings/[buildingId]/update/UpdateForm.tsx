"use client"
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import React, {useEffect, useState} from "react";
import {redirect} from "next/navigation";
import {doc, getDoc} from "firebase/firestore";
import BuildingModel from "@/app/lib/BuildingModel";
import {updateBuilding} from "@/app/lib/action";
import {Button, Spinner} from "@nextui-org/react";
import {PlusIcon} from "@/app/components/icons/PlusIcon";
import Link from "next/link";
import {ArrowLeftIcon, ClockCircleLinearIcon} from "@nextui-org/shared-icons";
import db from "@/app/lib/firebase.mjs";

export default function UpdateForm({buildingId}:{buildingId:string}){

    const storage = getStorage();
    const [photoRef, setPhotoRef] = useState("");
    const [mapRef, setMapRef] = useState("")
    const [name, setName] = useState("")
    const [donor, setDonor] = useState("")
    const [id_en, setId_en] = useState(0)
    const id = buildingId;

    useEffect(() => {
        if(localStorage.getItem("isLoggedIn")== undefined) {
            redirect("/");
        }
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
                setName(buildingData.name);
                setDonor(buildingData.donor);
                setId_en(buildingData.id_en)
            }catch{
                return{message:"Failed to get data"}
            }
        }
        fetchBuilding();
    }, [])
    return (
        <div className="h-screen w-screen overflow-hidden">
            <form action={updateBuilding} className="backdrop-blur-sm w-5/12 mx-auto py-10 px-16 mt-10 rounded-xl shadow-xl">
                {name===""?<Spinner color={"warning"} className={"mx-auto w-full"}>
                    အချက်အလက်များရယူနေသည်။
                    <br/>
                </Spinner>:<>
                    <h1 className={"text-center "}>အဆောင်အသစ်ထည့်ရန် Form</h1>
                    <div className="mt-10 flex gap-5 w-full items-center">
                        <label className={"w-3/12"}>အဆောင်အမည် :</label>
                        <input type={"text"} value={name} name={"name"} onChange={(event) => setName(event.target.value)}
                               className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                    </div>
                    <div className="mt-10 flex gap-5 w-full items-center">
                        <label className={"w-3/12"}>အလှူရှင် :</label>
                        <textarea value={donor} onChange={(event) => setDonor(event.target.value)} name={"donor"}
                                  className={"border-1 border-gray-300 rounded-md w-full p-2"}/>
                    </div>
                    <div className="mt-10 flex gap-5 w-full items-center">
                        <label className={"w-3/12"}>အဆောင်ဓာတ်ပုံ : </label>
                        <input type={"file"} name={"photo"} className={"border-1 border-gray-300 rounded-md w-full p-2"}
                        />
                    </div>
                    <div className="mt-10 flex gap-5 w-full items-center">
                        <label className={"w-3/12"}>မြေပုံ : </label>
                        <input type={"file"} name={"map"} className={"border-1 border-gray-300 rounded-md w-full p-2"}
                        />
                    </div>
                    <input type="hidden" value={id} name={"id"}/>
                    <input type="hidden" value={id_en} name={"id_en"}/>
                    <div className={"w-full flex gap-2 justify-center"}>
                        <Button className="bg-amber-500 text-white  mt-10" size={"lg"} variant={"shadow"}
                                type={"submit"}
                                endContent={<PlusIcon/>}>
                            Update
                        </Button>
                        <Link href={"/buildings/"+id}>
                            <Button className="bg-red-400 text-white mt-10" size={"lg"} variant={"shadow"}
                                    type={"submit"}
                                    endContent={<ArrowLeftIcon/>}>

                                Back
                            </Button>
                        </Link>
                    </div>
                </>}
            </form>
            {/*<div className={"flex gap-5 w-full justify-center mt-20"}>*/}
            {/*    {photoRef === "" ?*/}
            {/*        <></>*/}
            {/*        :*/}
            {/*        <div className={"w-5/12"}><Image src={photoRef} alt={"Building Image"} width={500}*/}
            {/*                                         height={500}/></div>*/}

            {/*    }*/}
            {/*    {mapRef === "" ?*/}
            {/*        <></> :*/}
            {/*        <div className={"w-5/12"}><Image src={mapRef} alt={"Building Map"} width={500} height={500}/>*/}
            {/*        </div>}*/}

            {/*</div>*/}
        </div>
    )
}