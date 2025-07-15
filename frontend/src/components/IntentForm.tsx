import React, { useState } from 'react';
import { Intent, PortfolioRule } from '../types';
import { ethers } from 'ethers';

interface IntentFormProps {
  onSubmit: (intent: Intent) => void;
}

const IntentForm: React.FC<IntentFormProps> = ({ onSubmit }) => {
  const [action, setAction] = useState('rebalance');
  const [rules, setRules] = useState<PortfolioRule[]>([
    { token: 'usdc.fakes.testnet', target_percentage: 60 },
    { token: 'wrap.testnet', target_percentage: 40 },
  ]);
  const [threshold, setThreshold] = useState(5);
  const [frequency, setFrequency] = useState('eth_price_gt_3500');
  const [signing, setSigning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigning(true);
    
    try {
      // Connect to Ethereum
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const ethAddress = await signer.getAddress();
      
      // Create and sign intent
      const intentData = {
        action,
        rules,
        threshold,
        frequency,
        last_executed: Date.now(),
      };
      
      const message = JSON.stringify(intentData);
      const signature = await signer.signMessage(message);
      
      // Submit to NEAR
      onSubmit({
        ...intentData,
        signature,
        eth_address: ethAddress,
      });
    } catch (error) {
      console.error('Signing failed:', error);
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="card">
      <h2>Define Investment Intent</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Action:</label>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="rebalance">Portfolio Rebalance</option>
            <option value="stake">Auto-Staking</option>
          </select>
        </div>

        <div className="form-group">
          <label>Portfolio Rules:</label>
          {rules.map((rule, i) => (
            <div key={i} className="rule-row">
              <input
                value={rule.token}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[i].token = e.target.value;
                  setRules(newRules);
                }}
                placeholder="Token address"
              />
              <input
                type="number"
                value={rule.target_percentage}
                onChange={(e) => {
                  const newRules = [...rules];
                  newRules[i].target_percentage = Number(e.target.value);
                  setRules(newRules);
                }}
                placeholder="Target %"
              />
            </div>
          ))}
          <button 
            type="button" 
            onClick={() => setRules([...rules, { token: '', target_percentage: 0 }])}
          >
            + Add Token
          </button>
        </div>

        <div className="form-group">
          <label>Rebalance Threshold (% deviation):</label>
          <input
            type="number"
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
        </div>

        <div className="form-group">
          <label>Execution Trigger:</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value)}>
            <option value="eth_price_gt_3500">When ETH > $3500</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>

        <button type="submit" disabled={signing}>
          {signing ? 'Signing with Ethereum...' : 'Submit Intent'}
        </button>
      </form>
    </div>
  );
};

export default IntentForm;