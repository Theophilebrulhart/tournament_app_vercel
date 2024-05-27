import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(request) {
    try {
        const res = await request.json();

        const result = await prisma.teamInMatch.update({
            where: {
                id: res.teamId,
            },
            data: {
                score : parseInt(res.score, 10),
                winner: res.winner,
                loser: res.loser,
            },
        });

        return NextResponse.json({ result });
    }
    catch (error) {
        console.error('Error updating team in match:', error.message);
        return NextResponse.json({ error: 'Error updating team in match' }, { status: 500 });
    }
}