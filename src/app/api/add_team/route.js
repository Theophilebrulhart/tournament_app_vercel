import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request){
    const res = await request.json();
    const team = res;
     const result = await prisma.team.create({
        data: {
            name: team.name,
            level : parseInt(team.level),
            tournaments: {
                connect: {
                    id: team.tournamentId,
                }
            }
        }
     })

    return NextResponse.json({result})
}