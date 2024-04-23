"use client"
import {Button} from "@nextui-org/react";
import React, {useState} from "react";
import {PlusIcon} from "@/app/components/icons/PlusIcon";
import {createBuilding} from "@/app/lib/action";

export default function BuildingCreate() {
    return (
        <div className="h-screen w-screen overflow-hidden">
            <form action={createBuilding} className="bg-white w-5/12 mx-auto py-10 px-16 mt-10 rounded-xl shadow-xl">
                <h1 className={"text-center "}>Form add</h1>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Name :</label>
                    <input type={"text"} name={"name"} className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                </div>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Donor :</label>
                    <textarea name={"donor"} className={"border-1 border-gray-300 rounded-md w-full p-2"}/>
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