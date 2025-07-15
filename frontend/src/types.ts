export interface PortfolioRule {
  token: string;
  target_percentage: number;
  current_balance?: string;
}

export interface Intent {
  action: string;
  rules: PortfolioRule[];
  threshold: number;
  frequency: string;
  conditions?: string;
  signature: string;
  eth_address: string;
  last_executed?: number;
}