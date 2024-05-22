import React from "react";

export default function DisplayRounds({ tournament }) {
    const rounds = tournament.tournamentRounds; 

    return (
        <div>
            {rounds.map((round, roundIndex) => (
                <div key={roundIndex}>
                    <h2>Round {roundIndex + 1}</h2>
                    <div>
                        {round.matches.map((match, matchIndex) => (
                            console.log("match", match),
                            <div key={matchIndex}>
                                <div>{match.teams[0].name}</div>
                                <div>{match.teams[1].name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
