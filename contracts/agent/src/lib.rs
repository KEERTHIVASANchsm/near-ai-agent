//! NEAR AI Investment Agent Smart Contract

use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, AccountId, Gas, Promise, PromiseError};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::json_types::U128;
use near_sdk::ext_contract;
use near_sdk::NearToken;

// Constants for gas usage
const FT_TRANSFER_GAS: Gas = Gas::from_tgas(30);  // 30 TGas
const CALLBACK_GAS: Gas = Gas::from_tgas(10);     // 10 TGas

// Main contract structure
#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize)]
pub struct InvestmentAgent {
    owner_id: AccountId,
    strategies: Vec<InvestmentStrategy>,
}

// Investment strategy data structure
#[derive(BorshDeserialize, BorshSerialize, Deserialize, Serialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct InvestmentStrategy {
    creator: AccountId,
    token_pair: (String, String),  // (from_token, to_token)
    threshold_percentage: u8,      // 1-100%
    amount: U128,
    active: bool,
}

// Default implementation
impl Default for InvestmentAgent {
    fn default() -> Self {
        env::panic_str("Contract should be initialized before usage")
    }
}

// External trait for Fungible Token contract
#[ext_contract(ext_ft)]
trait FungibleToken {
    fn ft_transfer(&mut self, receiver_id: AccountId, amount: U128, memo: Option<String>);
}

// Contract implementation
#[near_bindgen]
impl InvestmentAgent {
    /// Initialize contract with owner
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        Self {
            owner_id,
            strategies: Vec::new(),
        }
    }

    /// Add new investment strategy
    pub fn add_strategy(
        &mut self,
        from_token: String,
        to_token: String,
        threshold: u8,
        amount: U128,
    ) -> u64 {
        assert!(threshold > 0 && threshold <= 100, "Threshold must be 1-100");
        
        let strategy = InvestmentStrategy {
            creator: env::predecessor_account_id(),
            token_pair: (from_token, to_token),
            threshold_percentage: threshold,
            amount,
            active: true,
        };
        
        self.strategies.push(strategy);
        self.strategies.len() as u64 - 1
    }

    /// Execute investment strategy
    pub fn execute_strategy(&mut self, strategy_id: u64) -> Promise {
        let strategy = self.strategies[strategy_id as usize].clone();
        assert!(strategy.active, "Strategy is inactive");
        
        ext_ft::ext(strategy.token_pair.0.parse().unwrap())
            .with_static_gas(FT_TRANSFER_GAS)
            .ft_transfer(
                env::current_account_id(),
                strategy.amount,
                Some(format!("Executing strategy {}", strategy_id)),
            )
            .then(
                Self::ext(env::current_account_id())
                    .with_static_gas(CALLBACK_GAS)
                    .callback_post_execution(strategy_id)
            )
    }

    /// Callback after execution
    #[private]
    pub fn callback_post_execution(
        &mut self,
        strategy_id: u64,
        #[callback_result] result: Result<(), PromiseError>,
    ) {
        match result {
            Ok(_) => {
                env::log_str(format!("Strategy {} executed successfully", strategy_id).as_str());
                // Mark strategy as completed
                self.strategies[strategy_id as usize].active = false;
            },
            Err(e) => {
                env::log_str(format!("Strategy failed: {:?}", e).as_str());
                // Keep strategy active for retry
            }
        }
    }

    /// Get all strategies for an account
    pub fn get_strategies(&self, account_id: AccountId) -> Vec<InvestmentStrategy> {
        self.strategies
            .iter()
            .filter(|s| s.creator == account_id)
            .cloned()
            .collect()
    }

    /// Contract owner only - emergency withdraw
    pub fn emergency_withdraw(&mut self, token_id: AccountId, amount: U128) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Owner only");
        Promise::new(token_id).transfer(NearToken::from_yoctonear(amount.0));
    }
}