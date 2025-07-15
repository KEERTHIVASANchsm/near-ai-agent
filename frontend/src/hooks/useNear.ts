import { useState, useEffect } from 'react';
import { Wallet } from '../near';

export function useNear() {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await Wallet.init();
        setWallet(Wallet.getWallet());
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  return { wallet, loading, error };
}