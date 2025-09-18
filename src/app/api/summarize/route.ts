import { NextRequest, NextResponse } from "next/server";
import { getGameById } from "@/data/games";
import { ReleaseNotesFetcher } from "@/lib/releaseNotesFetchers";
import { ReleaseNotesSummarizer } from "@/lib/summarizer";

export async function POST(request: NextRequest) {
  try {
    const { gameId, lastPlayedDate } = await request.json();

    if (!gameId || !lastPlayedDate) {
      return NextResponse.json(
        { error: "Game ID and last played date are required" },
        { status: 400 }
      );
    }

    const game = getGameById(gameId);
    if (!game) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404 }
      );
    }

    // Parse the last played date
    const sinceDate = new Date(lastPlayedDate);
    if (isNaN(sinceDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    try {
      // Fetch real release notes
      console.log(`Fetching release notes for ${game.name} since ${sinceDate.toISOString()}`);
      const releaseNotes = await ReleaseNotesFetcher.fetchReleaseNotes(gameId, sinceDate);

      // Summarize the release notes
      console.log(`Found ${releaseNotes.length} release notes, generating summary...`);
      const summary = await ReleaseNotesSummarizer.summarizeReleaseNotes(
        releaseNotes,
        game.name,
        lastPlayedDate
      );

      return NextResponse.json({
        summary,
        game: game.name,
        lastPlayedDate,
        notesCount: releaseNotes.length,
      });
    } catch (fetchError) {
      console.error("Error fetching or summarizing release notes:", fetchError);

      // Fall back to mock summary if real fetching fails
      const mockSummary = generateMockSummary(game.name, lastPlayedDate);

      return NextResponse.json({
        summary: `⚠️ **Unable to fetch live release notes. Showing mock data instead.**\n\n${mockSummary}`,
        game: game.name,
        lastPlayedDate,
        error: "Failed to fetch real data, showing mock content",
      });
    }
  } catch (error) {
    console.error("Error in summarize API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateMockSummary(gameName: string, lastPlayedDate: string): string {
  const date = new Date(lastPlayedDate);
  const now = new Date();
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  switch (gameName) {
    case "Counter-Strike 2":
      return `Since you last played ${gameName} on ${date.toDateString()} (${daysDiff} days ago), here are the key updates:

🔧 GAMEPLAY UPDATES:
• New weapon balancing changes to AK-47 and M4A4
• Updated smoke grenade mechanics with improved visual effects
• Revised economy system with adjusted buy round pricing

🗺️ MAP CHANGES:
• Mirage: Updated A site layout for better competitive balance
• Dust2: Fixed various pixel walk exploits and visual bugs
• New map rotation in competitive matchmaking

🎮 FEATURES:
• Improved anti-cheat system (VAC Live)
• Enhanced server tick rate for better hit registration
• New spectator mode features for tournaments

🐛 BUG FIXES:
• Fixed weapon switching delays
• Resolved audio occlusion issues
• Improved network stability

This is a mock summary. Full implementation would fetch real patch notes from Steam.`;

    case "League of Legends":
      return `Since you last played ${gameName} on ${date.toDateString()} (${daysDiff} days ago), here are the key updates:

⚔️ CHAMPION UPDATES:
• Azir: Significant rework to abilities and passive
• Jinx: Base stats adjustments and W ability changes
• New champion release: Briar, The Restrained Hunger

🎮 GAMEPLAY CHANGES:
• Jungle experience and gold adjustments
• New items: Statikk Shiv rework, Heartsteel buffs
• Updated Rift Herald mechanics

🗺️ MAP UPDATES:
• Baron pit layout changes for better team fight dynamics
• New ward spots added around Dragon pit
• Updated jungle camp timings

🏆 RANKED SYSTEM:
• New split system with updated rewards
• LP gains/losses rebalancing
• Improved smurf detection

This is a mock summary. Full implementation would fetch real patch notes from Riot Games.`;

    case "Overwatch 2":
      return `Since you last played ${gameName} on ${date.toDateString()} (${daysDiff} days ago), here are the key updates:

🦸 HERO UPDATES:
• Mercy: Healing output increased, damage boost adjusted
• Widowmaker: Scoped sensitivity options added
• New Support Hero: Lifeweaver with unique abilities

🎮 GAMEPLAY CHANGES:
• Push map mode balancing updates
• Competitive skill rating adjustments
• New game mode: Flashpoint (limited time)

🗺️ NEW CONTENT:
• New Escort map: Suravasa
• Updated King's Row with visual improvements
• Seasonal event: Lunar New Year celebration

⚖️ BALANCE CHANGES:
• Tank role passive ability updates
• DPS heroes damage falloff adjustments
• Support heroes survivability improvements

🛠️ QUALITY OF LIFE:
• Improved ping system with more callouts
• Enhanced replay system features
• Better communication wheel options

This is a mock summary. Full implementation would fetch real patch notes from Blizzard.`;

    default:
      return `Mock summary for ${gameName} since ${date.toDateString()} (${daysDiff} days ago). This would contain real patch notes and updates in the full implementation.`;
  }
}