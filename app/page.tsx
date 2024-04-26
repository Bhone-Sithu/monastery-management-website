"use client"
import {Button} from "@nextui-org/react";
import React, {useEffect, useState} from "react";
import {PlusIcon} from "@/app/components/icons/PlusIcon";
import {LockFilledIcon} from "@nextui-org/shared-icons";
import {redirect} from "next/navigation";

export default function BuildingCreate() {
    const [errorMsg, setErrorMsg] = useState("");
    const logIn = (formData:FormData) => {
        let email = formData.get("email");
        let password = formData.get("password");
        if(email == "paauktawya.main@gmail.com" && password == "singapore"){
            localStorage.setItem("isLoggedIn","true");
            redirect("buildings/")
        }
        else{
            setErrorMsg("Email or Password is incorrect. Please try again.");
        }
    }
    useEffect(()=>{
        if(localStorage.getItem("isLoggedIn")){
            redirect("/buildings")
        }
    },[])
    return (
        <div className=" overflow-hidden z-10">
            <form action={logIn} className=" w-5/12 mx-auto py-10 px-16 mt-10 rounded-xl shadow-2xl z-10 backdrop-blur-sm">
                <h1 className={"text-center "}>Log In</h1>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Email :</label>
                    <input type={"email"} name={"email"} className={"border-1 border-gray-300 rounded-md w-full p-2"} required/>
                </div>
                <div className="mt-10 flex gap-5 w-full items-center">
                    <label className={"w-3/12"}>Password :</label>
                    <input type={"password"} name={"password"} className={"border-1 border-gray-300 rounded-md w-full p-2"}/>
                </div>
                {errorMsg ? <p className={"text-center text-red-400 mt-5 animate-bounce"}>{errorMsg}</p> : null}
                <div className={"w-full flex justify-center"}>
                    <Button className="bg-amber-500 text-white mx-auto mt-5" size={"lg"} variant={"shadow"} type={"submit"}
                            endContent={<LockFilledIcon/>}>
                        Login
                    </Button>
                </div>
            </form>
        </div>
    )
}