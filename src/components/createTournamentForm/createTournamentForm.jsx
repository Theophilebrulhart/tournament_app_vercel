"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { addTournament } from '@/lib/actionServer';

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
        <main>
            <Link href={'/tournaments'}>All Tournaments</Link>
            <h1>Add Tournament</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    value={tournament.name}
                    onChange={handleTournamentChange}
                    required
                />
                <label htmlFor="fieldNbr">Field Number:</label>
                <input
                    type="number"
                    id="fieldNbr"
                    value={tournament.fieldNbr}
                    onChange={handleTournamentChange}
                    required
                />
                <label htmlFor="start">Start Date:</label>
                <input
                    type="date"
                    id="start"
                    value={tournament.start}
                    onChange={handleTournamentChange}
                    required
                />
                <label htmlFor="end">End Date:</label>
                <input
                    type="date"
                    id="end"
                    value={tournament.end}
                    onChange={handleTournamentChange}
                    required
                    />
                <button type="submit">Submit</button>
            </form>
        </main>
    );
}
