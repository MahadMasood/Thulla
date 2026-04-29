'use client';

import { useState } from 'react';
import { usePin } from './PinProvider';
import { checkPin } from '@/actions/playerActions';

export default function LockUI() {
  const { isUnlocked, unlock, lock } = usePin();
  const [showModal, setShowModal] = useState(false);
  const [pinInput, setPinInput] = useState('');

  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    const isValid = await checkPin(pinInput);
    if (isValid) {
      unlock(pinInput);
      setPinInput('');
      setShowModal(false);
    } else {
      setError('Incorrect PIN. Please try again.');
    }
    
    setIsVerifying(false);
  };

  return (
    <>
      <div className="lock-container">
        {isUnlocked ? (
          <button className="btn-secondary" onClick={lock} title="Lock the app">
            🔓 Unlocked
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setShowModal(true)} title="Unlock to make changes">
            🔒 Locked
          </button>
        )}
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="glass-panel modal-content">
            <h3>Enter Host PIN</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
              Enter the passcode to enable changes.
            </p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="password"
                className="input-field"
                placeholder="4-digit PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                disabled={isVerifying}
              />
              {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem' }}>{error}</p>}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isVerifying}>
                  {isVerifying ? 'Checking...' : 'Unlock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
