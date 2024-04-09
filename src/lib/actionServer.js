import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";


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

export async function addTeam(previousState, formaData) {
    const {name, level, tournamentId} = Object.fromEntries(formaData);

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
