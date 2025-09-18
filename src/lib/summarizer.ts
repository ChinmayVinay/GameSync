import Anthropic from '@anthropic-ai/sdk';
import { ReleaseNote } from './releaseNotesFetchers';

export class ReleaseNotesSummarizer {
  private static anthropic: Anthropic | null = null;

  private static getClaude(): Anthropic | null {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.warn('Anthropic API key not found. Falling back to basic summarization.');
      return null;
    }

    if (!this.anthropic) {
      this.anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }

    return this.anthropic;
  }

  static async summarizeReleaseNotes(
    releaseNotes: ReleaseNote[],
    gameName: string,
    lastPlayedDate: string
  ): Promise<string> {
    if (releaseNotes.length === 0) {
      return `No release notes found for ${gameName} since ${new Date(lastPlayedDate).toDateString()}. The game might not have had any updates, or the release notes might not be available.`;
    }

    const claude = this.getClaude();

    if (claude) {
      return this.aiSummarize(claude, releaseNotes, gameName, lastPlayedDate);
    } else {
      return this.basicSummarize(releaseNotes, gameName, lastPlayedDate);
    }
  }

  private static async aiSummarize(
    claude: Anthropic,
    releaseNotes: ReleaseNote[],
    gameName: string,
    lastPlayedDate: string
  ): Promise<string> {
    try {
      const releaseNotesText = releaseNotes.map(note =>
        `**${note.title}** (${new Date(note.date).toDateString()}):\n${note.content}`
      ).join('\n\n');

      const prompt = `Please analyze the following release notes for ${gameName} since ${new Date(lastPlayedDate).toDateString()}.

Create a response with this EXACT format:

## 📋 Summary
[Write a 2-3 sentence overview of the most important changes that happened since they last played]

## 🔄 Version Updates

[For each release note, create a section like this:]

### [Version/Update Title] - [Date]
• **[Category]:** [Important change]
• **[Category]:** [Important change]
• **[Category]:** [Important change]

Use these categories: Gameplay, Balance, New Content, Bug Fixes, Performance, Features, Maps, Characters/Heroes/Champions, Items/Weapons

Release Notes to analyze:
${releaseNotesText}`;

      const completion = await claude.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 1500,
        temperature: 0.3,
        system: "You are a helpful assistant that analyzes game release notes for players who have been away from the game. Follow the exact format requested and focus on the most important changes that would affect their gameplay experience.",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return completion.content[0].type === 'text'
        ? completion.content[0].text
        : this.basicSummarize(releaseNotes, gameName, lastPlayedDate);
    } catch (error) {
      console.error('Error with Claude AI summarization:', error);
      return this.basicSummarize(releaseNotes, gameName, lastPlayedDate);
    }
  }

  private static basicSummarize(
    releaseNotes: ReleaseNote[],
    gameName: string,
    lastPlayedDate: string
  ): string {
    const daysSince = Math.floor((Date.now() - new Date(lastPlayedDate).getTime()) / (1000 * 60 * 60 * 24));

    let summary = `## 📋 Summary\n\n`;
    summary += `${gameName} has had ${releaseNotes.length} significant updates since you last played ${daysSince} days ago. `;
    summary += `These updates include gameplay changes, balance adjustments, new content, and bug fixes that may impact your experience.\n\n`;

    summary += `## 🔄 Version Updates\n\n`;

    releaseNotes.forEach((note) => {
      const noteDate = new Date(note.date);
      summary += `### ${note.title} - ${noteDate.toDateString()}\n`;

      // Extract key points from content
      const content = note.content;
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);

      // Create bullet points for important changes
      sentences.slice(0, 4).forEach(sentence => {
        const trimmed = sentence.trim();
        if (trimmed) {
          // Try to categorize the change
          let category = "General";
          if (trimmed.toLowerCase().includes('balanc') || trimmed.toLowerCase().includes('nerf') || trimmed.toLowerCase().includes('buff')) {
            category = "Balance";
          } else if (trimmed.toLowerCase().includes('new') || trimmed.toLowerCase().includes('add')) {
            category = "New Content";
          } else if (trimmed.toLowerCase().includes('fix') || trimmed.toLowerCase().includes('bug')) {
            category = "Bug Fixes";
          } else if (trimmed.toLowerCase().includes('map')) {
            category = "Maps";
          } else if (trimmed.toLowerCase().includes('performance') || trimmed.toLowerCase().includes('optimiz')) {
            category = "Performance";
          }

          summary += `• **${category}:** ${trimmed}\n`;
        }
      });
      summary += `\n`;
    });

    summary += `💡 **Note:** This is a basic summary. For AI-powered analysis, add your Claude API key to get more detailed insights.`;

    return summary;
  }
}