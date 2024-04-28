"use client";

import { deleteTeam } from "@/lib/actionServer";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";

export default function TeamCard  ({ team, index }) {

    const [state, formAction] = useFormState(deleteTeam, undefined);
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    
    useEffect(() => {
        setIsLoaded(false);
        state?.success && router.refresh();
    }, [state?.success, router]);


    return (
        <div key={team.id} className="flex relative justify-center items-center w-full py-3 bg-gray-100/80 rounded-4 border-gray-600 rounded-lg h-24">
            <div className="text-xl bg-blue-500 border-2 absolute -top-2 -left-2 px-2 py-1 rounded-tr-md rounded-bl-md">{index + 1 + "."}</div>
            {isLoaded ?
                 (<div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div> 
                 ):(
            <div className="w-full h-full justify-center">
                <div className=" text-black flex justify-center">Level : {team.level}</div>
                <div className=" h-full text-black flex justify-center items-center">{team.name}</div>
            </div>)}

            <form  action={formAction} className="flex gap-4 ">
                <input type="hidden" name="teamId" value={team.id} />
                <button onClick={() => setIsLoaded(true)} className="cursor-pointer bg-red-500 border-2 absolute -top-2 -right-2 px-2 py-1 rounded-tr-md rounded-bl-md">
                    X
                </button>
                {state && state.error && <div>{state.error}</div>}
            </form>
            
        </div>
    )
}
