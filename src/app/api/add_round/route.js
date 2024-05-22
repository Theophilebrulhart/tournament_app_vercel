import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function POST(request){
    const res = await request.json();
     const result = await prisma.tournamentRound.create({
        data: {
            teams: {
                createMany : {
                    data: res.round.map((match) => {
                        matches : {
                            teams : match.teams
                        }
                })
            },
            tournament: {
                connect: {
                    id: res.tournamentId,
                }
            },
            tournamentRound: res.tournamentRound,
            scoreTeam1: 0,
            scoreTeam2: 0,
        }
     }
    });


    return NextResponse.json({result})
}