"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { addTournament } from '@/lib/actionServer';
import { revalidatePath } from 'next/cache';

export default function CreateTournament() {
    const [tournament, setTournament] = useState({
        name: "",
        fieldNbr: 0,
        start: "",
        end: "",
    });

    const router = useRouter();
    

    const handleTournamentChange = (event) => {
        const { id, value } = event.target;
        setTournament(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("tournament", tournament);
        const response = await addTournament(tournament);
        if (response) {
            router.push(`/tournaments/${response.id}`);
        } else {
            console.error("Failed to create tournament");
        }
    };

    return (
            <form onSubmit={handleSubmit} className='flex flex-col items-center w-1/2 gap-10'>
                <div  className='flex justify-between  w-full'>
                    <label htmlFor="name">Name:</label>
                    <input
                     className='h-10 w-80 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="text"
                        id="name"
                        value={tournament.name}
                        onChange={handleTournamentChange}
                        required
                        />
                </div>
                <div  className='flex justify-between w-full'>
                    <label htmlFor="fieldNbr">Field Number:</label>
                    <input
                        className='h-10 w-20 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="number"
                        id="fieldNbr"
                        value={tournament.fieldNbr}
                        onChange={handleTournamentChange}
                        required
                        />
                </div>
                <div  className='flex justify-between  w-full'>
                    <label htmlFor="start">Start Date:</label>
                    <input
                    className='h-10 w-80 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="datetime-local"
                        id="start"
                        value={tournament.start}
                        onChange={handleTournamentChange}
                        required
                        />
                </div>
                <div  className='flex justify-between  w-full'>
                    <label htmlFor="end">End Date:</label>
                    <input
                    className='h-10 w-80 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'

                        type="datetime-local"
                        id="end"
                        value={tournament.end}
                        onChange={handleTournamentChange}
                        required
                        />
                </div>
                <div className=''>
                    <button type="submit" className='bg-blue-500 w-20 border-2 h-10 rounded-lg hover:border-blue-900'>Submit</button>
                </div>
            </form>
    );
}
