const generateTimePlan = (start, end, fieldNbr, teamNbr, matchsNbr) => {

    const maxTournamentDuration = ((end - start) * fieldNbr) / 1000 / 60;
    const nbrMatchs = Math.floor(teamNbr * matchsNbr / 2) + 1;
    const matchDuration = (maxTournamentDuration / nbrMatchs) > 17 ? 20 : Math.floor(maxTournamentDuration / nbrMatchs);
    const tournamentTimePlan = [];

    while (start.getTime() < end.getTime() && tournamentTimePlan.length < (nbrMatchs / fieldNbr) + fieldNbr) {
        tournamentTimePlan.push(new Date(start));
        
        start = new Date((start.getTime() + matchDuration * 60000));
       start = new Date(Math.ceil(start.getTime() / 6000) * 6000);
    }
    return tournamentTimePlan;
}

const createTeamsOpponentsPriority = (teams) => {
    const groupTeam = Array.from({ length: 3 }, () => []);
    teams.forEach(team => {
        const teamLevel = team.level;
            groupTeam[teamLevel - 1].push(team);
    });
    const prioPerLevel = {
        0: [...groupTeam[0], ...groupTeam[1]],
        1: [...groupTeam[1], ...groupTeam[0], ...groupTeam[2]],
        2: [...groupTeam[2], ...groupTeam[1]],
    }
    for (let i = 0; i < groupTeam.length; i++) {
        groupTeam[i].forEach(team => {
            team.opponentsPriority = prioPerLevel[i].filter(t => t.id !== team.id);
            team.opponentsPriorityTmp = team.opponentsPriority;
        });
    }
    const finalTeams = groupTeam.flat();
    return finalTeams;
}

const pushMatch = (matchs, team1, team2) => {
    matchs.push({team1 : team1.name, team2 : team2.name});
    updateTeamsDiffLevel(team1, team2);
    updateTeamsHistory(team1, team2);
}

 const getPriorityOpponent = (team, nbrMatchs) => {
    // console.log("getPriorityOpponen for team : ", team.name)
    // console.log("team opponents", team.opponentsPriorityTmp)
    const availableOpponents = team.opponentsPriorityTmp.filter(opponent => opponent?.teamHistory?.length !== nbrMatchs) 
    

    const sameLevelOpponents = availableOpponents.filter(opponent => opponent.level === team.level);
    const differentLevelOpponents = availableOpponents.filter(opponent => opponent.level !== team.level);
    differentLevelOpponents.sort((a, b) => a.diffLevel - b.diffLevel);
    const sortedOpponents = sameLevelOpponents.concat(differentLevelOpponents);


    // console.log("availableOpponents sorted", sortedOpponents);

    if (availableOpponents.length === 0) {
        console.log("no priority opponent found for team", team.name)
        return null;
    }
    const opponent = sortedOpponents.shift();
    team.opponentsPriorityTmp = team.opponentsPriorityTmp.filter(t => t !== opponent);
    opponent.opponentsPriorityTmp = opponent.opponentsPriorityTmp.filter(t => t !== team);
    return (opponent);
};

const updateTeamsHistory = (team, opponent) => {
    if (team.teamHistory === undefined)
        team.teamHistory = [];
    team.teamHistory.push(opponent.id);
    if (opponent.teamHistory === undefined)
        opponent.teamHistory = [];
    opponent.teamHistory.push(team.id);
}

const updateTeamsDiffLevel= (team, opponent) => {
    const diffLevel = Math.abs(team.level - opponent.level);
    if (team.diffLevel === undefined)
        team.diffLevel = 0;
    team.diffLevel += diffLevel;
    if (opponent.diffLevel === undefined)
        opponent.diffLevel = 0;
    opponent.diffLevel += diffLevel;
}


const findOpponent = (team, nbrMatchs) => {
    const availableOpponents = team.opponentsPriorityTmp.filter(opponent => opponent?.teamHistory?.length !== nbrMatchs)
    if (availableOpponents === 0)
        team.opponentsPriorityTmp = team.opponentsPriority;
    // console.log("findOpponent for team", team.name, "round", round + 1)
    const opponent = getPriorityOpponent(team, nbrMatchs);
    if (!opponent)
    {
        console.log("no opponent found for team", team.name)
        return null;
    }
    if (opponent) {
        // console.log("round", round + 1, "team", team.name, "opponent", opponent.name)
        const match = {
            team1: team.name,
            team2: opponent.name,
        }
        return {match, opponent, team};
    }
    return null;
}

const handleMissingMatches = (teamMissingMatches, bonus, matchs, matchsNbr) => {
    console.log("handleMissingMatches begin", teamMissingMatches)
    if (teamMissingMatches.length > 1) {
        console.log("looop on teamMissingMatches");
        
        while (teamMissingMatches.length > 1) {
            let minDiff = Infinity;
            let team1 = null;
            let team2 = null;
    
            for (let i = 0; i < teamMissingMatches.length - 1; i++) {
                for (let j = i + 1; j < teamMissingMatches.length; j++) {
                    const diff = Math.abs(teamMissingMatches[i].level - teamMissingMatches[j].level);
                    if (diff < minDiff) {
                        minDiff = diff;
                        team1 = teamMissingMatches[i];
                        team2 = teamMissingMatches[j];
                    }
                }
            }
    
            if (team1 && team2) {
                pushMatch(matchs, team1, team2);
                console.log("team1", team1.name, "team2", team2.name);
                teamMissingMatches = teamMissingMatches.filter(team => team.teamHistory.length < matchsNbr);
            } else {
                break;
            }
        }
    }
    
    console.log("teamMissingMatches", teamMissingMatches);
    if (teamMissingMatches[0] && bonus) {
        pushMatch(matchs, teamMissingMatches[0], teamMissingMatches[0].opponentsPriority[0]);
    }
}

