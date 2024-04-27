"use client"
import { deleteTournament } from "@/lib/actionServer";
import { useFormState } from "react-dom";

export default function DeleteTournament({id}) {

    const [state, formAction] = useFormState(deleteTournament, undefined)

    return (
        <form  action={formAction} className="flex gap-4">
                <input type="hidden" name="tournamentId" value={id} />
                <button className="cursor-pointer">Delete</button>
                {state && state?.error && <div>{state.error}</div>}
        </form>
    )
}