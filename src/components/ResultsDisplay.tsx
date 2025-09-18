import React from 'react';

interface ResultsDisplayProps {
  summary: string;
  selectedGame: string;
}

interface ParsedContent {
  summary: string;
  versions: {
    title: string;
    date: string;
    changes: {
      category: string;
      description: string;
    }[];
  }[];
}

const parseMarkdownContent = (content: string): ParsedContent => {
  const lines = content.split('\n').filter(line => line.trim());

  let summary = '';
  const versions: ParsedContent['versions'] = [];
  let currentVersion: any = null;
  let inSummary = false;
  let inVersions = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and markdown symbols
    if (!trimmed || trimmed === '#' || trimmed === '##' || trimmed === '###') continue;

    // Detect summary section
    if (trimmed.includes('Summary') || trimmed.includes('📋')) {
      inSummary = true;
      inVersions = false;
      continue;
    }

    // Detect version updates section
    if (trimmed.includes('Version Updates') || trimmed.includes('🔄')) {
      inSummary = false;
      inVersions = true;
      continue;
    }

    // Parse summary content
    if (inSummary && !trimmed.startsWith('#')) {
      summary += trimmed + ' ';
      continue;
    }

    // Parse version headers (### title - date)
    if (inVersions && (trimmed.startsWith('###') || trimmed.includes(' - ')) && !trimmed.startsWith('•')) {
      if (currentVersion) {
        versions.push(currentVersion);
      }

      const cleaned = trimmed.replace(/^#+\s*/, '');
      const parts = cleaned.split(' - ');
      currentVersion = {
        title: parts[0] || cleaned,
        date: parts[1] || '',
        changes: []
      };
      continue;
    }

    // Parse bullet points (• **Category:** description)
    if (inVersions && trimmed.startsWith('•') && currentVersion) {
      const bulletContent = trimmed.replace(/^•\s*/, '');
      const match = bulletContent.match(/\*\*(.*?)\*\*:\s*(.*)/);

      if (match) {
        currentVersion.changes.push({
          category: match[1],
          description: match[2]
        });
      } else {
        // Handle bullets without category
        currentVersion.changes.push({
          category: 'General',
          description: bulletContent
        });
      }
    }
  }

  // Add last version
  if (currentVersion) {
    versions.push(currentVersion);
  }

  return {
    summary: summary.trim(),
    versions
  };
};

const getCategoryIcon = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('balance')) return '⚖️';
  if (cat.includes('new content') || cat.includes('content')) return '🆕';
  if (cat.includes('bug') || cat.includes('fix')) return '🐛';
  if (cat.includes('performance')) return '⚡';
  if (cat.includes('gameplay')) return '🎮';
  if (cat.includes('feature')) return '✨';
  if (cat.includes('map')) return '🗺️';
  if (cat.includes('character') || cat.includes('hero') || cat.includes('champion')) return '🦸';
  if (cat.includes('item') || cat.includes('weapon')) return '⚔️';
  return '📝';
};

const getCategoryColor = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('balance')) return 'text-yellow-400 bg-yellow-500/20';
  if (cat.includes('new content') || cat.includes('content')) return 'text-green-400 bg-green-500/20';
  if (cat.includes('bug') || cat.includes('fix')) return 'text-red-400 bg-red-500/20';
  if (cat.includes('performance')) return 'text-blue-400 bg-blue-500/20';
  if (cat.includes('gameplay')) return 'text-purple-400 bg-purple-500/20';
  if (cat.includes('feature')) return 'text-cyan-400 bg-cyan-500/20';
  if (cat.includes('map')) return 'text-orange-400 bg-orange-500/20';
  if (cat.includes('character') || cat.includes('hero') || cat.includes('champion')) return 'text-pink-400 bg-pink-500/20';
  if (cat.includes('item') || cat.includes('weapon')) return 'text-indigo-400 bg-indigo-500/20';
  return 'text-gray-400 bg-gray-500/20';
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ summary, selectedGame }) => {
  const parsed = parseMarkdownContent(summary);

  return (
    <div className="mt-8 animate-fade-in">
      {/* Summary Section */}
      <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/40 to-black/40 backdrop-blur-lg rounded-2xl border border-purple-500/30">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-4 flex items-center">
          📋 Summary
        </h2>
        <p className="text-gray-200 text-lg leading-relaxed">
          {parsed.summary}
        </p>
      </div>

      {/* Version Updates */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-6 flex items-center">
          🔄 Version Updates
        </h2>

        <div className="space-y-6">
          {parsed.versions.map((version, index) => (
            <div
              key={index}
              className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-purple-500/30 p-6 hover:border-purple-500/50 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{version.title}</h3>
                {version.date && (
                  <span className="text-purple-400 bg-purple-500/20 px-3 py-1 rounded-full text-sm">
                    {version.date}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {version.changes.map((change, changeIndex) => (
                  <div
                    key={changeIndex}
                    className="flex items-start space-x-3 p-3 bg-gray-900/40 rounded-lg hover:bg-gray-900/60 transition-colors"
                  >
                    <span className="text-lg flex-shrink-0">
                      {getCategoryIcon(change.category)}
                    </span>
                    <div className="flex-grow">
                      <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium mr-3 ${getCategoryColor(change.category)}`}>
                        {change.category}
                      </span>
                      <span className="text-gray-300">
                        {change.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};