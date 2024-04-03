import CreateTeam from "@/components/createTeamForm/createTeamForm";
import { getTeam, getTournament } from "@/lib/getData";

export default async function SingleTournament({ params }) {
    const { id } = params;

    const tournament = await getTournament(id);

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
                            <div key={team.id} className="flex w-full justify-between border-b-2 border-gray-600">
                                <div className="text-xl">{index + 1 + "."} {team.name}</div>
                                <div className="text-xl">{team.level}</div>
                            </div>
                            ))}
                    </div>
                </div>
                <div className="flex w-2/3  h-full ">

                </div>
            </div>
        </div>
    )
}