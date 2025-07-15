use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{AccountId, json_types::U128, Timestamp};

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct PortfolioRule {
    pub token: AccountId,
    pub target_percentage: u8,
    pub current_balance: Option<U128>,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Intent {
    pub action: String,
    pub rules: Vec<PortfolioRule>,
    pub threshold: u8,
    pub frequency: String,
    pub conditions: Option<String>,
    pub signature: String,
    pub eth_address: String,
    pub last_executed: Timestamp,
}