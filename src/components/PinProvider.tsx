'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type PinContextType = {
  pin: string | null;
  isUnlocked: boolean;
  unlock: (pin: string) => void;
  lock: () => void;
};

const PinContext = createContext<PinContextType>({
  pin: null,
  isUnlocked: false,
  unlock: () => {},
  lock: () => {},
});

export function PinProvider({ children }: { children: React.ReactNode }) {
  const [pin, setPin] = useState<string | null>(null);
  
  useEffect(() => {
    const savedPin = localStorage.getItem('admin_pin');
    if (savedPin) {
      setPin(savedPin);
    }
  }, []);

  const unlock = (newPin: string) => {
    setPin(newPin);
    localStorage.setItem('admin_pin', newPin);
  };

  const lock = () => {
    setPin(null);
    localStorage.removeItem('admin_pin');
  };

  return (
    <PinContext.Provider value={{ pin, isUnlocked: !!pin, unlock, lock }}>
      {children}
    </PinContext.Provider>
  );
}

export const usePin = () => useContext(PinContext);
