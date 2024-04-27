import React from 'react';
import Image from "next/image";
import {Button, Spinner} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/app/components/icons/VerticalDotsIcon";
import {ClockCircleLinearIcon, DeleteIcon} from "@nextui-org/shared-icons";
import {deleteBuilding, fetchABuilding, fetchBuildings} from "@/app/lib/action";
import Link from 'next/link';
import DeleteButton from "@/app/components/DeleteButton";

export async  function generateStaticParams() {
    // Fetch building IDs from your data source
    // @ts-ignore
    const buildingIds :any[] = await fetchBuildings();
    const toReturn:any[] = buildingIds?.map((building) => ({
        buildingId: building.id // Assuming 'id' is the unique identifier
    }));
    return  toReturn
}


export default async function BuildingDetail({params}: { params: { buildingId: string } }) {
    const {buildingId} = params;
    const building = await fetchABuilding(buildingId);

    return (

        <div className={"h-full w-full rounded-lg "}>
            <div className={"p-10 mx-auto mt-10 mb-20 backdrop-blur-sm rounded-xl w-10/12 lg:w-8/12  shadow-xl text-center "}>

                <div className={"flex flex-col gap-5"}>
                    <h1 className={"text-2xl"}>{building?.name}</h1>
                    <h2 className={"opacity-50"}>{building?.number}</h2>
                    <p>{building?.donor}</p>
                </div>
                <div className={"flex flex-col md:flex-row gap-5 w-full justify-center mt-20"}>
                    {building?.photo === "" ?
                        <></>
                        :
                        <div className={"w-full md:w-5/12"}><Image src={building?.photo} alt={"Building Image"} width={500} className={"rounded-xl shadow-2xl"}
                                                         height={500}/></div>

                    }
                    {building?.map === "" ?
                        <></> :
                        <div className={"w-full md:w-5/12"}><Image src={building?.map} alt={"Building Map"} width={500} height={500} className={" rounded-xl shadow-2xl"}/>
                        </div>}

                </div>
                {building?.photo === "" ?
                    <Spinner color={"warning"}>
                        အချက်အလက်များရယူနေသည်။
                        ကြာနေပါက Refresh ကိုနှိပ်ပါ
                        <br/>
                        <Link href={"/buildings/"+buildingId}>
                            <Button className="bg-amber-500 text-white mt-10 animate-bounce" size={"md"} variant={"shadow"} type={"submit"}
                                    endContent={<ClockCircleLinearIcon/>}>
                                Refresh
                            </Button>
                        </Link>
                    </Spinner>
                    : <div className={"flex flex-col md:flex-row gap-5 w-full justify-center mt-10"}>
                        <Link href={`${buildingId}/update`}>
                            <Button className="bg-amber-500 text-white w-full" size={"lg"} variant={"shadow"}
                                    endContent={<VerticalDotsIcon/>}>
                                ပြင်ဆင်မည်
                            </Button>
                        </Link>
                        <DeleteButton buildingId={buildingId} id_en={building?.id_en+0}/>
                    </div>
                }


            </div>

        </div>

    );
}