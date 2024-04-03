"use client";

import Link from 'next/link';
import { useState } from 'react';
import { addTeam, addTournament } from '@/lib/actionServer';

export default function CreateTeam({tournamentId}) {
    const [team, setTeam] = useState({
        tournaments : tournamentId,
        name: "",
        level: 0
    });
    

    const handleTeamChange = (event) => {
        const { id, value } = event.target;
        setTeam(prevState => ({
            ...prevState,
            [id]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("team", team);
        const response = await addTeam(team);
        if (response) {
            console.log("team created");
        } else {
            console.error("Failed to create tournament");
        }
    };

    return (
        <main className='flex flex-col items-center w-full gap-10 border-b-2 border-gray-600 pb-4'>
            <h1 className='text-xl'>Add Team</h1>
            <form onSubmit={handleSubmit} className='flex flex-col items-center w-full gap-10' > 
                <div className='flex justify-between  w-full'>
                    <label htmlFor="name">Name:</label>
                    <input
                        className='h-10 w-48 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="text"
                        id="name"
                        value={team.name}
                        onChange={handleTeamChange}
                        required
                        />
                </div>
                <div className='flex justify-between  w-full'>
                    <label htmlFor="level">Teams level:</label>
                    <input
                        className='h-10 w-48 text-black border-2 border-gray-300 rounded-md hover:border-blue-500'
                        type="number"
                        id="level"
                        value={team.level}
                        onChange={handleTeamChange}
                        required
                        />
                </div>
                
                <button type="submit" className='bg-blue-500 w-20 border-2 h-10 rounded-lg hover:border-blue-900'>Add team</button>
    
            </form>
        </main>
    );
}
