"use client";

import { addTeam } from '@/lib/actionServer';
import { useFormState } from "react-dom";
import {  useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export default function CreateTeam({tournamentId}) {
   
    const [state, formAction] = useFormState(addTeam, undefined);
    const router = useRouter();
    const [isLoaded, setIsLoaded] = useState(false);
    
    
    useEffect(() => {
        setIsLoaded(false);
        state?.success && router.refresh();
    }, [state?.success, router]);



    return (
        <main className='flex flex-col items-center w-full gap-10 border-b-2 border-gray-600 pb-4'>
            <h1 className='text-xl'>Add Team</h1>
            <form action={formAction} className='flex flex-col items-center w-full gap-10' > 
                <div className='flex justify-between  w-full'>
                    <label htmlFor="name">Name:</label>
                    <input
                        className='h-10 w-32 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="text"
                        id="name"
                        name="name"
                        required
                        />
                </div>
                <div className='flex justify-between  w-full'>
                    <label htmlFor="level">Teams level:</label>
                    <input
                        className='h-10 w-8 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="number"
                        id="level"
                        name="level"
                        required
                        />
                        <input type="hidden" name="tournamentId" value={tournamentId} />
                </div>
              
                <button type="submit"  onClick={() => setIsLoaded(true)} className='bg-blue-500 w-20 border-2 h-10 rounded-lg hover:border-blue-900'>{isLoaded ? <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div> : "add"}</button>
    
            </form>
        </main>
    );
}
