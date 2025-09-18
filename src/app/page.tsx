"use client";

import { useState } from "react";
import { games } from "@/data/games";
import { GameBackground } from "@/components/GameBackground";
import { ResultsDisplay } from "@/components/ResultsDisplay";

export default function Home() {
  const [selectedGame, setSelectedGame] = useState("");
  const [lastPlayedDate, setLastPlayedDate] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGame || !lastPlayedDate) return;

    setLoading(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId: selectedGame,
          lastPlayedDate: lastPlayedDate,
        }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error:", error);
      setSummary("Error fetching release notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Dynamic Game Background */}
      <GameBackground selectedGame={selectedGame} />

      <div className="relative z-10 max-w-4xl mx-auto p-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4 animate-pulse">
            🎮 GameSync
          </h1>
          <p className="text-xl text-gray-300 animate-slide-up">
            Stay synchronized with your favorite games - AI-powered update summaries
          </p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-purple-500/30 p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
              <label htmlFor="game" className="block text-sm font-medium text-purple-400 mb-2 flex items-center">
                🎯 Select Game
              </label>
              <select
                id="game"
                value={selectedGame}
                onChange={(e) => setSelectedGame(e.target.value)}
                className="w-full p-4 bg-gray-900/50 border border-purple-500/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 hover:border-purple-400"
                required
              >
                <option value="" className="bg-gray-900">Choose a game...</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id} className="bg-gray-900">
                    {game.name} - {game.platforms.join(", ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
              <label htmlFor="lastPlayed" className="block text-sm font-medium text-purple-400 mb-2 flex items-center">
                📅 When did you last play this game?
              </label>
              <input
                type="date"
                id="lastPlayed"
                value={lastPlayedDate}
                onChange={(e) => setLastPlayedDate(e.target.value)}
                className="w-full p-4 bg-gray-900/50 border border-purple-500/50 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 hover:border-purple-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !selectedGame || !lastPlayedDate}
              className="w-full bg-gradient-to-r from-purple-600 to-black text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-gray-900 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 animate-slide-up font-semibold text-lg shadow-lg disabled:hover:scale-100"
              style={{animationDelay: '0.6s'}}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Generating Summary...
                </div>
              ) : (
                "🚀 Get Release Notes Summary"
              )}
            </button>
          </form>

          {summary && (
            <ResultsDisplay summary={summary} selectedGame={selectedGame} />
          )}
        </div>
      </div>
    </div>
  );
}
