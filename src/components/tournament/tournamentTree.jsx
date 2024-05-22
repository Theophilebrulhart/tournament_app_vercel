"use client"
import { useState } from "react";
import  { generateRound } from "@/hooks/generateTournamentTree";
import DeleteTournamentTree from "../tournamentForm/deleteTournamentTree";
import { useRouter } from "next/navigation";
import { addRound } from "@/lib/actionServer";

export default function TournamentTree({tournament}) {
  const [matchsNbr, setMatchsNbr] = useState(5);
  const [tournamentTree, setTournamentTree] = useState(null);
  const [deleteTournamentTree, setDeleteTournamentTree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


    const pushRoundToDb = async (round) => {
      console.log("on push en db", round)
      setIsLoading(true);
          const res = await addRound(round, tournament.id);
          if (res.success){
            console.log("round added");
          }
          else{
            console.log("match not added", res.error);
            return ;
          }
      router.refresh();
      setIsLoading(false);
      return true;
  }

    const generateTournamentRound = async () => {
      console.log("generate nwe round")
      const what = tournamentTree.generateRound();
      setTournament(getNewTournament())
    };

    const handleGenerateTournament = async () => {
      if (isLoading) return;
      if (tournament.tournamentRound && tournament?.tournamentRound.length > 0 ) {
        setDeleteTournamentTree(true);
        return;
      }
      const round = generateRound(tournament.teams, matchsNbr, tournament.id);
      const res = await pushRoundToDb(round);
    };

    return (
    <>
    { deleteTournamentTree && 
        <DeleteTournamentTree 
          tournament={tournament} 
          setDeleteTournamentTree={setDeleteTournamentTree}
          setTournamentTree={setTournamentTree}
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
        {/* { tournamentTree || tournament.tournamentRound && <button onClick={generateTournamentRound} className="border-2 p-2 rounded-lg bg-blue-500/80 hover:bg-blue-700">Generate new round</button>} */}
        </div>
      <div className="flex items-center w-full gap-10 space-between">
        <div className="w-24">
          horaire
        </div>
        <div className=" w-full flex justify-between gap-2">
            {Array.from({ length: tournament.fieldNbr }, (_, index) => (
              <div key={index} style={{ width: `calc(100% / ${tournament.fieldNbr}) `}}>Field {index + 1}</div>
              ))}
        </div>
      </div>
    </div>
    </>
  )
}