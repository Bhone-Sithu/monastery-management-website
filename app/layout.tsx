import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "@/app/components/Nav";
import Image from "next/image";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pa Auk Taw Ya",
  description: "Monastery Building Management Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
        <link rel="icon" href="/images/buddha.png" sizes="any"/>
    </head>
    <body className={inter.className}>
    {/*<Nav/>*/}
      <div className="relative text-center">
          {/* Image */}
          <Image
              src="/images/buddha.png"
              alt="logo"
              width={100}
              height={100}
              className="relative mt-10 mb-5 mx-auto z-10"
          />
          {/* Background div */}
          <div className="absolute inset-0 flex items-center justify-center z-0">
              <div className="relative rounded-full p-1 w-[110px] h-[110px] bg-gradient-radial from-amber-500 to-red-500 animate-appearance-in">

                  {/*<div className="absolute left-4 top-0 rounded-full m-auto mt-4 p-1 w-[80px] h-[80px] bg-yellow-200 animate-ping"></div>*/}
                  <div className="absolute left-5 rounded-full m-auto mt-4 p-1 w-[70px] h-[70px] bg-yellow-500 animate-ping"></div>
              </div>
          </div>
      </div>


      {children}</body>
    </html>
  );
}
