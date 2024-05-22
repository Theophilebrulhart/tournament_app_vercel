// generateTournamentTree.js
"use client"
import { useState, useEffect } from 'react';

const initializeTeamsSeedLevel = (teams) => {
    teams.forEach((team) => {
        team.seed = Math.floor(team.level * 2);
        team.history = [];
    });
    return teams;
}

const sortTeams = (teams) =>{
    return teams.sort((a, b) => a.seed - b.seed);
}

const pairTeams = (teams) =>{
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

export const generateRound = (teams, nbrMatchs, tournamentId) => {

    const seedTeams = initializeTeamsSeedLevel(teams);
    const sortedTeams = sortTeams(seedTeams);
    const pairs = pairTeams(sortedTeams);
    return (pairs);
};
    