const generateMatchs = (teams, matchsNbr, matchBonus, matchTotal ) => {
    const matchs = [];
    
    // teams = suffleTeams(teams);
   for (let i = 0; i < 500 && matchs.length < matchTotal; i++) {
        teams.forEach((team) => {
            if (team.teamHistory && team.teamHistory.length === matchsNbr)
            {
                console.log("team", team.name, "has already played", matchsNbr, "matches")
                return ;
            }
                const match = findOpponent(team, matchsNbr);
                if (match) {
                    pushMatch(matchs, match.team, match.opponent);
                }
        });  
    };
    const teamMissingMatches = teams.filter(team => team.teamHistory.length < matchsNbr);
    if (teamMissingMatches.length > 0)
        handleMissingMatches(teamMissingMatches, matchBonus, matchs, matchsNbr);
    if (matchs.length < matchTotal)
        console.log("not enough matchs generated")
    console.log("matchs", matchs);
    return matchs;
}

const clearTeamsData = (teams) => {
    teams.forEach(team => {
            team.opponentsPriorityTmp = team.opponentsPriority;
            team.teamHistory.length = 0;     
            team.diffLevel = 0; 
    });
}

const hasAllMatchsGenerated = (teams, nbrMatchs, matchBonus) => {
    let bonus = 0;
    let diffTotal = 0;
    
        for (let j = 0; j < teams.length; j++) {
            const team = teams[j];
            console.log("team.teamHistory", team.name, team.teamHistory.length, "diffLevel", team.diffLevel )
            diffTotal += team.diffLevel;
            if (team?.teamHistory?.length < nbrMatchs) {
                console.log("less matches than expected for team", team.name, team.teamHistory.length, "played", nbrMatchs, "expected");
                return false;
            }
            if (team?.teamHistory?.length > nbrMatchs) {
                console.log("more matches than expected for team", team.name, team.teamHistory.length, "played", nbrMatchs, "expected");
                if (team?.teamHistory?.length - nbrMatchs === 1 && matchBonus && bonus === 0)
                {
                    console.log("ok its a bonus game for team ", team.name, "so we continue")
                    bonus++
                }
                else {
                    return false;
                }
            }
            if (!matchBonus && team.teamHistory.some((item, index) => team.teamHistory.indexOf(item) !== index && team.opponentsPriority.length >= nbrMatchs + 3)) {
                console.log("team", team.name, "has played against the same team twice but enough priority opponents are in the tournament");
                return false;
            }
            
        }
    return diffTotal;
};

const calculateTotalMatches = (teamCount, matchCountPerTeam) => {
    let totalMatches = (teamCount * matchCountPerTeam) / 2;
    if (totalMatches % 1 !== 0) {
        totalMatches = Math.ceil(totalMatches);
        return {matchBonus : true, totalMatches};
    }
    return {matchBonus : false, totalMatches};
};


export function generateTournamentTree(tournament, matchsNbr) {
    const nbrUsedField = tournament.fieldNbr;
    const nbrAllMatchs= calculateTotalMatches(tournament.team.length, matchsNbr);
    console.log("totalMatches", nbrAllMatchs.totalMatches, "with bonus ?", nbrAllMatchs.matchBonus)
    const iterationNbr = 1;
    const validTree = [];
    
    const timePlan = generateTimePlan(tournament.start, tournament.end, nbrUsedField, tournament.team.length, matchsNbr);
    const teams = createTeamsOpponentsPriority(tournament.team);
    
    for (let i = 0; i < iterationNbr; i++) {
        
        const matchs = generateMatchs(teams, matchsNbr, nbrAllMatchs.matchBonus, nbrAllMatchs.totalMatches);
        if (matchs.length === nbrAllMatchs.totalMatches) {
            const diffTotal = hasAllMatchsGenerated(teams, matchsNbr, nbrAllMatchs.matchBonus)
            if (diffTotal !== false)
            {
                console.log("Tournament tree generated successfully with diffTotal = ", diffTotal);
                if (diffTotal === 0)
                    return {matchs, diffTotal};
                validTree.push({matchs, diffTotal});
            }
        } else {
            clearTeamsData(teams);
        }
    }
    if (validTree.length > 0) {
        validTree.sort((a, b) => a.diffTotal - b.diffTotal);
        const tournamentTree = validTree[0];
        console.log("return final tournament tree", tournamentTree.matchs, "with diffTotal", tournamentTree.diffTotal)
        return tournamentTree;
    }
    console.log("Couldn't find any matching system for the tournament. Please try again.");

}

