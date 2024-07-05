"use client";

import { updateMatchScore } from "@/lib/actionServer";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

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

  useEffect(() => {
    state?.success && router.refresh();
    setIsLoading(false);
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
        <div className="flex items-center justify-between">
          <div className="text-lg text-gray-600 font-medium">{team1.rank}</div>
          <div className="text-lg text-gray-600 font-medium">{team1.name}</div>
          {team1.score > 0 ? (
            <div className="text-lg text-gray-600 font-medium">
              {team1.score}
            </div>
          ) : (
            <input
              type="number"
              min="0"
              className="border text-gray-600 border-gray-300 rounded-lg w-16 p-1 text-center"
              value={team1Score}
              onChange={handleTeam1Score}
            />
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg text-gray-600 font-medium">{team2.rank}</div>
          <div className="text-lg text-gray-600 font-medium">{team2.name}</div>
          {team2.score > 0 ? (
            <div className="text-lg text-gray-600 font-medium">
              {team2.score}
            </div>
          ) : (
            <input
              type="number"
              min="0"
              className="border text-gray-600 border-gray-300 rounded-lg w-16 p-1 text-center"
              value={team2Score}
              onChange={handleTeam2Score}
            />
          )}
        </div>
        {team1.score > 0 && team2.score > 0 ? (
          <div className="text-center text-gray-600">Match is over</div>
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
              onClick={() => setIsLoading(true)}
              className="border-2 p-2 rounded-lg bg-blue-800 hover:bg-blue-700"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              ) : (
                "Save"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
