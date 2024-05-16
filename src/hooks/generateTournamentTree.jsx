

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

const separateTeams = (teams) => {
    const groupTeam = Array.from({ length: 3 }, () => []);

    teams.forEach(team => {
        const teamLevel = team.level;
            groupTeam[teamLevel - 1].push(team);
    });
    groupTeam.forEach((group, groupIndex) => {
        group.forEach(team => {
            const priorityOpponents = group.filter(t => t.id !== team.id).map(t => t.id);
            team.priorityOpponents = priorityOpponents;
            team.priorityOpponentsTmp = priorityOpponents;

            const groupIndex = team.level === 1 ? 1 : team.level - 2;
            const nonPriorityOpponents = groupTeam[groupIndex].filter(t => t.id !== team.id).map(t => t);
            team.nonPriorityOpponents = nonPriorityOpponents;
            team.nonPriorityOpponentsTmp = nonPriorityOpponents;
        });
    });
    return groupTeam;
}

const getPriorityOpponent = (team, asPlayed, group) => {
    console.log("getPriorityOpponen for team : ", team.name)
    const availableOpponents = team.priorityOpponentsTmp.filter(opponent => !asPlayed.includes(opponent));
    if (availableOpponents.length === 0) {
        console.log("no priority opponent found for team", team.name)
        return null;
    }
    const randomIndex = Math.floor(Math.random() * availableOpponents.length);
    const opponent = availableOpponents[randomIndex];
    const opponentTeam = group.find(t => t.id === opponent);
    team.priorityOpponentsTmp = team.priorityOpponentsTmp.filter(t => t !== opponent);
    opponentTeam.priorityOpponentsTmp = opponentTeam.priorityOpponentsTmp.filter(t => t !== team.id);
    console.log("priority opponent found for team", team.name, "opponent", opponentTeam.name);
    return group.find(t => t.id === opponent);
};


const getNonPriorityOpponent = (level, team, teamGroup, asPlayed, changeNonPriorityOpponent) => {
    console.log("getNonPriorityOpponent for team : ", team.name, team.nonPriorityOpponentsTmp)
    const nonProrityOpponents = changeNonPriorityOpponent ? teamGroup[2] : team.nonPriorityOpponentsTmp
    const availableOpponents = nonProrityOpponents.filter(opponent => !asPlayed?.includes(opponent.id));
    if (availableOpponents.length === 0)
    {
        console.log("no non priority opponent found for team", team.name)
        if (level === 2)
        {
            console.log("level 2, no opponent found for team", team.name, "try to get opponent from level 3")
            const opponent = getNonPriorityOpponent(level + 2, team, teamGroup, asPlayed, true);
            if (opponent)
                return opponent;
        }
        if (team.priorityOpponentsTmp.length === 0)
        {
            if (team.nonPriorityOpponentsTmp.length > 0)
            {
                console.log("no priority opponent found for team", team.name, "but non priority opponents available but they all played and no one is available");
                //TODO revoir
                if (level === 1)
                {
                    console.log("level 1, no opponent found for team", team.name, "try to get opponent from level 3")
                    const opponent = getNonPriorityOpponent(level + 3, team, teamGroup, asPlayed, true);
                    if (opponent)
                        return opponent;
                }
                if (level === 3)
                {
                    console.log("level 1, no opponent found for team", team.name, "try to get opponent from level 3")
                    const opponent = getNonPriorityOpponent(level - 3, team, teamGroup, asPlayed, true);
                    if (opponent)
                        return opponent;
                }
                return null
            }
            console.log("no priority opponent found for team", team.name, "allPriorityOpponents already played, try to get opponent from priorityOpponents again")
            team.priorityOpponentsTmp = team.priorityOpponents;
            const opponent = getPriorityOpponent(team, team.teamHistory, asPlayed, teamGroup);
            console.log("opponent", opponent)
            if (opponent)
                return opponent;
        }
        console.log("no non priority opponent found for team", team.name, "no opponent found at all")
        return (null);
    }
    availableOpponents.sort((a, b) => {
        const countA = a?.asAlreadyNonPriorityOpponent?.length || 0;
        const countB = b?.asAlreadyNonPriorityOpponent?.length || 0;
        return countA - countB;
    });

    const randomIndex = Math.floor(Math.random() * availableOpponents.length);
    const selectedOpponent = availableOpponents[randomIndex];
    team.nonPriorityOpponentsTmp = team.nonPriorityOpponentsTmp.filter(t => t.id !== selectedOpponent.id);
    if (selectedOpponent.asAlreadyNonPriorityOpponent === undefined) 
        selectedOpponent.asAlreadyNonPriorityOpponent = [];
    selectedOpponent.asAlreadyNonPriorityOpponent.push(team.id);
    console.log("non priority opponent found for team", team.name, "opponent", selectedOpponent.name)
    return selectedOpponent;
};


