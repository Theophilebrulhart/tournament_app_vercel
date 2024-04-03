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
        <main>
            <h1>Add Team</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={team.name}
                    onChange={handleTeamChange}
                    required
                />
                <label htmlFor="level">Teams level:</label>
                <input
                    type="number"
                    id="level"
                    value={team.level}
                    onChange={handleTeamChange}
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </main>
    );
}
