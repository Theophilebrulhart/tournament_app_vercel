"use client"

import { generateRound, pushRoundToDb } from "@/hooks/generateTournamentTree";
import { useRouter } from "next/navigation";
import MatchCard from "./matchCard";

export default function DisplayRound({ round, maxRound, tournament, index }) {
    const router = useRouter();
    const timePlan = round.timePlan;
    
    const generateTournamentRound = async (timePlan) => {
        console.log("generate nwe round", tournament.teams)
        const newRound = generateRound(tournament.teams, round.timePlan, tournament.fieldNbr);
        const res = await pushRoundToDb(tournament.id, newRound, maxRound, round.timePlan);
        if (res) {
            router.refresh();
        }
      };

    const matches = round.matches.sort((a, b) => {
    if ((a.teamsInMatch[0].rank + a.teamsInMatch[1].rank) === (b.teamsInMatch[0].rank + b.teamsInMatch[1].rank))
        return a.field - b.field;
    return (a.teamsInMatch[0].rank + a.teamsInMatch[1].rank) - (b.teamsInMatch[0].rank + b.teamsInMatch[1].rank);
    });

    return (
        <div className="bg-red-500/10 flex flex-col gap-4">
            {matches.map((match, matchIndex) => (
                <div key={matchIndex}>
                    <MatchCard key={matchIndex} match={match} />
                </div>
            ))}
            <button onClick={generateTournamentRound} className="border-2 p-2 rounded-lg bg-blue-800 hover:bg-blue-700">Generate new round</button>
        </div>
    )
}