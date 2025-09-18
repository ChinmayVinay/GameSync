export interface Game {
  id: string;
  name: string;
  platforms: string[];
  releaseNotesUrl: string;
  developer: string;
  description: string;
}

export const games: Game[] = [
  {
    id: "cs2",
    name: "Counter-Strike 2",
    platforms: ["PC"],
    releaseNotesUrl: "https://store.steampowered.com/news/app/730",
    developer: "Valve",
    description: "The ultimate competitive FPS experience"
  },
  {
    id: "lol",
    name: "League of Legends",
    platforms: ["PC"],
    releaseNotesUrl: "https://www.leagueoflegends.com/en-us/news/game-updates/",
    developer: "Riot Games",
    description: "Strategic team-based MOBA gameplay"
  },
  {
    id: "overwatch",
    name: "Overwatch 2",
    platforms: ["PC", "Xbox", "PlayStation", "Nintendo Switch"],
    releaseNotesUrl: "https://overwatch.blizzard.com/en-us/news/patch-notes/",
    developer: "Blizzard Entertainment",
    description: "Team-based hero shooter with diverse characters"
  }
];

export const getGameById = (id: string): Game | undefined => {
  return games.find(game => game.id === id);
};

export const getGamesByPlatform = (platform: string): Game[] => {
  return games.filter(game => game.platforms.includes(platform));
};