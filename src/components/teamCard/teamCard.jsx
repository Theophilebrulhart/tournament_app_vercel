"use client";
import { deleteTeam } from "@/lib/actionServer";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { usePathname, useRouter } from "next/navigation";

export default function TeamCard  ({ team, index }) {

    const [state, formAction] = useFormState(deleteTeam, undefined);
    const router = useRouter();
    
    
    useEffect(() => {
        state?.success && router.refresh();
    }, [state?.success, router]);


    return (
        <div key={team.id} className="flex w-full justify-between border-b-2 border-gray-600">
        <div className="text-xl">{index + 1 + "."} {team.name}</div>
        <form  action={formAction} className="flex gap-4">
            <input type="hidden" name="teamId" value={team.id} />
            <button className="cursor-pointer">Delete</button>
            {state && state.error && <div>{state.error}</div>}
        </form>

        <div className="text-xl">{team.level}</div>
    </div>
    )
}