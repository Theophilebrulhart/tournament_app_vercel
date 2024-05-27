import React from "react";
import DisplayRound from "./displayRound";

export default function DisplayRounds({ tournament }) {
    const rounds = tournament.tournamentRounds; 
    const maxRound = tournament.tournamentRounds.length > 0 ? tournament.tournamentRounds[0].maxRound : 0;

    return (
        <div>
            <div className="flex items-center w-full gap-10 space-between">
                <div className="w-full flex justify-between gap-2">
                    {Array.from({ length: maxRound }, (_, roundIndex) => (
                        <div key={roundIndex} style={{ width: `calc(100% / ${tournament.fieldNbr})` }}>
                            <div>Round {roundIndex + 1}</div>
                            {rounds[roundIndex] &&
                                <DisplayRound round={rounds[roundIndex]} maxRound={maxRound} tournament={tournament} roundIndex={roundIndex}/>
                            }
                        </div>
                    ))}
                </div>
             </div>
        </div>
    );
}
