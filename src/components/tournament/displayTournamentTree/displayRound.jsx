"use client"

import { generateRound, pushRoundToDb } from "@/hooks/generateTournamentTree";
import DisplayMatch from "./matchCard";
import { useRouter } from "next/navigation";
import MatchCard from "./matchCard";

export default function DisplayRound({ round, maxRound, tournament, index }) {
    const router = useRouter();
    const timePlan = round.timePlan;

    
    
    const generateTournamentRound = async (timePlan) => {
        console.log("generate nwe round")
        const newRound = generateRound(tournament.teams, round.timePlan, tournament.fieldNbr);
        const res = await pushRoundToDb(tournament.id, newRound, maxRound, round.timePlan);
        if (res) {
            router.refresh();
        }
      };

      const matches = round.matches.sort((a, b) => {
        return (a.rankTeam1 + a.rankTeam2) - (b.rankTeam1 + b.rankTeam2);
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