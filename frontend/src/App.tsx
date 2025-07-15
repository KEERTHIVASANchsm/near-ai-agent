import React, { useEffect, useState } from 'react';
import { initNear, getAccountId, contractMethods, signIn, signOut } from './near';
import IntentForm from './components/IntentForm';
import PortfolioView from './components/PortfolioView';
import HistoryList from './components/HistoryList';
import { Intent } from './types';
import './App.css';

const App: React.FC = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [currentIntent, setCurrentIntent] = useState<Intent | null>(null);
  const [history, setHistory] = useState<Intent[]>([]);
  const [loading, setLoading] = useState(true);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      await initNear();
      const isSignedIn = !!getAccountId();
      setSignedIn(isSignedIn);
      
      if (isSignedIn) {
        await loadIntents();
      }
      setLoading(false);
    };
    
    initialize();
  }, []);

  const loadIntents = async () => {
    try {
      setLoading(true);
      const intent = await contractMethods.getIntent();
      const history = await contractMethods.getHistory();
      
      setCurrentIntent(intent || null);
      setHistory(history || []);
    } catch (error) {
      console.error('Failed to load intents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitIntent = async (intent: Intent) => {
    try {
      setLoading(true);
      await contractMethods.submitIntent(intent);
      await loadIntents();
    } catch (error) {
      console.error('Failed to submit intent:', error);
      setLoading(false);
    }
  };

  const handleExecuteIntent = async () => {
    try {
      setExecuting(true);
      await contractMethods.executeIntent();
      setTimeout(async () => {
        await loadIntents();
        setExecuting(false);
      }, 3000); // Refresh after execution
    } catch (error) {
      console.error('Execution failed:', error);
      setExecuting(false);
    }
  };

  return (
    <div className="app">
      <header>
        <div className="header-content">
          <div className="logo">
            <div className="ai-icon">🤖</div>
            <h1>NEAR AI Agent</h1>
          </div>
          <div className="wallet-section">
            {signedIn ? (
              <>
                <span className="account-id">{getAccountId()}</span>
                <button onClick={signOut} className="wallet-btn">Logout</button>
              </>
            ) : (
              <button onClick={signIn} className="wallet-btn">Connect Wallet</button>
            )}
          </div>
        </div>
      </header>

      <main>
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading agent data...</p>
          </div>
        ) : !signedIn ? (
          <div className="welcome">
            <div className="hero">
              <h2>Automate Your Crypto Investments</h2>
              <p>Define your investment strategy once and let our AI agent execute it autonomously across chains</p>
              <button onClick={signIn} className="cta-btn">Get Started</button>
            </div>
            
            <div className="features">
              <div className="feature-card">
                <div className="feature-icon">⚖️</div>
                <h3>Portfolio Rebalancing</h3>
                <p>Maintain optimal asset allocation with automatic rebalancing</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔁</div>
                <h3>Cross-Chain Execution</h3>
                <p>Monitor Ethereum, execute on NEAR using chain signatures</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🧠</div>
                <h3>Learning Agent</h3>
                <p>Adapts to your preferences over time for smarter decisions</p>
              </div>
            </div>
          </div>
        ) : currentIntent ? (
          <div className="dashboard">
            <PortfolioView 
              intent={currentIntent} 
              onExecute={handleExecuteIntent}
              executing={executing}
            />
            <HistoryList history={history} />
          </div>
        ) : (
          <IntentForm onSubmit={handleSubmitIntent} />
        )}
      </main>

      <footer>
        <p>NEAR Protocol AI Agent Challenge Submission • Built with 🤖 and ❤️</p>
      </footer>
    </div>
  );
};

export default App;