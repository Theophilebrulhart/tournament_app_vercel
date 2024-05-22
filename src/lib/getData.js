import prisma from './prisma';

export async function getTournaments() {

    try
    {
        const tournaments = await prisma.tournament.findMany({
            include: {
                team : {}
            }
        });
        return tournaments;
    }
    catch (error)
    {
        console.error(error);
        return null;
    }
}

export async function getTournament(id) {
    try {
        const tournament = await prisma.tournament.findUnique({
            where: {
                id: id
            },
            include: {
                team : {},
                matches: {}
            },
        });
        return tournament;
    } catch (error) {
        console.error('Error retrieving tournament:', error.message);
        return null;
    }
}

