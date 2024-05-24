import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const res = await request.json();

    const result = await prisma.match.update({
      where: {
        id: res.matchId,
      },
      data: {
        scoreTeam1: parseInt(res.team1Score, 10),
        scoreTeam2: parseInt(res.team2Score, 10),
        winner: res.winner,
        loser: res.loser,
      },
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error updating match:', error.message);
    return NextResponse.json({ error: 'Error updating match' }, { status: 500 });
  }
}
