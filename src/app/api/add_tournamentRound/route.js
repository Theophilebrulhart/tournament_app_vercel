import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  const res = await request.json();

  try {
    const createdRound = await prisma.tournamentRound.create({
      data: {
        maxRound: res.maxRound,
        timePlan: res.timePlan,
        tournament: {
          connect: {
            id: res.tournamentId,
          },
        },
      },
    });

    const matchPromises = res.round.map((matchtmp) => {
      return prisma.match.create({
        data: {
          teams : {
            connect : [
              {id : matchtmp.teams[0].id},
              {id : matchtmp.teams[1].id},
            ],
          },
          field : matchtmp.field,
          startDate : matchtmp.date,
          tournamentRoundId: createdRound.id,
          tournamentId: res.tournamentId,
          scoreTeam1: 0,
          scoreTeam2: 0,
          extraMatch: matchtmp.extraMatch
        },
      });
    });

    const createdMatches = await Promise.all(matchPromises);

    return NextResponse.json({ result : { createdRound, createdMatches} });
  } catch (error) {
    console.error('Error creating round and matches:', error.message);
    return NextResponse.json({ error: 'Error creating round and matches' }, { status: 500 });
  }
}
