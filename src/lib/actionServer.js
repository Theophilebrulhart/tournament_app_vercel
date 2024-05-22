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

export async function addRound(round, tournamentId) {
    try{
        const res = await fetch('/api/add_tournamentRound', {
                method: 'POST', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ round, tournamentId}) 
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

export async function deleteMatchByTournamentId(matchId) {
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
