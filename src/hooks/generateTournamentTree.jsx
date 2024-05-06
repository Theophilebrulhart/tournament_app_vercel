import { NEXT_CACHE_REVALIDATE_TAG_TOKEN_HEADER } from "next/dist/lib/constants";

const generateTimePlan = (start, end, fieldNbr, teamNbr, matchsNbr) => {

    const maxTournamentDuration = ((end - start) * fieldNbr) / 1000 / 60;
    const nbrMatchs = Math.floor(teamNbr * matchsNbr / 2) + 1;
    const matchDuration = (maxTournamentDuration / nbrMatchs) > 17 ? 20 : Math.floor(maxTournamentDuration / nbrMatchs);
    // console.log("matchDuration",matchDuration);
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
    // console.log("getPriorityOpponen for team : ", team.name)
    const availableOpponents = team.priorityOpponentsTmp.filter(opponent => !asPlayed.includes(opponent));
    if (availableOpponents.length === 0) {
        // console.log("no priority opponent found for team", team.name)
        return null;
    }
    const randomIndex = Math.floor(Math.random() * availableOpponents.length);
    const opponent = availableOpponents[randomIndex];
    const opponentTeam = group.find(t => t.id === opponent);
    team.priorityOpponentsTmp = team.priorityOpponentsTmp.filter(t => t !== opponent);
    opponentTeam.priorityOpponentsTmp = opponentTeam.priorityOpponentsTmp.filter(t => t !== team.id);
    // console.log("priority opponent found for team", team.name, "opponent", opponentTeam.name);
    return group.find(t => t.id === opponent);
};


const getNonPriorityOpponent = (level, team, teamGroup, asPlayed) => {
    // console.log("getNonPriorityOpponent for team : ", team.name, team.nonPriorityOpponentsTmp)
    const availableOpponents = team.nonPriorityOpponentsTmp.filter(opponent => !asPlayed?.includes(opponent.id));
    if (availableOpponents.length === 0)
    {
        // console.log("no non priority opponent found for team", team.name)
        if (level === 2)
        {
            // console.log("level 2, no opponent found for team", team.name, "try to get opponent from level 3")
            const opponent = getNonPriorityOpponent(level + 2, team, teamGroup, asPlayed);
            if (opponent)
                return opponent;
        }
        if (team.priorityOpponentsTmp.length === 0)
        {
            if (team.nonPriorityOpponentsTmp.length > 0)
            {
                // console.log("no priority opponent found for team", team.name, "but non priority opponents available but they all played and no one is available");
                return null
            }
            // console.log("no priority opponent found for team", team.name, "allPriorityOpponents already played, try to get opponent from priorityOpponents again")
            team.priorityOpponentsTmp = team.priorityOpponents;
            const opponent = getPriorityOpponent(team, team.teamHistory, asPlayed, teamGroup);
            // console.log("opponent", opponent)
            if (opponent)
                return opponent;
        }
        // console.log("no non priority opponent found for team", team.name, "no opponent found at all")
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
    // console.log("non priority opponent found for team", team.name, "opponent", selectedOpponent.name)
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
    let opponent = null;
     opponent = getPriorityOpponent(team, asPlayed, group);
    if (!opponent)
        opponent = getNonPriorityOpponent(team.level, team, teamGroup, asPlayed);
    if (opponent) {
        // console.log("round", round, "team", team.name, "opponent", opponent.name)
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

const generateMatchs = (teamGroup, timePlan, fieldNbr, matchsNbr) => {
     console.log("teamGroup", teamGroup)
    const   matchs = [];
    let     asPlayed = [];
    let     noOpponentFound = null;
    
    for (let i = 0; i < matchsNbr; i++) {
        if (noOpponentFound){
            // console.log("fiiirst with team", noOpponentFound.name, "first bc no opponent found")
            const match = findOpponent(noOpponentFound, teamGroup, asPlayed, teamGroup[noOpponentFound.level - 1], i);
            if (match){
                asPlayed.push(match.opponentId);
                matchs.push(match.match);
                noOpponentFound = null;
            }
        }
        // console.log("match numero : ", i + 1);
        teamGroup.forEach((group, groupIndex) => {
            // console.log("groupe numero : ", groupIndex + 1);
            group.forEach(team => {
                if (asPlayed.includes(team.id))
                    return ;
                // console.log("team", groupIndex, team);
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
    console.log("matchs", matchs);

    return matchs;
}


const clearTeamsData = (teamGroup) => {
    console.log("clearTeamsData")
    teamGroup.forEach(group => {
        group.forEach(team => {
            team.priorityOpponentsTmp = team.priorityOpponents;
            team.nonPriorityOpponentsTmp = team.nonPriorityOpponents;
            team.asAlreadyNonPriorityOpponent = [];
            team.teamHistory = [];
        });
    });
}

export function generateTournamentTree(tournament, matchsNbr) {
    const nbrUsedField = tournament.fieldNbr;
    console.log("first")
    
    const timePlan = generateTimePlan(tournament.start, tournament.end, nbrUsedField, tournament.team.length, matchsNbr);
    const teamGroup = separateTeams(tournament.team, tournament.fieldNbr);

    let loopCount = 0; // Compteur de boucle pour éviter une boucle infinie
    
    const interval = setInterval(() => {
        loopCount++;
        console.log("try again");
        if (generateMatchs(teamGroup, timePlan, nbrUsedField, matchsNbr).length === matchsNbr * tournament.team.length / 2 || loopCount >= 1) {
            clearInterval(interval);
        } else {
            clearTeamsData(teamGroup); // Appel à clearTeamsData si la condition n'est pas remplie
        }
    }, 100);

    // generateMatchs
}

