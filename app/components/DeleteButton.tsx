"use client"
import {DeleteIcon} from "@nextui-org/shared-icons";
import {Button} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {deleteBuilding} from "@/app/lib/action";

// @ts-ignore
export default function DeleteButton({buildingId, id_en}) {

    const handleDelete = async () => {
        await deleteBuilding(buildingId,id_en)
    }
    return (<Button className="bg-red-400 text-white" onClick={handleDelete} size={"lg"}
                    variant={"shadow"} endContent={<DeleteIcon/>}>
        ဖျက်မည်
    </Button>);
}