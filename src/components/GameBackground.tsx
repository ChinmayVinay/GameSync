import React from 'react';

interface GameBackgroundProps {
  selectedGame: string;
}

const getGameTheme = (gameId: string) => {
  switch (gameId) {
    case 'cs2':
      return {
        gradient: 'from-orange-900 via-red-900 to-gray-900',
        pattern: 'bg-[radial-gradient(circle_at_30%_70%,rgba(255,165,0,0.15)_0%,transparent_50%)]',
        backgroundImage: '/images/games/cs2-bg.jpg',
        particles: [
          { color: 'bg-orange-400', size: 'w-2 h-2', pos: { top: '15%', left: '85%' } },
          { color: 'bg-red-400', size: 'w-1 h-1', pos: { top: '75%', left: '15%' } },
          { color: 'bg-yellow-400', size: 'w-3 h-3', pos: { top: '45%', left: '90%' } },
          { color: 'bg-orange-300', size: 'w-1 h-1', pos: { top: '25%', left: '20%' } },
        ],
        patternSvg: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ff6b00' fill-opacity='0.1'%3E%3Cpath d='M30 0l30 30-30 30L0 30z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      };
    case 'lol':
      return {
        gradient: 'from-blue-900 via-indigo-900 to-purple-900',
        pattern: 'bg-[radial-gradient(circle_at_70%_30%,rgba(79,70,229,0.15)_0%,transparent_50%)]',
        backgroundImage: '/images/games/lol-bg.jpg',
        particles: [
          { color: 'bg-blue-400', size: 'w-2 h-2', pos: { top: '20%', left: '10%' } },
          { color: 'bg-purple-400', size: 'w-1 h-1', pos: { top: '60%', left: '80%' } },
          { color: 'bg-indigo-400', size: 'w-3 h-3', pos: { top: '40%', left: '25%' } },
          { color: 'bg-cyan-400', size: 'w-1 h-1', pos: { top: '80%', left: '70%' } },
        ],
        patternSvg: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.08'%3E%3Cpolygon points='20 0 40 20 20 40 0 20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      };
    case 'overwatch':
      return {
        gradient: 'from-cyan-900 via-blue-900 to-purple-900',
        pattern: 'bg-[radial-gradient(circle_at_50%_20%,rgba(6,182,212,0.15)_0%,transparent_50%)]',
        backgroundImage: '/images/games/overwatch-bg.jpg',
        particles: [
          { color: 'bg-cyan-400', size: 'w-2 h-2', pos: { top: '30%', left: '90%' } },
          { color: 'bg-blue-400', size: 'w-1 h-1', pos: { top: '70%', left: '20%' } },
          { color: 'bg-purple-400', size: 'w-3 h-3', pos: { top: '50%', left: '75%' } },
          { color: 'bg-teal-400', size: 'w-1 h-1', pos: { top: '85%', left: '50%' } },
        ],
        patternSvg: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2306b6d4' fill-opacity='0.1'%3E%3Ccircle cx='40' cy='40' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      };
    default:
      return {
        gradient: 'from-purple-900 via-black to-gray-900',
        pattern: 'bg-[radial-gradient(circle_at_50%_50%,rgba(147,51,234,0.1)_0%,transparent_50%)]',
        backgroundImage: '',
        particles: [
          { color: 'bg-purple-400', size: 'w-2 h-2', pos: { top: '20%', left: '10%' } },
          { color: 'bg-purple-500', size: 'w-1 h-1', pos: { top: '60%', left: '80%' } },
          { color: 'bg-purple-300', size: 'w-3 h-3', pos: { top: '40%', left: '20%' } },
          { color: 'bg-purple-600', size: 'w-1 h-1', pos: { top: '80%', left: '60%' } },
        ],
        patternSvg: ''
      };
  }
};

export const GameBackground: React.FC<GameBackgroundProps> = ({ selectedGame }) => {
  const theme = getGameTheme(selectedGame);

  return (
    <>
      {/* Game background image */}
      {theme.backgroundImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${theme.backgroundImage})`,
            filter: 'brightness(0.6) contrast(1.1)',
          }}
        />
      )}

      {/* Minimal dark overlay for text readability */}
      {theme.backgroundImage && (
        <div className="absolute inset-0 bg-black/20 transition-opacity duration-1000" />
      )}

      {/* Fallback gradient background (only when no image) */}
      {!theme.backgroundImage && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${theme.gradient} transition-all duration-1000 ease-in-out`}
        />
      )}

      {/* Subtle pattern overlay (reduced opacity) */}
      {!theme.backgroundImage && (
        <div
          className={`absolute inset-0 ${theme.pattern} animate-pulse transition-opacity duration-1000 opacity-50`}
        />
      )}

      {/* SVG Pattern background (only when no image) */}
      {theme.patternSvg && !theme.backgroundImage && (
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: theme.patternSvg,
            backgroundSize: '60px 60px',
            backgroundRepeat: 'repeat'
          }}
        />
      )}

      {/* Game-specific floating particles (reduced opacity for images) */}
      <div className="absolute inset-0 overflow-hidden">
        {theme.particles.map((particle, index) => (
          <div
            key={`${selectedGame}-${index}`}
            className={`absolute ${particle.size} ${particle.color} rounded-full animate-bounce ${theme.backgroundImage ? 'opacity-40' : 'opacity-80'}`}
            style={{
              top: particle.pos.top,
              left: particle.pos.left,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + index}s`
            }}
          />
        ))}
      </div>
    </>
  );
};