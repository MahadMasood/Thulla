'use client';

import { useState } from 'react';
import { recordLoss, decreaseLoss } from '@/actions/playerActions';
import { usePin } from './PinProvider';

type Player = {
  _id: string;
  name: string;
  losses: number;
};

export default function LeaderboardClient({ initialPlayers }: { initialPlayers: Player[] }) {
  const { pin, isUnlocked } = usePin();
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
    const result = await recordLoss(playerId, pin || '');
    if (!result.success) alert(result.error);
    setLoadingId(null);
  }

  async function handleDecrease(playerId: string) {
    setLoadingId(playerId);
    const result = await decreaseLoss(playerId, pin || '');
    if (!result.success) alert(result.error);
    setLoadingId(null);
  }

  return (
    <div className="leaderboard-list">
      {initialPlayers.map((player, index) => (
        <div key={player._id} className="glass-panel player-card">
          <div className="player-info">
            <div className="player-rank">#{index + 1}</div>
            <div className="player-name">
              {player.name} 
              {index === 0 && player.losses > 0 && <span className="roti-badge">🍕 Roti Sponsor</span>}
            </div>
          </div>
          
          <div className="player-stats">
            <div className="losses-count">
              <div className="losses-value">{player.losses}</div>
              <div className="losses-label">Losses</div>
            </div>
            <div className="action-buttons">
              <button 
                className="action-btn-secondary"
                onClick={() => handleDecrease(player._id)}
                disabled={loadingId === player._id || player.losses === 0 || !isUnlocked}
                title="Decrease loss (mistake)"
              >
                -1
              </button>
              <button 
                className="action-btn"
                onClick={() => handleLoss(player._id)}
                disabled={loadingId === player._id || !isUnlocked}
              >
                {loadingId === player._id ? '...' : '+1 Loss'}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
