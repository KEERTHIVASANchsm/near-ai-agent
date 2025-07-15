import React from 'react';
import { Intent, PortfolioRule } from '../types';

interface PortfolioViewProps {
  intent: Intent;
  onExecute: () => void;
}

const PortfolioView: React.FC<PortfolioViewProps> = ({ intent, onExecute }) => {
  const total = intent.rules.reduce((sum, rule) => sum + rule.target_percentage, 0);
  
  return (
    <div className="card">
      <h2>Your Investment Strategy</h2>
      
      <div className="portfolio-summary">
        <div className="portfolio-rules">
          {intent.rules.map((rule, i) => (
            <div key={i} className="rule">
              <div className="token">{rule.token.split('.')[0]}</div>
              <div className="target">{rule.target_percentage}%</div>
              <div className="bar-container">
                <div 
                  className="bar" 
                  style={{ width: `${rule.target_percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="execution-info">
          <p><strong>Trigger:</strong> {formatTrigger(intent.frequency)}</p>
          <p><strong>Threshold:</strong> {intent.threshold}% deviation</p>
          <p><strong>Last Executed:</strong> {intent.last_executed ? 
            new Date(intent.last_executed / 1_000_000).toLocaleString() : 'Never'}</p>
          
          <button onClick={onExecute} className="execute-btn">
            Execute Now
          </button>
        </div>
      </div>
    </div>
  );
};

function formatTrigger(frequency: string) {
  switch(frequency) {
    case 'eth_price_gt_3500': return 'When ETH > $3500';
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    default: return frequency;
  }
}

export default PortfolioView;