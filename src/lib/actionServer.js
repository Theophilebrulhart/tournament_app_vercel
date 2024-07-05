export async function addTournament(previousState, formData) {
  const { name, fieldNbr, start, end } = Object.fromEntries(formData);

  try {
    const res = await fetch("/api/add_tournament", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, fieldNbr, start, end }),
    });
    return { success: (await res.json()).result };
  } catch (error) {
    console.error(error);
    return { error: "could not create tournament" };
  }
}

export async function addTeam(previousState, formData) {
  const { name, level, tournamentId } = Object.fromEntries(formData);

  try {
    const res = await fetch("/api/add_team", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, level, tournamentId }),
    });

    return { success: (await res.json()).result };
  } catch (error) {
    console.error(error);
  }
}

export async function addMatch(
  team1Id,
  team2Id,
  tournamentId,
  tournamentRound,
) {
  try {
    const res = await fetch("/api/add_match", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ team1Id, team2Id, tournamentId, tournamentRound }),
    });
    return { success: (await res.json()).result };
  } catch (error) {
    console.error(error);
  }
}

export async function addRound(round, tournamentId, maxRound, timePlan) {
  try {
    const res = await fetch("/api/add_tournamentRound", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ round, tournamentId, maxRound, timePlan }),
    });
    return { success: (await res.json()).result };
  } catch (error) {
    console.error(error);
  }
}

export async function deleteTeam(previousState, formData) {
  const { teamId } = Object.fromEntries(formData);

  try {
    const res = await fetch("/api/delete_team", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamId),
    });

    if (!res.ok) {
      throw new Error("Failed to delete team");
    }
    const data = await res.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "team could'nt be deleted" };
  }
}

export async function deleteTournament(previousState, formData) {
  const { tournamentId } = Object.fromEntries(formData);

  try {
    const res = await fetch("/api/delete_tournament", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tournamentId),
    });

    if (!res.ok) {
      throw new Error("Failed to delete tournament");
    }
    const data = await res.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "tournament could'nt be deleted" };
  }
}

export async function deleteMatch(matchId) {
  try {
    const res = await fetch("/api/delete_match", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(matchId),
    });

    if (!res.ok) {
      throw new Error("Failed to delete match");
    }
    const data = await res.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "match could'nt be deleted" };
  }
}

export async function deleteRound(roundId) {
  try {
    const res = await fetch("/api/delete_round", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(roundId),
    });
    if (!res.ok) {
      throw new Error("Failed to delete round");
    }
    const data = await res.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "round could'nt be deleted" };
  }
}

export async function deleteManyMatches(idToDel) {
  try {
    const res = await fetch("/api/delete_many_match", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idToDel),
    });

    if (!res.ok) {
      throw new Error("Failed to delete match");
    }
    const data = await res.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "match could'nt be deleted" };
  }
}

export async function deleteManyRounds(idToDel) {
  try {
    const res = await fetch("/api/delete_many_round", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idToDel),
    });

    if (!res.ok) {
      throw new Error("Failed to delete rounds");
    }
    const data = await res.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "rounds could'nt be deleted" };
  }
}

export async function deleteManyTeamsInMatch(idToDel) {
  try {
    const res = await fetch("/api/delete_many_team_in_match", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(idToDel),
    });
    if (!res.ok) {
      throw new Error("Failed to delete teamsInMatch");
    }
    const data = await res.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "teamsInMatch could'nt be deleted" };
  }
}

export async function updateMatchScore(previousState, formData) {
  const {
    matchId,
    team1Score,
    team2Score,
    team1Id,
    team2Id,
    team1RelId,
    team2RelId,
  } = Object.fromEntries(formData);
  const winner = team1Score > team2Score ? team1RelId : team2RelId;
  const loser = team1Score < team2Score ? team1RelId : team2RelId;
  console.log("winner : ", winner, "looser : ", loser);

  try {
    const resMatch = await fetch("/api/update_match", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchId, winner, loser }),
    });

    const resTeam1 = await fetch("/api/update_team_in_match", {
      method: "PUT",
      heeaders: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchId, score: team1Score, teamId: team1Id }),
    });

    const resTeam2 = await fetch("/api/update_team_in_match", {
      method: "PUT",
      heeaders: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ matchId, score: team2Score, teamId: team2Id }),
    });

    if (!resMatch.ok && !resTeam1.ok && !resTeam2.ok) {
      throw new Error("Failed to update match score");
    }

    const data = await resTeam2.json();
    return { success: data.result };
  } catch (error) {
    console.error(error);
    return { error: "match score could'nt be updated" };
  }
}
