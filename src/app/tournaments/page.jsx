import TournamentCard from "@/components/tournament/tournamentCard";
import { getTournaments } from "@/lib/getData";
import Link from "next/link";

export default async function Tournaments() {

    const tournaments = await getTournaments();

    return (
        <div className="flex flex-col h-screen mx-10 gap-4">
            <div className="flex justify-center"> 
                <h1 className="text-3xl"> Tournaments</h1>
            </div>
            <div className="flex justify-end border-b-2 border-blue-900 pb-2"> 
            <Link href={"/create_tournament"} className="bg-white p-2 rounded-md text-black hover:text-gray-500">
                 + Create a new tournament
            </Link>
            </div>
            <div className="flex gap-20 flex-wrap overflow-auto mb-4 p-2">

            {tournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament}/>
                ))}
            </div>
        </div>
    )
}