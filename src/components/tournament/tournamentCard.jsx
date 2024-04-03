import Link from "next/link"

export default function TournamentCard ({ tournament }) {

    console.log("tournament", tournament)
    return (
        <Link 
            className=" w-96  flex justify-between p-4 items-center flex-col h-52 border-2 border-gray-300 rounded-md hover:border-blue-500"
            href={`/tournaments/${tournament.id}`}>
            <div className="text-2xl">{tournament.name}</div>
            <div className="flex">
                <div>{tournament.start.toLocaleDateString() }</div>
                <div> - </div>
                <div>{tournament.end.toLocaleDateString()}</div>
            </div>
            <div>Nombre d'équipe :  {tournament.team.length}</div>
        </Link>
    )
};