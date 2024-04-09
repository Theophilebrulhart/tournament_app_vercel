import CreateTeam from "@/components/createTeamForm/createTeamForm";
import TeamCard from "@/components/teamCard/teamCard";
import { getTeam, getTournament } from "@/lib/getData";

export default async function SingleTournament({ params }) {
    const { id } = params;

    const tournament = await getTournament(id); // foutre dans un state => a voir 

    return (
        <div className="h-screen flex flex-col gap-10 items-center">

            <h1 className="text-4xl">
                {tournament && tournament.name}
            </h1>
            <div className="flex w-full p-10 h-full">
                <div className=" flex w-1/3 flex-col h-full gap-10">
                    <CreateTeam  tournamentId={id}/>
                    <div className="flex justify-between w-full p-4">
                        <div>Team</div>
                        <div>Level</div>
                    </div>
                    <div className="flex flex-col gap-8 items-center justify-between w-full p-4">
                        {tournament?.team && tournament.team.map((team, index) => (
                           <TeamCard key={index} team={team} index={index}/>
                            ))}
                    </div>
                </div>
                <div className="flex w-2/3  h-full ">

                </div>
            </div>
        </div>
    )
}