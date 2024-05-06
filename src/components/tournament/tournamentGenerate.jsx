"use client";
import { generateTournamentTree } from "@/hooks/generateTournamentTree";
import { useState } from "react";

export default function TournamentGenerate({ tournament, style }) {
    const [matchsNbr, setMatchsNbr] = useState(5);

    const handleGenerateTournament = () => {
        generateTournamentTree(tournament, matchsNbr);
    };

    return (
        <div style={{...style}} className="flex gap-2">
        <button onClick={handleGenerateTournament} className="flex gap-4 border-2 p-2 rounded-lg bg-blue-500/80 hover:bg-blue-700" >
            Generate Tournament
        </button>
        <input 
            type="number" 
            value={matchsNbr} 
            onChange={(e) => setMatchsNbr(parseInt(e.target.value))} 
            className="border-2 rounded-lg w-8 text-black"
            placeholder="Enter number of matches" 
            style={{ 
                WebkitAppearance: "none", /* Pour Safari/Chrome */
                MozAppearance: "textfield", /* Pour Firefox */
                appearance: "textfield" /* Pour autres navigateurs */
            }} 
            />
        </div>
    );
}
