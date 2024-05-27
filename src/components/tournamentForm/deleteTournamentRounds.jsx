"use client"
import { deleteManyMatches, deleteManyTeamsInMatch, deleteRound } from "@/lib/actionServer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteTournamentRounds({tournament, setDeleteRound, roundIndex}) {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const deleteData = async () => {
        setIsLoading(true);
        
            for (let i = roundIndex + 1; tournament.tournamentRounds && tournament.tournamentRounds[i]; i++) {
                console.log("round", tournament.tournamentRounds[i], "index", i)
                const res = await deleteManyTeamsInMatch({tournamentRoundsId: tournament.tournamentRounds[i].id});
                if (res.success) {
                    console.log("All teamsInMatch deleted")
                    const res = await deleteManyMatches({tournamentRoundsId: tournament.tournamentRounds[i].id});
                    if (res.success) {
                        console.log("All matches deleted")
                        const res = await deleteRound(tournament.tournamentRounds[i].id);
                        if (res.success) {
                            console.log("round in match deleted")
                        }
                        else {
                            console.log("round couldnt be deleted", res.error)
                        }
                    }

                    else {
                        console.log("matches couldnt be deleted", res.error)
                    }
                }
                else {
                    console.log("teams in match couldnt deleted", res.error)
                }
            }
            
        setDeleteRound(false);
        setIsLoading(false);
        router.refresh();
    }

    return (
           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/80">
                <div className="bg-blue-500/40 flex flex-col gap-3 p-8 rounded-lg">
                    <h3>To generate a new round here, you first have to delete all next rounds. Do you want to do so ?</h3>
                    <div className="flex justify-evenly">
                    {isLoading ? (<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div> 
                        ):(
                        <>
                            <button onClick={() => setDeleteRound(false)} className="cursor-pointer border-2 p-2 rounded-lg bg-blue-500/80 hover:bg-blue-700">No</button>
                            <button onClick={(deleteData)}className="cursor-pointer border-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-700">Yes</button>
                        </>
                        )}
                    </div>
                </div>
        </div>
    )
}