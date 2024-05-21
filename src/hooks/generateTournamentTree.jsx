export function generateTournamentTree(tournament, matchesPerTeam) {
    // Sort teams by level
    const teams = tournament.team;
    teams.sort((a, b) => a.level - b.level);
    
    const totalTeams = teams.length;
    const totalMatches = Math.ceil(matchesPerTeam * totalTeams / 2); // total matches needed
    let matches = [];
    let matchCount = new Array(totalTeams).fill(0);
    
    // Create a 2D array to track matches between teams
    let playedMatches = Array.from({ length: totalTeams }, () => new Array(totalTeams).fill(0));
    
    // Helper function to find the best opponent
    function findBestOpponent(teamIndex, allowRematch = false) {
        let bestOpponent = -1;
        let bestDiff = Infinity;
        for (let i = 0; i < totalTeams; i++) {
            if (i === teamIndex || matchCount[i] >= matchesPerTeam) continue;
            
            let levelDiff = Math.abs(teams[teamIndex].level - teams[i].level);
            if ((levelDiff <= 1 || (allowRematch && playedMatches[teamIndex][i] > 0)) && levelDiff < bestDiff) {
                bestDiff = levelDiff;
                bestOpponent = i;
            }
        }
        return bestOpponent;
    }
    // Generate matches
    let i = 0;
    while (i < matchesPerTeam) {
        console.log("salut")
        for (let i = 0; i < totalTeams; i++) {
            if (matchCount[i] >= matchesPerTeam) continue;
            
            // Find the best opponent for team i without rematch
            let bestOpponent = findBestOpponent(i);
            
            // If no suitable opponent is found, allow rematch
            if (bestOpponent === -1) {
                bestOpponent = findBestOpponent(i, true);
            }
            
            // If still no opponent is found, just pick any available team
            if (bestOpponent === -1) {
                for (let j = 0; j < totalTeams; j++) {
                    if (i !== j && matchCount[j] < matchesPerTeam) {
                        bestOpponent = j;
                        break;
                    }
                }
            }
            if (bestOpponent === -1)
                console.log("no opponent found")
            
            // Create match
            if (bestOpponent !== -1) {
                matches.push([teams[i].name, teams[bestOpponent].name]);
                matchCount[i]++;
                matchCount[bestOpponent]++;
                playedMatches[i][bestOpponent]++;
                playedMatches[bestOpponent][i]++;
            }
        }
        i++;
    }
    console.log("Matches: ", matches);
    return matches;
}

