"use client";

import { useRouter } from "next/navigation";
import { useFormState } from "react-dom";
import { addTournament } from '@/lib/actionServer';
import { useEffect } from "react";

export default function CreateTournament() {
    const [state, formAction] = useFormState(addTournament, undefined);

    const router = useRouter();
    
    useEffect(() => {
        console.log("state.succes ", state?.succes)
        state?.success && router.push("/tournaments");
    }, [state?.success, router]);

    return (
            <form action={formAction} className='flex flex-col items-center w-1/2 gap-10'>
                <div  className='flex justify-between  w-full'>
                    <label htmlFor="name">Name:</label>
                    <input
                     className='h-10 w-80 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="text"
                        id="name"
                        name="name"
                        required
                        />
                </div>
                <div  className='flex justify-between w-full'>
                    <label htmlFor="fieldNbr">Field Number:</label>
                    <input
                        className='h-10 w-20 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="number"
                        id="fieldNbr"
                        name="fieldNbr"
                        required
                        />
                </div>
                <div  className='flex justify-between  w-full'>
                    <label htmlFor="start">Start Date:</label>
                    <input
                    className='h-10 w-80 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="datetime-local"
                        id="start"
                        name="start"
                        required
                        />
                </div>
                <div  className='flex justify-between  w-full'>
                    <label htmlFor="end">End Date:</label>
                    <input
                    className='h-10 w-80 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'

                        type="datetime-local"
                        id="end"
                        name="end"
                        required
                        />
                </div>
                <div className=''>
                    <button type="submit" className='bg-blue-500 w-20 border-2 h-10 rounded-lg hover:border-blue-900'>Submit</button>
                    {state && state?. error && <div>{state.error}</div>}
                </div>
            </form>
    );

}