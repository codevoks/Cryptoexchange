'use client'
import Image from "next/image";

export default function McLarenLogo(){
    return (
            <Image
                src="/mclaren-svgrepo-com.svg"
                alt="McLaren Logo"
                width={120}
                height={40}
                className="w-auto h-[52px] px-4"
            />
    )
}