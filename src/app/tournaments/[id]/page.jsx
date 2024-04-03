import CreateTeam from "@/components/createTeamForm/createTeamForm";
import { getTeam, getTournament } from "@/lib/getData";

export default async function SingleTournament({ params }) {
    const { id } = params;

    const tournament = await getTournament(id);

    return (
        <div>
           {tournament && tournament.name}
           {tournament?.team && tournament.team.map((team) => (
            <div key={team.id} className="text-white text-xl bg-red-300">{team.name}</div>
           )
           )}
           <CreateTeam  tournamentId={id}/>
        </div>
    )
}