"use client"
import { useState } from "react";
import { Tournament } from "@/hooks/generateTournamentTree";
import DeleteTournamentTree from "../tournamentForm/deleteTournamentTree";
import { getTournament } from "@/lib/getData";
import { addMatch } from "@/lib/actionServer";
export default function TournamentTree({tournament}) {
  
  const [matchsNbr, setMatchsNbr] = useState(5);
  const [tournamentTree, setTournamentTree] = useState(null);
  const [deleteTournamentTree, setDeleteTournamentTree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [matchs, setMatchs] = useState([tournament.matches]);

    const pushMatchToDB = async (tournamentTreeTmp) => {
      setIsLoading(true);
      const matches = tournamentTreeTmp.rounds[tournamentTreeTmp.rounds.length - 1];
      const currentRound = tournamentTreeTmp.rounds.length;
      const promises = matches.map(async (match) => {
          const res = await addMatch(match[0].id, match[1].id, tournamentTreeTmp.tournamentId, currentRound);
          if (res.success){
            console.log("match added");
          }
          else{
            console.log("match not added", match, res.error);
            return ;
          }
      });
      await Promise.all(promises);
      setIsLoading(false);
      return true;
  }

    const generateTournamentRound = async () => {
      if (!tournamentTree) return;
      console.log("generate nwe round")
      const what = tournamentTree.generateRound();
      setTournament(getNewTournament())
    };

    const handleGenerateTournament = async () => {
      if (isLoading) return;
      if (tournament.matches.length > 0  || (tournamentTree && tournamentTree.rounds.length > 0)){
        setDeleteTournamentTree(true);
        return;
      }
      const tournamentTreeTmp = new Tournament(tournament.team, matchsNbr, tournament.id);
      const res = await pushMatchToDB(tournamentTreeTmp);
      if (res)
        setTournamentTree(tournamentTreeTmp);
        setMatches(tournamentTreeTmp.rounds[tournamentTreeTmp.rounds.length - 1]);
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