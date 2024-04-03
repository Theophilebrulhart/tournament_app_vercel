import { getTournaments } from "@/lib/getData";
import Link from "next/link";

export default async function Tournaments() {

    const tournaments = await getTournaments();

    return (
        <div>
            <h1>Tournaments</h1>
            {tournaments.map((tournament) => (
                <Link href={`/tournaments/${tournament.id}`} key={tournament.id} >
                    <div>{tournament.name}</div>
                </Link>
            ))}
            <Link href={"/create_tournament"}>Create a new tournament</Link>
        </div>
    )
}