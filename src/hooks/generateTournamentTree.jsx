// generateTournamentTree.js
"use client"
import { addRound } from '@/lib/actionServer';
import { loadGetInitialProps } from 'next/dist/shared/lib/utils';

const initializeTeamsSeedLevel = (teams) => {
    teams.forEach((team) => {
        team.seed = Math.floor(team.level * 2);
        team.loses = 0;
        team.wins = 0;
        team.hasExtraMatch = false;
        team.history = [];
        team.goalAverage = 0;
        if (team.matches.length > 0) {
            for (let match of team.matches) {
                const teamHistory = match.teams.find((t) => t.id !== team.id);
                team.history.push(teamHistory.id);
                if (match.extraMatch === team.id) {
                    team.hasExtraMatch = true;
                    continue ;
                }
                if (match.winner === team.id) {
                    team.seed += 1;
                    team.wins += 1;
                    const goalAverage = Math.abs(match.teamsInMatch[0].score - match.teamsInMatch[1].score);
                    team.goalAverage += goalAverage;
                }
                if (match.loser === team.id) {
                    team.seed -= 1;
                    team.loses += 1;
                    const goalAverage = Math.abs(match.teamsInMatch[0].score - match.teamsInMatch[1].score);
                    team.goalAverage -= goalAverage;
                }
            }
        }
    });
    return teams;
}

const sortTeams = (teams) =>{
    
    const sortedTeams = teams.sort((a, b) => {
        if (a.seed === b.seed) {
            return b.goalAverage - a.goalAverage;
        }
        return b.seed - a.seed;
    });
    for (let i = 0; i < sortedTeams.length; i++) {
        sortedTeams[i].rank = i + 1;
    }
    return sortedTeams;
}

const pairTeams = (teams) =>{
    const teamsTmp = [...teams];
    const pairs = [];
    const usedTeams = new Set();

    while (teamsTmp.length > 1) {
        const team1 = teamsTmp.shift();
        console.log("team1", team1.name)
        if (team1.history.length > 0) {
            let i = 0;
            while (i < teamsTmp.length && team1.history.includes(teamsTmp[i].id)) {
                console.log(team1.name, " already played against ", teamsTmp[i].name)
                i++;
           }
            if (i < teamsTmp.length) {
                const team2 = teamsTmp.splice(i, 1)[0];
                console.log("same level team found", team1.name, "going to play against ", team2.name)
                pairs.push([team1, team2]);
                continue ;
            }
        }
        const team2 = teamsTmp.shift();
        console.log("on prend la première team même si déjà joué contre", team1.name, "et", team2.name)
        pairs.push([team1, team2]);
    }

    // Gérer les équipes non appariées
    if (teamsTmp.length > 0) {
        console.log("il reste une équipe", teamsTmp)
        for (let team of teamsTmp) {
            const closestTeam = teams.filter((t) => t.id !== team.id).reduce((prev, curr) => {
                if (!team.history.includes(curr.id) && !curr.hasExtraMatch) {
                    const prevDiff = Math.abs(prev.seed - team.seed);
                    const currDiff = Math.abs(curr.seed - team.seed);
                    return currDiff < prevDiff ? curr : prev;
                }
                return prev;
            }, { seed: Infinity });
            if (closestTeam.seed !== Infinity) {
                console.log("closest team found", team.name, "going to play against", closestTeam.name);
                // Add the pair to pairs array
                pairs.push([closestTeam, team]);
            }
            else {
                console.log("no team found for ", team.name , "going to play against the last team", teams[teams.length - 2].name);
                pairs.push([teams[teams.length - 2], team]);
            }
        }
    }
    console.log("paire", pairs);

    return pairs;
}

const schedulePairsOnFields = (pairs, timePlan, fieldNbr) => {
    const matches = [];

    for (let i = 0; i < pairs.length; i++) {
       const date = timePlan.shift();
       const field = i % fieldNbr + 1;
       let extraMatch = null;
       if (pairs[i].length === 3)
            extraMatch = pairs[i].pop();
        
        matches.push({
            teams: pairs[i],
            field: field,
            date: date,
            extraMatch: extraMatch,
        });
    }

    return matches;
}

export const generateRound = (teams, timePlan, fieldNbr) => {
    const seedTeams = initializeTeamsSeedLevel(teams);
    const sortedTeams = sortTeams(seedTeams);
    console.log("sorted teams", sortedTeams)
    const pairs = pairTeams(sortedTeams);
    const matches = schedulePairsOnFields(pairs, timePlan, fieldNbr);
    return (matches);
};
    
export const generateTimePlan = (start, end, fieldNbr, teamNbr, matchsNbr) => {
    const maxTournamentDuration = ((end - start) * fieldNbr) / 1000 / 60;
    if (maxTournamentDuration <= 0) return [];
    let totalMatches = teamNbr * matchsNbr / 2;
    if (totalMatches % 1 !== 0) {
        totalMatches = Math.ceil(totalMatches);
    }

    const matchDuration = (maxTournamentDuration / totalMatches) > 17 ? 20 : Math.floor(maxTournamentDuration / nbrMatchs);
    const tournamentTimePlan = [];
    while (
        start.getTime() < end.getTime() &&
        tournamentTimePlan.length < totalMatches
      ) {
        for (let i = 0; i < fieldNbr; i++) {
          tournamentTimePlan.push(new Date(start));
        }
        start = new Date(start.getTime() + matchDuration * 60000);
        start = new Date(Math.ceil(start.getTime() / 6000) * 6000);
      }
    return tournamentTimePlan;
}

export const pushRoundToDb = async (tournamentId, round, maxRound, timePlan) => {
    const res = await addRound(round, tournamentId, maxRound, timePlan);
    if (res.success){
      console.log("match added", res.success);
    }
    else{
      console.log("match not added", res.error);
      return ;
    }
  return true;
}