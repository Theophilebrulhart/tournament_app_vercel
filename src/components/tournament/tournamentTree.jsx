"use client"
import { useState } from "react";
import  { generateRound, generateTimePlan, pushRoundToDb } from "@/hooks/generateTournamentTree";
import DeleteTournamentTree from "../tournamentForm/deleteTournamentTree";
import { useRouter } from "next/navigation";

export default function TournamentTree({tournament}) {
  const [matchsNbr, setMatchsNbr] = useState(5);
  const [deleteTournamentTree, setDeleteTournamentTree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

    const handleGenerateTournament = async () => {
      if (isLoading) return;
      if (tournament.tournamentRounds && tournament?.tournamentRounds.length > 0 ) {
        setDeleteTournamentTree(true);
        return;
      }
      const timePlan =  generateTimePlan(tournament.start, tournament.end, tournament.fieldNbr, tournament.teams.length, matchsNbr);
      if (!timePlan.length) return;
      const round = generateRound(tournament.teams, timePlan, tournament.fieldNbr);
      setIsLoading(true);
      const res = await pushRoundToDb(tournament.id,round, matchsNbr, timePlan);
      if (res)
      router.refresh();
      setIsLoading(false);  
    };

    return (
    <>
    { deleteTournamentTree && 
        <DeleteTournamentTree 
          tournament={tournament} 
          setDeleteTournamentTree={setDeleteTournamentTree}
          style={{position : "absolute", top : 0, right:50}}
       />}
    <div className="flex flex-col gap-10 w-full">
        <div className="flex gap-2">
          <button onClick={handleGenerateTournament} className="flex gap-4 border-2 p-2 rounded-lg bg-blue-500/80 hover:bg-blue-700" >
          {isLoading ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div> : "Generate Tournament Tree"}
          </button>
          <input 
              type="number" 
              value={matchsNbr} 
              onChange={(e) => setMatchsNbr(parseInt(e.target.value))} 
              className="border-2 rounded-lg w-8 text-black"
              placeholder="Enter number of matches" 
              />
        </div>
    </div>
    </>
  )
}