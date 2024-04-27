"use client"
import {Button} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {PlusIcon} from "@/app/components/icons/PlusIcon";
import {createBuilding} from "@/app/lib/action";
import {redirect} from "next/navigation";

export default function BuildingCreate() {
    useEffect(()=>{
        if(localStorage.getItem("isLoggedIn")== undefined) {
            redirect("/");
        }
    },[])
    return (
        <div className="h-full w-full">
            <form action={createBuilding} className="backdrop-blur-sm w-10/12 md:w-6/12 lg:w-5/12 mx-auto py-10 px-10 my-10 rounded-xl shadow-xl">
                <h1 className={"text-center text-xl text-amber-500 drop-shadow-2xl font-bold"}>အဆောင်အသစ်ထည့်ရန် Form</h1>
                <div className="mt-10 flex flex-col md:flex-row gap-5 w-full items-center">
                    <label className={"w-full md:w-3/12"}>အဆောင်အမည် :</label>
                    <input type={"text"} name={"name"} className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                </div>
                <div className="mt-10 flex flex-col md:flex-row gap-5 w-full items-center">
                    <label className={"w-full md:w-3/12"}>အလှူရှင် :</label>
                    <textarea rows={4} name={"donor"} className={"border-1 border-gray-300 rounded-md w-full p-2"}/>
                </div>
                <div className="mt-10 flex flex-col md:flex-row gap-5 w-full items-center">
                    <label className={"w-full md:w-3/12"}>အဆောင်ဓာတ်ပုံ :</label>
                    <input type={"file"} name={"photo"} className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                </div>
                <div className="mt-10 flex flex-col md:flex-row gap-5 w-full items-center">
                    <label className={"w-full md:w-3/12"}>မြေပုံ :</label>
                    <input type={"file"} name={"map"} className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                </div>
                <div className={"w-full"}>
                    <Button className="bg-amber-500 text-white w-full mt-10" size={"lg"} variant={"shadow"} type={"submit"}
                            endContent={<PlusIcon/>}>
                        အဆောင်အသစ်ထည့်မည်
                    </Button>
                </div>
            </form>
        </div>
    )
}