import Link from "next/link";
import Links from "./Links";
import Image from "next/image";

export default function Navbar() {

    return (
        <div className="flex flex-row justify-between mx-10 h-40 items-center">
            <Image src="/logo_blanc.svg" alt="logo" width={40} height={40} />
            <Links />
        </div>
    )
}
