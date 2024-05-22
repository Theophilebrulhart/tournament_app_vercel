import { getMatchesByTournamentId } from "@/lib/getData";

export default async function DisplayRounds({ tournamentId }) {
    console.log("Fetching matches for tournament ID:", tournamentId);
    const allMatches = await getMatchesByTournamentId(tournamentId);
    const sortedMatches = allMatches.sort((a, b) => a.tournamentRound - b.tournamentRound);
    console.log("sortedMatches", sortedMatches);

    return (
        <div>
            {sortedMatches.map((match) => (
                <div >
                    
                    <h2>un match</h2>
                </div>
            ))}
        </div>
    );
}
