import { addMatch } from "@/lib/actionServer";

export class Tournament {
    constructor(teams, nbrMatchs, tournamentId) {
        console.log("initialize tournament with ", nbrMatchs, " matchs ")
        this.teams = this.initializeTeamsSeedLevel(teams);
        this.nbrMatchs = nbrMatchs;
        this.tournamentId = tournamentId;
        this.currentMatchCount = 0;
        this.rounds = [];
        this.generateRound();
    }

    // Initialiser les équipes et les niveaux de seed
    initializeTeamsSeedLevel(teams) {
        teams.forEach((team) => {
            team.seed = Math.floor(team.level * 2);
            team.history = [];
        });
        return teams;
    }

    // Trier les équipes par niveau de seed
    sortTeams() {
        return this.teams.sort((a, b) => a.seed - b.seed);
    }

    // Apparier les équipes par niveau de seed pour un round
    pairTeams(teams) {
        const pairs = [];
        const usedTeams = new Set();

        for (let i = 0; i < teams.length; i++) {
            if (!usedTeams.has(teams[i])) {
                for (let j = i + 1; j < teams.length; j++) {
                    if (!usedTeams.has(teams[j]) && !teams[i].history.includes(teams[j].id)) {
                        pairs.push([teams[i], teams[j]]);
                        usedTeams.add(teams[i]);
                        usedTeams.add(teams[j]);
                        break;
                    }
                }
            }
        }

        // Gérer les équipes non appariées
        const remainingTeams = teams.filter(team => !usedTeams.has(team));
        if (remainingTeams.length === 1) {
            const extraTeam = remainingTeams[0];
            for (let team of teams) {
                if (team.seed === extraTeam.seed && !team.history.includes(extraTeam.id)) {
                    pairs.push([extraTeam, team]);
                    break;
                }
            }
        }

        return pairs;
    }

    // Générer un round de matchs
    generateRound() {
        console.log("generate round")
        const teams = this.sortTeams()
        const pairs = this.pairTeams(teams);
        console.log("pairs", pairs)
        this.rounds.push(pairs);
        console.log("rounds", this.rounds)
        // return pairs;
    }

    // Mettre à jour les scores et les historiques des équipes après un round
    // updateScores(pairs, results) {
    //     pairs.forEach((pair, index) => {
    //         const [team1, team2] = pair;
    //         const result = results[index];
    //         if (result.winner === team1.id) {
    //             team1.seed += 1;
    //             team2.seed -= 1;
    //         } else if (result.winner === team2.id) {
    //             team2.seed += 1;
    //             team1.seed -= 1;
    //         }
    //         team1.history.push(team2.id);
    //         team2.history.push(team1.id);
    //         team1.scoreDiff = result.team1Score - result.team2Score;
    //         team2.scoreDiff = result.team2Score - result.team1Score;
    //     });
    //     this.currentMatchCount += pairs.length;
    // }

    // Saisir les scores des matchs d'un round
    enterScores(results) {
        const currentRound = this.rounds[this.rounds.length - 1];
        // this.updateScores(currentRound, results);
    }

    // Vérifier si le tournoi est terminé
    isTournamentFinished() {
        return this.currentMatchCount >= this.nbrMatchs;
    }
}

// // Utilisation de la classe Tournament
// const teams = [
//     { id: 1, name: 'Team A' },
//     { id: 2, name: 'Team B' },
//     { id: 3, name: 'Team C' },
//     { id: 4, name: 'Team D' },
//     // Ajoutez plus d'équipes si nécessaire
// ];

// const nbrMatchs = 10;
// const tournament = new Tournament(teams, nbrMatchs);

// // Générer le premier round
// const firstRound = tournament.generateRound();
// console.log('First round matches:', firstRound);

// // Supposons que les résultats du premier round soient saisis par l'utilisateur
// const firstRoundResults = [
//     { winner: 1, team1Score: 3, team2Score: 2 },
//     { winner: 3, team1Score: 1, team2Score: 0 },
//     // Ajoutez les résultats des autres matchs si nécessaire
// ];
// tournament.enterScores(firstRoundResults);

// // Générer les rounds suivants jusqu'à la fin du tournoi
// while (!tournament.isTournamentFinished()) {
//     const nextRound = tournament.generateRound();
//     console.log('Next round matches:', nextRound);

//     // Supposons que les résultats du round suivant soient saisis par l'utilisateur
//     const nextRoundResults = [
//         // Saisissez les résultats du round suivant ici
//     ];
//     tournament.enterScores(nextRoundResults);
// }

// console.log('Final teams:', tournament.teams);
