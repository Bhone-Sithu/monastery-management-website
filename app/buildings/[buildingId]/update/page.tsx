import {Button} from "@nextui-org/react";
import React from "react";
import {PlusIcon} from "@/app/components/icons/PlusIcon";
import {createBuilding, fetchBuildings, updateBuilding} from "@/app/lib/action";
import {doc, getDoc} from "firebase/firestore";
import {db} from "@/app/lib/firebase.mjs";
import BuildingModel from "@/app/lib/BuildingModel";
import {getDownloadURL, getStorage, ref} from "firebase/storage";
import Image from "next/image";
import {redirect} from "next/navigation";
import Link from "next/link";
import {ArrowLeftIcon, DeleteIcon} from "@nextui-org/shared-icons";
import UpdateForm from "@/app/buildings/[buildingId]/update/UpdateForm";


export async  function generateStaticParams() {
    // Fetch building IDs from your data source
    // @ts-ignore
    const buildingIds :any[] = await fetchBuildings();
    const toReturn:any[] = buildingIds?.map((building) => ({
        buildingId: building.id // Assuming 'id' is the unique identifier
    }));
    return  toReturn
}

export default function BuildingCreate({params}: { params: { buildingId: string } }) {
    const id = params.buildingId;
   return (
       <div>
           <UpdateForm buildingId={id}>
           </UpdateForm>
       </div>
   )
}