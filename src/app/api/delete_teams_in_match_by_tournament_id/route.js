import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function DELETE(request){
  console.log("first")
  const res = await request.json()
  console.log("res", res)
     const result = await prisma.teamInMatch.deleteMany({
       where : {
        tournamentId : res
       }
     })
    return NextResponse.json({result})
}