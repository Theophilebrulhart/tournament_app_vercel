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
        0: [...groupTeam[0], ...groupTeam[1], ...groupTeam[2]],
        1: [...groupTeam[1], ...groupTeam[0], ...groupTeam[2]],
        2: [...groupTeam[2], ...groupTeam[1], ...groupTeam[0]],
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
    console.log("getPriorityOpponen for team : ", team.name)
       const availableOpponents = team.opponentsPriorityTmp.filter(opponent => !asPlayed?.includes(opponent));
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

const findOpponent = (team, teams, asPlayed, group, round) => {

    console.log("findOpponent for team", team.name, "round", round + 1)
    const opponent = getPriorityOpponent(team, asPlayed, teams);
    if (!opponent)
    {
        console.log("no opponent found for team", team.name)
        return null;
    }
    if (opponent) {
        console.log("round", round + 1, "team", team.name, "opponent", opponent.name)
        const match = {
            round : round+1,
            team1: team.name,
            team2: opponent.name,
        }
        updateTeamsHistory(team, opponent);
        return {match, opponent, team};
    }
    return null;
}

const verifiedMatchs = (matchs, teams, matchsNbr) => {
    let asBeenSkipped = [];
    teams.forEach(team => {
            if (team.matchHistory !== matchsNbr)
            {
                if (team.asBeenSkipped)
                    asBeenSkipped.push(team);
                else {
                    return false;
                }
            }
    });
    if (asBeenSkipped.length > 0)
    {
        if (asBeenSkipped.length % 2 === 0)
        {
            while (asBeenSkipped.length > 0)
            {
                const team1 = asBeenSkipped.pop();
                const team2 = asBeenSkipped.pop();
                const match = {
                    round : 9999,
                    team1: team1.name,
                    team2: team2.name,
                }
                matchs.push(match);
            }
        }
        else {
            return false;
        }
    }
    return true
}

const suffleTeams = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};


const generateMatchs = (teams, timePlan, fieldNbr, matchsNbr) => {
    const matchs = [];
    let asPlayed = [];
    for (let i = 0; i < matchsNbr; i++) {  
        teams = suffleTeams(teams);
        teams.forEach((team) => {
                if (asPlayed.includes(team))
                    return;
                const match = findOpponent(team, teams, asPlayed, team, i);
                if (match) {
                    asPlayed.push(match.team);
                    asPlayed.push(match.opponent);
                    matchs.push(match.match);
                }
        });
        asPlayed.length = 0;
    };
    if (!verifiedMatchs(matchs, teams, matchsNbr))
        return [];
    console.log("matchs", matchs);

    return matchs;
}

const clearTeamsData = (teams) => {
    teams.forEach(group => {
        group.forEach(team => {
            team.priorityOpponentsTmp = team.priorityOpponents;
            team.nonPriorityOpponentsTmp = team.nonPriorityOpponents;
            team.hasAlreadyNonPriorityOpponent.length = 0;
            team.teamHistory.length = 0;      
        });
    });
}

const hasAllMatchsGenerated = (teams, nbrMatchs, matchBonus) => {
    let bonus = 0;
    for (let i = 0; i < teams.length; i++) {
        const group = teams[i];
        for (let j = 0; j < group.length; j++) {
            const team = group[j];
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
        }
    }
    return true;
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
    console.log("totalMatches", nbrAllMatchs.totalMatches)
    const iterationNbr = 100;
    
    const timePlan = generateTimePlan(tournament.start, tournament.end, nbrUsedField, tournament.team.length, matchsNbr);
    const teams = createTeamsOpponentsPriority(tournament.team);
    
    for (let i = 0; i < iterationNbr; i++) {

        if (generateMatchs(teams, timePlan, nbrUsedField, matchsNbr).length === nbrAllMatchs.totalMatches) {
            if (hasAllMatchsGenerated(teams, matchsNbr, nbrAllMatchs.matchBonus))
            {
                console.log("Tournament tree generated successfully");
                return ;
            }
        } else {
            clearTeamsData(teams);
        }
    }
    console.log("Couldn't find any matching system for the tournament. Please try again.");

}

