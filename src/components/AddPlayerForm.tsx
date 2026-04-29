'use client';

import { useState } from 'react';
import { addPlayer } from '@/actions/playerActions';
import { usePin } from './PinProvider';

export default function AddPlayerForm() {
  const { pin, isUnlocked } = usePin();
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    setMessage('');
    
    const name = formData.get('name') as string;
    const result = await addPlayer(name, pin || '');
    
    if (result.success) {
      setMessage('Player added!');
      const form = document.getElementById('add-player-form') as HTMLFormElement;
      if (form) form.reset();
    } else {
      setMessage(result.error || 'Failed to add player');
    }
    
    setIsPending(false);
  }

  return (
    <form id="add-player-form" action={handleSubmit} className="add-player-form">
      <div>
        <input 
          type="text" 
          name="name" 
          placeholder="Friend's Name" 
          className="input-field"
          required 
          disabled={isPending || !isUnlocked}
        />
      </div>
      <button 
        type="submit" 
        className="btn-primary"
        disabled={isPending || !isUnlocked}
      >
        {isPending ? 'Adding...' : 'Add Player'}
      </button>
      {message && (
        <p style={{ color: message === 'Player added!' ? 'var(--success)' : 'var(--danger)', fontSize: '0.875rem' }}>
          {message}
        </p>
      )}
    </form>
  );
}
