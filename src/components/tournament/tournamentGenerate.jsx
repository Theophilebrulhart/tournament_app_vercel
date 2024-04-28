"use client";

import { generateTournamentTree } from "@/hooks/useGenerateTournament";

export default function TournamentGenerate({tournament}) {
    return (
        <button
            style={{ position: "absolute", top: 0, left: 50 }} 
            className="bg-blue-500/50 flex gap-4 border-2 p-2 rounded-lg hover:bg-blue-700"
            onClick={generateTournamentTree(tournament)}
        >
            Generate
        </button>
    );
    
}
