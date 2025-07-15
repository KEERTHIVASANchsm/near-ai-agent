import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Wallet } from '../near';

interface NearContextType {
  wallet: any;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
}

const NearContext = createContext<NearContextType | undefined>(undefined);

export function NearProvider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    Wallet.init().then(() => {
      setWallet(Wallet.getWallet());
    });
  }, []);

  const value = {
    wallet,
    isSignedIn: wallet?.isSignedIn() || false,
    signIn: () => wallet?.requestSignIn({ contractId: import.meta.env.VITE_CONTRACT_NAME }),
    signOut: () => wallet?.signOut(),
  };

  return <NearContext.Provider value={value}>{children}</NearContext.Provider>;
}

export function useNearContext() {
  const context = useContext(NearContext);
  if (context === undefined) {
    throw new Error('useNearContext must be used within a NearProvider');
  }
  return context;
}