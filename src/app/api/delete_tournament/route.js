import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function DELETE(request){
    const res = await request.json()
    const team = res;
    console.log("api route delete team", res)
     const result = await prisma.tournament.delete({
       where : {
        id : res
       }
     })
    return NextResponse.json({result})
}