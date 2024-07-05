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

    const matchPromises = res.round.map(async (matchtmp) => {
      await prisma.team.update({
        where: { id: matchtmp.teams[0].id },
        data: { actualRank: matchtmp.teams[0].rank },
      });

      await prisma.team.update({
        where: { id: matchtmp.teams[1].id },
        data: { actualRank: matchtmp.teams[1].rank },
      });

      const createdMatch = await prisma.match.create({
        data: {
          teams: {
            connect: [
              { id: matchtmp.teams[0].id },
              { id: matchtmp.teams[1].id },
            ],
          },
          field: matchtmp.field,
          startDate: matchtmp.date,
          tournamentRoundId: createdRound.id,
          tournamentId: res.tournamentId,
          extraMatch: matchtmp.extraMatch,
        },
      });

      const teamsInMatchPromises = matchtmp.teams.map(async (team) => {
        await prisma.teamInMatch.create({
          data: {
            score: 0,
            rank: team.rank,
            teamId: team.id,
            name: team.name,
            tournamentId: res.tournamentId,
            tournamentRoundId: createdRound.id,

            match: {
              connect: {
                id: createdMatch.id,
              },
            },
          },
        });
      });
    });

    const createdMatches = await Promise.all(matchPromises);

    return NextResponse.json({ result: { createdRound, createdMatches } });
  } catch (error) {
    console.error("Error creating round and matches:", error.message);
    return NextResponse.json(
      { error: "Error creating round and matches" },
      { status: 500 },
    );
  }
}
