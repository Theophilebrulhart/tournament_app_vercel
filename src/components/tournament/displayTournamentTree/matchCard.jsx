"use client";

import { updateMatchScore } from "@/lib/actionServer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import TeamScore from "./teamScore";

export default function MatchCard({ match }) {
  const matchDate = new Date(match.startDate);
  const formattedTime = matchDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const team1 =
    match.teamsInMatch[0].rank < match.teamsInMatch[1].rank
      ? match.teamsInMatch[0]
      : match.teamsInMatch[1];
  const team2 =
    match.teamsInMatch[0].rank > match.teamsInMatch[1].rank
      ? match.teamsInMatch[0]
      : match.teamsInMatch[1];
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [state, formAction] = useFormState(updateMatchScore, undefined);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    router.refresh();
    setIsLoading(false);
    setEditMode(false);
  }, [state?.success, router]);

  const handleTeam1Score = (e) => {
    setTeam1Score(e.target.value);
  };

  const handleTeam2Score = (e) => {
    setTeam2Score(e.target.value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 w-full max-w-md">
      <div className="mb-4 text-center">
        <div className="text-xl font-semibold text-gray-600">
          Field {match.field}
        </div>
        <div className="text-gray-600">At {formattedTime}</div>
      </div>
      <div className="flex flex-col gap-4">
        <TeamScore
          team={team1}
          editMode={editMode}
          handleScore={handleTeam1Score}
          score={team1Score}
        />
        <TeamScore
          team={team2}
          editMode={editMode}
          handleScore={handleTeam2Score}
          score={team2Score}
        />
        {team1.score > 0 && team2.score > 0 && !editMode ? (
          <div className="flex flex-row w-full justify-between">
            <div className="text-center text-gray-600">Match is over</div>
            <button
              onClick={() => {
                setEditMode(true);
                setIsLoading(false);
              }}
              className="text-center text-gray-600"
            >
              Edit
            </button>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-4">
            <input type="hidden" name="team1Score" value={team1Score} />
            <input type="hidden" name="team2Score" value={team2Score} />
            <input type="hidden" name="matchId" value={match.id} />
            <input type="hidden" name="team1Id" value={team1.id} />
            <input type="hidden" name="team2Id" value={team2.id} />
            <input type="hidden" name="team1RelId" value={team1.teamId} />
            <input type="hidden" name="team2RelId" value={team2.teamId} />
            <button
              onClick={() => {
                setIsLoading(true);
              }}
              className="border-2 p-2 rounded-lg bg-blue-800 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Save"
              )}
            </button>
            {editMode && (
              <button
                onClick={() => setEditMode(false)}
                className="text-center text-gray-600"
              >
                close
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
