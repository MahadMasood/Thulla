'use client';

import { useState } from 'react';
import { recordLoss } from '@/actions/playerActions';

type Player = {
  _id: string;
  name: string;
  losses: number;
};

export default function LeaderboardClient({ initialPlayers }: { initialPlayers: Player[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  if (initialPlayers.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--text-secondary)' }}>No players yet!</h3>
        <p style={{ marginTop: '0.5rem' }}>Add some friends to start the leaderboard.</p>
      </div>
    );
  }

  async function handleLoss(playerId: string) {
    setLoadingId(playerId);
    await recordLoss(playerId);
    setLoadingId(null);
  }

  return (
    <div className="leaderboard-list">
      {initialPlayers.map((player, index) => (
        <div key={player._id} className="glass-panel player-card">
          <div className="player-info">
            <div className="player-rank">#{index + 1}</div>
            <div className="player-name">{player.name}</div>
          </div>
          
          <div className="player-stats">
            <div className="losses-count">
              <div className="losses-value">{player.losses}</div>
              <div className="losses-label">Losses</div>
            </div>
            <button 
              className="action-btn"
              onClick={() => handleLoss(player._id)}
              disabled={loadingId === player._id}
            >
              {loadingId === player._id ? '...' : '+1 Loss'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
