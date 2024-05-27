import prisma from './prisma';

export async function getTournaments() {
    try
    {
        const tournaments = await prisma.tournament.findMany({
            include: {
                teams : {}
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
                teams : {
                    include: {
                        matches : {
                            include: {
                                teams : {},
                                teamsInMatch : {},
                            }
                        }
                    }
                },
                tournamentRounds : {
                    include: {
                        matches : {
                            include: {
                                teams : {},
                                teamsInMatch : {},
                            }
                        }
                    }
                },
            }
        
        });
        return tournament;
    } catch (error) {
        console.error('Error retrieving tournament:', error.message);
        return null;
    }
}

export async function getMatchesByTournamentId(tournamentId) {
    console.log("salut")
    try {
        const matches = await prisma.match.findMany({
            where: {
                tournamentId: tournamentId
            },
            include: {
                teams : {}
            }
        });
        console.log("match id geetdata", matches)
        return matches;
    } catch (error) {
        console.error('Error retrieving matches:', error.message);
        return null;
    }
}