const updateTeamsHistory = (team, opponent) => {
    if (team.teamHistory === undefined)
        team.teamHistory = [];
    team.teamHistory.push(opponent.id);
    if (opponent.teamHistory === undefined)
        opponent.teamHistory = [];
    opponent.teamHistory.push(team.id);
}

const findOpponent = (team, teamGroup, asPlayed, group, round) => {
    // console.log("findOpponent for team : ", team)
    let opponent = null;
     opponent = getPriorityOpponent(team, asPlayed, group);
    if (!opponent)
        opponent = getNonPriorityOpponent(team.level, team, teamGroup, asPlayed, false);
    if (opponent) {
        console.log("round", round, "team", team.name, "opponent", opponent.name)
        const match = {
            round : round+1,
            team1: team.name,
            team2: opponent.name,
        }
        updateTeamsHistory(team, opponent);
        return {match, opponentId : opponent.id, teamId : team.id};
    }
    return null;
}

const verifiedMatchs = (matchs, teamGroup, matchsNbr) => {
    let asBeenSkipped = [];
    teamGroup.forEach(group => {
        group.forEach(team => {
            if (team.matchHistory !== matchsNbr)
            {
                if (team.asBeenSkipped)
                    asBeenSkipped.push(team);
                else {
                    return false;
                }
            }
        })
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

const generateMatchs = (teamGroup, timePlan, fieldNbr, matchsNbr) => {
    const   matchs = [];
    let     asPlayed = [];
    let     noOpponentFound = null;
    
    for (let i = 0; i < matchsNbr; i++) {
        if (noOpponentFound){
            console.log("fiiirst with team", noOpponentFound.name, "first bc no opponent found")
            const match = findOpponent(noOpponentFound, teamGroup, asPlayed, teamGroup[noOpponentFound.level - 1], i);
            if (match){
                asPlayed.push(match.opponentId);
                matchs.push(match.match);
                noOpponentFound = null;
            }
        }
        teamGroup.forEach((group) => {
            group.forEach(team => {
                if (asPlayed.includes(team.id))
                    return ;
                const match = findOpponent(team, teamGroup, asPlayed, group, i);
                if(match){
                    asPlayed.push(match.teamId);
                    asPlayed.push(match.opponentId);
                    matchs.push(match.match);
                }
                else {
                    noOpponentFound = team;
                }
            });
        });
        asPlayed = [];
    };
    if (!verifiedMatchs(matchs, teamGroup, matchsNbr))
        return [];
    console.log("matchs", matchs);

    return matchs;
}


const clearTeamsData = (teamGroup) => {
    teamGroup.forEach(group => {
        group.forEach(team => {
            team.priorityOpponentsTmp = team.priorityOpponents;
            team.nonPriorityOpponentsTmp = team.nonPriorityOpponents;
            team.asAlreadyNonPriorityOpponent = [];
            team.teamHistory = [];
        });
    });
}

const asAllMatchsGenerated = (teamGroup, nbrMatchs) => {
    teamGroup.forEach(group => {
        group.forEach(team => {
            if (team.matchHistory !== nbrMatchs)
                return false;
        });
    });
    return true;
}

export function generateTournamentTree(tournament, matchsNbr) {
    const nbrUsedField = tournament.fieldNbr;
    const nbrAllMatchs = (matchsNbr * tournament.team.length / 2) % 2 === 0 ? matchsNbr * tournament.team.length / 2 : matchsNbr * tournament.team.length / 2 + 1;
    console.log("first")
    
    const timePlan = generateTimePlan(tournament.start, tournament.end, nbrUsedField, tournament.team.length, matchsNbr);
    const teamGroup = separateTeams(tournament.team, tournament.fieldNbr);

    let loopCount = 0;
    
    const interval = setInterval(() => {
        loopCount++;
        if (generateMatchs(teamGroup, timePlan, nbrUsedField, matchsNbr).length === nbrAllMatchs || loopCount >= 10) {
            if (asAllMatchsGenerated(teamGroup, nbrUsedField))
                clearInterval(interval);
        } else {
            clearTeamsData(teamGroup);
        }
        if (loopCount >= 10) {
            console.log("Couldn't find any matching system for the tournament. Please try again.");
            return;
        }
    }, 100);


    // generateMatchs
}
