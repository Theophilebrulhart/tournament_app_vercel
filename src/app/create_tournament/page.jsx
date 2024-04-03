import CreateTournamentForm from "@/components/createTournamentForm/createTournamentForm";


export default function CreateTournament() {

    return (
        <div className="h-screen flex flex-col items-center gap-10">
            <h1 className="text-4xl">Créer un nouveau tournoi</h1>
            <CreateTournamentForm />
        </div>
    );
}
