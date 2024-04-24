import React from 'react';
import Image from "next/image";
export default function Nav() {
    return(
        <div className="bg-amber-500 fixed z-50 w-full h-[10%] flex flex-row items-center justify-between px-20 pb-10">
            <h2 className={"self-end"}>Log out</h2>
        </div>
    );
}