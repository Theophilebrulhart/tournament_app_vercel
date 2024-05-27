import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function DELETE(request){
  const res = await request.json()
     const result = await prisma.teamInMatch.deleteMany({
       where : {
        tournamentId : res
       }
     })
    return NextResponse.json({result})
}