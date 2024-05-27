"use client"

import { updateMatchScore } from "@/lib/actionServer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function MatchCard({ match }) {

    console.log("team in match", match)
    const matchDate = new Date(match.startDate);
    const formattedTime = matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const team1 = match.rankTeam1 < match.rankTeam2 ? match.teams[0] : match.teams[1];
    const team2 = match.rankTeam1 < match.rankTeam2 ? match.teams[1] : match.teams[0];
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [state, formAction] = useFormState(updateMatchScore, undefined);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    useEffect(() => {
        setIsLoading(false);
        state?.success && router.refresh();
    }, [state?.success, router]);

    const handleTeam1Score = (e) => {
        setTeam1Score(e.target.value);
    }

    const handleTeam2Score = (e) => {
        setTeam2Score(e.target.value);
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-md">
            <div className="mb-4 text-center">
                <div className="text-xl font-semibold text-gray-600">Field {match.field}</div>
                <div className="text-gray-600">At {formattedTime}</div>
            </div>
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="text-lg text-gray-600 font-medium">{match.rankTeam1}</div>
                    <div className="text-lg text-gray-600 font-medium">{team1.name}</div>
                    {match.scoreTeam1 > 0 ? 
                    (<div className="text-lg text-gray-600 font-medium">{match.scoreTeam1}</div>
                    ) : (
                    <input 
                        type="number" 
                        min="0"
                        className="border text-gray-600 border-gray-300 rounded-lg w-16 p-1 text-center" 
                        value={team1Score}
                        onChange={handleTeam1Score}
                    />
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <div className="text-lg text-gray-600 font-medium">{match.rankTeam2}</div>
                    <div className="text-lg text-gray-600 font-medium">{team2.name}</div>
                    {match.scoreTeam2 > 0 ? 
                    (<div className="text-lg text-gray-600 font-medium">{match.scoreTeam2}</div>
                    ) : (
                    <input 
                        type="number" 
                        min="0"
                        className="border text-gray-600 border-gray-300 rounded-lg w-16 p-1 text-center" 
                        value={team2Score}
                        onChange={handleTeam2Score}
                    />
                    )}
                </div>
                {match.scoreTeam1 > 0 && match.scoreTeam2 > 0 ? (
                    <div className="text-center text-gray-600">Match is over</div>
                ) : (
                    <form action={formAction} className="flex flex-col gap-4">
                        <input type="hidden" name="team1Score" value={team1Score} />  
                        <input type="hidden" name="team2Score" value={team2Score} />  
                        <input type="hidden" name="matchId" value={match.id} /> 
                        <input type="hidden" name="team1Id" value={team1.id} />
                        <input type="hidden" name="team2Id" value={team2.id} />
                        <button onClick={()=> setIsLoading(true)} className="border-2 p-2 rounded-lg bg-blue-800 hover:bg-blue-700">
                        {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div> : "Save"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
