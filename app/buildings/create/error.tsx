'use client';

import React, { useEffect } from 'react';
import {Button} from "@nextui-org/react";
import {VerticalDotsIcon} from "@/app/components/icons/VerticalDotsIcon";
import {DeleteIcon} from "@nextui-org/shared-icons";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Optionally log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="absolute backdrop-blur  z-10 h-full w-full flex items-center  justify-center" style={{ backgroundColor:"#efffc8" }}>
            <div className={"bg-white w-4/12 shadow-2xl h-6/12 m-auto p-5 rounded-xl flex flex-col justify-center gap-2"}>
                <h2 className="text-center text-2xl">Something went wrong!</h2>
                <h3 className="text-center opacity-50">{error.message}</h3>
                <Button
                    size={"md"}
                    className="mt-4 mx-auto rounded-md bg-red-400 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
                    onClick={
                        // Attempt to recover by trying to re-render the invoices route
                        () => reset()
                    }
                >
                    Try again
                </Button>
            </div>
        </div>

)
}