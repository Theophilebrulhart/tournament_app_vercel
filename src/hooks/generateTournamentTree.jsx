// generateTournamentTree.js
"use client";
import { addRound } from "@/lib/actionServer";
import { loadGetInitialProps } from "next/dist/shared/lib/utils";

const initializeTeamsSeedLevel = (teams) => {
  teams.forEach((team) => {
    console.log("Team : ", team);
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
          continue;
        }
        if (match.winner === team.id) {
          team.seed += 1;
          team.wins += 1;
          const goalAverage = Math.abs(
            match.teamsInMatch[0].score - match.teamsInMatch[1].score,
          );
          team.goalAverage += goalAverage;
        }
        if (match.loser === team.id) {
          team.seed -= 1;
          team.loses += 1;
          const goalAverage = Math.abs(
            match.teamsInMatch[0].score - match.teamsInMatch[1].score,
          );
          team.goalAverage -= goalAverage;
        }
      }
    }
  });
  return teams;
};

const sortTeams = (teams) => {
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
};

const pairTeams = (teams) => {
  const teamsTmp = [...teams];
  const pairs = [];

  while (teamsTmp.length > 1) {
    const team1 = teamsTmp.shift();
    if (team1.history.length > 0) {
      let i = 0;
      while (i < teamsTmp.length && team1.history.includes(teamsTmp[i].id)) {
        i++;
      }
      if (i < teamsTmp.length) {
        const team2 = teamsTmp.splice(i, 1)[0];
        pairs.push([team1, team2]);
        continue;
      }
    }
    const team2 = teamsTmp.shift();
    pairs.push([team1, team2]);
  }

  // Gérer les équipes non appariées
  if (teamsTmp.length > 0) {
    for (let team of teamsTmp) {
      const closestTeam = teams
        .filter((t) => t.id !== team.id)
        .reduce(
          (prev, curr) => {
            if (!team.history.includes(curr.id) && !curr.hasExtraMatch) {
              const prevDiff = Math.abs(prev.seed - team.seed);
              const currDiff = Math.abs(curr.seed - team.seed);
              return currDiff < prevDiff ? curr : prev;
            }
            return prev;
          },
          { seed: Infinity },
        );
      if (closestTeam.seed !== Infinity) {
        // Add the pair to pairs array
        pairs.push([closestTeam, team]);
        closestTeam.hasExtraMatch = team.id;
      } else {
        pairs.push([teams[teams.length - 2], team]);
      }
    }
  }

  return pairs;
};

const schedulePairsOnFields = (pairs, timePlan, fieldNbr) => {
  const matches = [];

  for (let i = 0; i < pairs.length; i++) {
    const team1 = pairs[i][0];
    const team2 = pairs[i][1];
    const date = timePlan.shift();
    const field = (i % fieldNbr) + 1;
    let extraMatch = null;
    if (team1.hasExtraMatch === team2.id) extraMatch = team1.id;
    if (team2.hasExtraMatch === team1.id) extraMatch = team2.id;
    matches.push({
      teams: pairs[i],
      field: field,
      date: date,
      extraMatch: extraMatch,
    });
  }

  return matches;
};

export const generateRound = (teams, timePlan, fieldNbr) => {
  const seedTeams = initializeTeamsSeedLevel(teams);
  const sortedTeams = sortTeams(seedTeams);
  const pairs = pairTeams(sortedTeams);
  const matches = schedulePairsOnFields(pairs, timePlan, fieldNbr);
  return matches;
};

export const generateTimePlan = (start, end, fieldNbr, teamNbr, matchsNbr) => {
  const maxTournamentDuration = ((end - start) * fieldNbr) / 1000 / 60;
  if (maxTournamentDuration <= 0) return [];
  let totalMatches = (teamNbr * matchsNbr) / 2;
  if (totalMatches % 1 !== 0) {
    totalMatches = Math.ceil(totalMatches);
  }
  const matchDuration =
    maxTournamentDuration / totalMatches > 17
      ? 20
      : Math.floor(maxTournamentDuration / matchsNbr);
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
};

export const pushRoundToDb = async (
  tournamentId,
  round,
  maxRound,
  timePlan,
) => {
  const res = await addRound(round, tournamentId, maxRound, timePlan);
  if (res.success) {
    console.log("match added", res.success);
  } else {
    console.log("match not added", res.error);
    return;
  }
  return true;
};
