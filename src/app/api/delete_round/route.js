import prisma from "@/lib/prisma";
import { NextResponse } from "next/server"

export async function DELETE(request){
    try {
        const res = await request.json()
        const result = await prisma.tournamentRound.delete({
            where : {
                id : res
            }
        })
        return NextResponse.json({result})
    }
    catch (error) {
        return NextResponse.error({
            status: 400,
            message: error.message
        })
    }
}