import React from 'react';
import { Intent } from '../types';

interface HistoryListProps {
  history: Intent[];
}

const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="card">
        <h2>Execution History</h2>
        <p>No execution history yet</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>Execution History</h2>
      <div className="history-list">
        {history.map((intent, index) => (
          <div key={index} className="history-item">
            <div className="history-header">
              <span className="action">{intent.action.toUpperCase()}</span>
              <span className="timestamp">
                {new Date(intent.last_executed! / 1_000_000).toLocaleString()}
              </span>
            </div>
            
            <div className="rules-summary">
              {intent.rules.map((rule, i) => (
                <span key={i} className="rule-badge">
                  {rule.token.split('.')[0]}: {rule.target_percentage}%
                </span>
              ))}
            </div>
            
            <div className="execution-details">
              <div className="detail">
                <label>Trigger:</label>
                <span>{formatTrigger(intent.frequency)}</span>
              </div>
              <div className="detail">
                <label>Threshold:</label>
                <span>{intent.threshold}%</span>
              </div>
              <div className="detail">
                <label>Signature:</label>
                <span className="signature">
                  {intent.signature.slice(0, 6)}...{intent.signature.slice(-4)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function formatTrigger(frequency: string) {
  switch(frequency) {
    case 'eth_price_gt_3500': return 'ETH > $3500';
    case 'daily': return 'Daily';
    case 'weekly': return 'Weekly';
    default: return frequency;
  }
}

export default HistoryList;