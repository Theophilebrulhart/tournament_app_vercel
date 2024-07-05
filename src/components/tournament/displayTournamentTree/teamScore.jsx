export default function TeamScore({ team, editMode, handleScore, score }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-lg text-gray-600 font-medium">{team.rank}</div>
      <div className="text-lg text-gray-600 font-medium">{team.name}</div>
      {team.score > 0 && !editMode ? (
        <div className="text-lg text-gray-600 font-medium">{team.score}</div>
      ) : (
        <input
          type="number"
          min="0"
          className="border text-gray-600 border-gray-300 rounded-lg w-16 p-1 text-center"
          value={score}
          onChange={handleScore}
        />
      )}
    </div>
  );
}
