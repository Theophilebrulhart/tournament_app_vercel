export async function addTournament(previousState, formData) {

    const {name, fieldNbr, start, end} = Object.fromEntries(formData);

    try{
        const res = await fetch('/api/add_tournament', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, fieldNbr, start, end}) })
            return {success : (await res.json()).result};
            
    } catch (error){
        console.error(error)
        return {error : "could not create tournament"}
    }
}

export async function addTeam(previousState, formData) {
    const {name, level, tournamentId} = Object.fromEntries(formData);

    try{
        const res = await fetch('/api/add_team', {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, level, tournamentId}) })

            return {success : ( await res.json()).result};
            
    } catch (error){
        console.error(error)
    }
}

export async function addMatch(team1Id, team2Id, tournamentId, tournamentRound) {
    try{
        const res = await fetch('/api/add_match', {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ team1Id, team2Id, tournamentId, tournamentRound}) 
            })
            return {success : ( await res.json()).result};
    } catch (error){
        console.error(error)
    }
}

export async function addRound(round, tournamentId, maxRound, timePlan) {
    console.log("roudadeeee", round[0].teams[0].rank)
    try{
        const res = await fetch('/api/add_tournamentRound', {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ round, tournamentId, maxRound, timePlan}) 
            })
            console.log("res apres add round", res)
            return {success : ( await res.json()).result};
    } catch (error){
        console.error(error)
    }
}

export async function deleteTeam(previousState, formData) {

    const { teamId } = Object.fromEntries((formData));

    try {
        const res = await fetch('/api/delete_team', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(teamId)
        });

        if (!res.ok) {
            throw new Error('Failed to delete team');
        }
        const data = await res.json();
        return {success : data.result};
    } catch (error) {
        console.error(error);
        return {error : "team could'nt be deleted"};
    }
}


export async function deleteTournament(previousState, formData) {

    const { tournamentId } = Object.fromEntries((formData));

    try {
        const res = await fetch('/api/delete_tournament', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tournamentId)
        });

        if (!res.ok) {
            throw new Error('Failed to delete tournament');
        }
        const data = await res.json();
        return {success : data.result};
    } catch (error) {
        console.error(error);
        return {error : "tournament could'nt be deleted"};
    }
}

export async function deleteMatch(matchId) {
    console.log("iciiii")
    try {
        const res = await fetch('/api/delete_match', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchId)
        });

        if (!res.ok) {
            throw new Error('Failed to delete match');
        }
        const data = await res.json();
        return {success : data.result};
    } catch (error) {
        console.error(error);
        return {error : "match could'nt be deleted"};
    }
}

export async function deleteMatchsByTournamentId(matchId) {
    try {
        const res = await fetch('/api/delete_match_by_tournament_id', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(matchId)
        });

        if (!res.ok) {
            throw new Error('Failed to delete match');
        }
        const data = await res.json();
        return {success : data.result};
    } catch (error) {
        console.error(error);
        return {error : "match could'nt be deleted"};
    }
}

export async function deleteRoundsByTournamentId(tournamentId) {
    try {
        const res = await fetch('/api/delete_round_by_tournament_id', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tournamentId)
        });

        if (!res.ok) {
            throw new Error('Failed to delete rounds');
        }
        const data = await res.json();
        return {success : data.result};
    } catch (error) {
        console.error(error);
        return {error : "rounds could'nt be deleted"};
    }
}

export async function deleteTeamsInMatchByTournamentId(tournamentId) {
    try {
        const res = await fetch("/api/delete_teams_in_match_by_tournament_id", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tournamentId)
        });
        if (!res.ok) {
            throw new Error("Failed to delete teamsInMatch");
        }
        const data = await res.json();
        return {success: data.result};
    }
    catch (error) {
        console.error(error);
        return {error: "teamsInMatch could'nt be deleted"};
    }
} 

export async function updateMatchScore(previousState, formData) {
    const {matchId, team1Score, team2Score, team1Id, team2Id } = Object.fromEntries(formData);
    console.log("team1Score", team1Score, "team2Score", team2Score, "team1Id", team1Id, "team2Id", team2Id)
    const winner = team1Score > team2Score ? team1Id : team2Id;
    const loser = team1Score < team2Score ? team1Id : team2Id;
    console.log("winner", winner, "loser", loser)
    
    try {
        const res = await fetch('/api/update_match', {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({matchId, team1Score, team2Score, winner, loser})
        });

        if (!res.ok) {
            throw new Error('Failed to update match score');
        }
        const data = await res.json();
        return {success : data.result};
    } catch (error) {
        console.error(error);
        return {error : "match score could'nt be updated"};
    }
}
