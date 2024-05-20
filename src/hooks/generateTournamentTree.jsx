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

 const getPriorityOpponent = (team, asPlayed, teams) => {
    // console.log("getPriorityOpponen for team : ", team.name)
    // console.log("team opponents", team.opponentsPriorityTmp)
    const availableOpponents = team.opponentsPriorityTmp.filter(opponent => !asPlayed?.includes(opponent));

     const sameLevelOpponents = availableOpponents.filter(opponent => opponent.level === team.level);
    const differentLevelOpponents = availableOpponents.filter(opponent => opponent.level !== team.level);
    differentLevelOpponents.sort((a, b) => a.diffLevel - b.diffLevel);
    const sortedOpponents = sameLevelOpponents.concat(differentLevelOpponents);


    // console.log("availableOpponents sorted", sortedOpponents);

    if (availableOpponents.length === 0) {
        console.log("no priority opponent found for team", team.name)
        return null;
    }
    const opponent = availableOpponents.shift();
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


const findOpponent = (team, teams, asPlayed, round) => {
    if (team.opponentsPriorityTmp.length === 0)
        team.opponentsPriorityTmp = team.opponentsPriority;
    // console.log("findOpponent for team", team.name, "round", round + 1)
    const opponent = getPriorityOpponent(team, asPlayed, teams);
    if (!opponent)
    {
        console.log("no opponent found for team", team.name)
        return null;
    }
    if (opponent) {
        // console.log("round", round + 1, "team", team.name, "opponent", opponent.name)
        const match = {
            round : round+1,
            team1: team.name,
            team2: opponent.name,
        }
        updateTeamsHistory(team, opponent);
        updateTeamsDiffLevel(team, opponent);
        return {match, opponent, team};
    }
    return null;
}

const verifiedMatchs = (matchs, teams, matchsNbr, matchBonus) => {
    let hasBeenSkipped = [];
    let bonusMatch = null;
    teams.forEach(team => {
        console.log("team.teamHistory", team.name, team.teamHistory.length, "diffLevel", team.diffLevel )
        if (team.teamHistory.length !== matchsNbr) {
            if (team.teamHistory.length === matchsNbr - 1)
                hasBeenSkipped.push(team);
                if (team.teamHistory.length === matchsNbr - 2 && matchBonus){
                    hasBeenSkipped.push(team);
                    bonusMatch = team;
                }
        }
        else {
            return false;
        }
    });
    if (hasBeenSkipped.length === 2 || hasBeenSkipped.length === 3) {
        
        let minDiff = Infinity;
        let team1 = null;
        let team2 = null;

        for (let i = 0; i < hasBeenSkipped.length - 1; i++) {
            for (let j = i + 1; j < hasBeenSkipped.length; j++) {
                const diff = Math.abs(hasBeenSkipped[i].level - hasBeenSkipped[j].level);
                if (diff < minDiff && hasBeenSkipped[i] !== hasBeenSkipped[j]) {
                    minDiff = diff;
                    team1 = hasBeenSkipped[i];
                    team2 = hasBeenSkipped[j];
                }
            }
        }

        if (team1 && team2) {
            const match = {
                round: 9999,
                team1: team1.name,
                team2: team2.name,
            };
            matchs.push(match);
            updateTeamsDiffLevel(team1, team2);
            updateTeamsHistory(team1, team2);
            hasBeenSkipped = hasBeenSkipped.filter(t => t !== team1 && t !== team2);
        }
        let thirdTeam = hasBeenSkipped?.pop();
        if (!thirdTeam)
            thirdTeam = bonusMatch;
        if (thirdTeam && matchBonus) {
            console.log("BONUS GAME BC THE Of THE ALLMATCHNBR");
            const match = {
                round: 7777,
                team1: thirdTeam.name,
                team2: thirdTeam.opponentsPriority[0].name,
            };
            matchs.push(match);
            updateTeamsDiffLevel(thirdTeam, thirdTeam.opponentsPriority[0]);
            updateTeamsHistory(thirdTeam, thirdTeam.opponentsPriority[0]);
        }
    }
    
    return true;
}

const suffleTeams = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const putTeamInFrontOfArray = (team, array) => {
    const index = array.indexOf(team);
    array.splice(index, 1);
    array.unshift(team);
};


const generateMatchs = (teams, timePlan, fieldNbr, matchsNbr, matchBonus) => {
    const matchs = [];
    let asPlayed = [];
    let hasBeenSkipped = [];
    teams = suffleTeams(teams);
    for (let i = 0; i < matchsNbr; i++) {  
        hasBeenSkipped.forEach((team) => {
            console.log("fiiirst with team ", team.name, "round", i + 1)
            const match = findOpponent(team, teams, asPlayed, 6666);
            if (match) {
                asPlayed.push(match.opponent);
                matchs.push(match.match);
                hasBeenSkipped = hasBeenSkipped.filter(t => t !== team);
            }
        });
        teams.forEach((team) => {
                if (asPlayed.includes(team))
                    return;
                const match = findOpponent(team, teams, asPlayed, i);
                if (match) {
                    asPlayed.push(match.team);
                    asPlayed.push(match.opponent);
                    matchs.push(match.match);
                }
                else {
                    if (!hasBeenSkipped){
                        hasBeenSkipped.forEach(hasBeenSkippedTeam => {
                            if (team.opponentsPriority.includes(hasBeenSkippedTeam)){
                                console.log("on fait un match avec une team qui a été sautée", hasBeenSkippedTeam.name, "et", team.name)
                                const match = {
                                    round : 8888,
                                    team1: team.name,
                                    team2: hasBeenSkippedTeam.name,
                                }
                                matchs.push(match);
                                updateTeamsHistory(team, hasBeenSkippedTeam);
                                updateTeamsDiffLevel(team, hasBeenSkippedTeam);
                                hasBeenSkipped = hasBeenSkipped.filter(t => t !== hasBeenSkippedTeam && t !== team);
                                return;
                            }
                            else {
                                console.log("aucune équipe contenu dans hasBeenSkipped n'est une priorité pour", team.name, hasBeenSkipped)
                            }
                        });
                    }
                    console.log("on met la team dans les hasBeenSkipped", team.name)
                    hasBeenSkipped.push(team);
                }
        });
        if (i !== matchsNbr - 1) {
            asPlayed.length = 0;
            teams = suffleTeams(teams);
            // hasBeenSkipped.forEach(team => {
            //     console.log("on met la team en premier", team.name)
            //     putTeamInFrontOfArray(team, teams);
            // });
            // hasBeenSkipped.length = 0;
        }
    };
    if (!verifiedMatchs(matchs, teams, matchsNbr, matchBonus))
        return [];
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
    const iterationNbr = 100;
    const validTree = [];
    
    const timePlan = generateTimePlan(tournament.start, tournament.end, nbrUsedField, tournament.team.length, matchsNbr);
    const teams = createTeamsOpponentsPriority(tournament.team);
    
    for (let i = 0; i < iterationNbr; i++) {
        
        const matchs = generateMatchs(teams, timePlan, nbrUsedField, matchsNbr, nbrAllMatchs.matchBonus);
        if (matchs.length === nbrAllMatchs.totalMatches) {
            const diffTotal = hasAllMatchsGenerated(teams, matchsNbr, nbrAllMatchs.matchBonus)
            if (diffTotal !== false)
            {
                console.log("Tournament tree generated successfully with diffTotal = ", diffTotal);
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

