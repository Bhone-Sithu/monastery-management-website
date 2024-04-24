"use client"
import BuildingTable from "@/app/components/BuildingTable";
import React, {useEffect} from "react";
import {redirect} from "next/navigation";

export default function Home() {
    useEffect(()=>{
        if(localStorage.getItem("isLoggedIn")== undefined) {
            redirect("/");
        }
    },[])
  return (
    <div className="w-9/12 h-full mx-auto py-10">
      <BuildingTable/>

    </div>
  );
}
