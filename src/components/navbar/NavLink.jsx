"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ link }) {

    const path = usePathname();

  return (
    <Link href={link.path} key={link.title} 
        className={`text-white hover:text-gray-300 mx-2 ${path === link.path && "bg-white text-black rounded-xl p-2 hover:text-blue-300"}`}
    >
        {link.title}
    </Link>
    );
  }