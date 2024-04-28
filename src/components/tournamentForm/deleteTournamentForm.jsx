"use client"
import { deleteTournament } from "@/lib/actionServer";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function DeleteTournament({id, style}) {
    const [openPopup, setOpenPopup] = useState(false)

    const [state, formAction] = useFormState(deleteTournament, undefined)

    return (
        <>
        <button onClick={() => setOpenPopup(true)} className="flex gap-4 border-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-700" style={{...style}}>
            Delete
        </button>
        {openPopup && (
           <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/80">
           <div className="bg-blue-500/40 flex flex-col gap-3 p-8 rounded-lg">
                <h3>Do you really want to delete the tournament ?</h3>
                <div className="flex justify-evenly">

                <form  action={formAction} >
                    <input type="hidden" name="tournamentId" value={id} />
                    <button className="cursor-pointer border-2 p-2 rounded-lg bg-red-500/80 hover:bg-red-700">Yes</button>
                    {state && state?.error && <div>{state.error}</div>}
                </form>
                <button onClick={() => setOpenPopup(false)} className="cursor-pointer border-2 p-2 rounded-lg bg-blue-500/80 hover:bg-blue-700">No</button>
                </div>
            </div>
        </div>
            )}
        </>
    )
}