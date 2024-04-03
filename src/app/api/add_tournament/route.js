import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request){
    const res = await request.json()
    const tournament = res;
    console.log("tournament in api ", tournament)
     const result = await prisma.tournament.create({
        data: {
            name: tournament.name,
            fieldNbr: parseInt(tournament.fieldNbr),
            start: new Date(tournament.start),
            end: new Date(tournament.end),
        }
     })
    return NextResponse.json({result})
}