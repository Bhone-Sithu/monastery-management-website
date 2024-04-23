import {Button} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/app/components/icons/VerticalDotsIcon";
import {DeleteIcon} from "@nextui-org/shared-icons";
import React from "react";

export default function PopUp(){
    return (
        <div className="absolute  backdrop-blur z-10 h-[130%] w-full flex items-center  justify-center">
            <div className={"bg-white w-4/12 h-6/12 m-auto p-5 rounded-xl"}>
                <h1>အချက်အလက်များဖျက်ရန် သေချာပါသလား။</h1>
                <div className={"flex gap-5 w-full justify-center mt-10"}>
                    <Button className="bg-amber-500 text-white" size={"md"} variant={"shadow"} endContent={<VerticalDotsIcon />}>
                        မဖျက်ပါ
                    </Button>
                    <Button className="bg-red-400 text-white" size={"md"} variant={"shadow"} endContent={<DeleteIcon />}>
                        ဖျက်မည်
                    </Button>
                </div>
            </div>
        </div>
    );
}