import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function DELETE(request, params){
  const res = await request.json()
     const result = await prisma.teamInMatch.deleteMany({
       where : { ...res }
     })
    return NextResponse.json({result})
}