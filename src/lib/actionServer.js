
export async function addTournament(tournament) {

    try{
        const res = await fetch('/api/add_tournament', {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(tournament) })

            return (await res.json()).result;
            
    } catch (error){
        console.error(error)
    }
}

export async function addTeam(team) {

    try{
        const res = await fetch('/api/add_team', {
            method: 'POST', 
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(team) })

            return (await res.json()).result;
            
    } catch (error){
        console.error(error)
    }
}