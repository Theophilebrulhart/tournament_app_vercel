"use client"
import { deleteMatch, deleteMatchByTournamentId, deleteTournament } from "@/lib/actionServer";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function DeleteTournamentTree({tournament, setDeleteTournamentTree, setTournamentTree}) {

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const deleteData = async () => {
        console.log("tournament in deleteToutnamenrtree", tournament.matches)
        if (tournament && tournament.matches) {
            setIsLoading(true);
            
                const res = await deleteMatchByTournamentId(tournament.id);
                console.log("res", res)
                if (res.success) {
                    console.log("matches deleted")
                }
                else {
                    console.log("matches not deleted", res.error)
                }
            }
        setDeleteTournamentTree(false);
        setTournamentTree(null);
        setIsLoading(false);
        router.refresh();
    }

    return (
           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/80">
                <div className="bg-blue-500/40 flex flex-col gap-3 p-8 rounded-lg">
                    <h3>To generate a new tournament tree, you first have to delete all current value. Do you want to do so ?</h3>
                    <div className="flex justify-evenly">
                    {isLoading ? (<div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div> 
                        ):(
                        <>
                            <button onClick={() => setDeleteTournamentTree(false)} className="cursor-pointer border-2 p-2 rounded-lg bg-blue-500/80 hover:bg-blue-700">No</button>
                            <button onClick={(deleteData)}className="cursor-pointer border-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-700">Yes</button>
                        </>
                        )}
                    </div>
                </div>
        </div>
    )
}