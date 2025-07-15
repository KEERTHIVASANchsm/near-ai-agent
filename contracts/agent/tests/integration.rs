use near_sdk::{test_utils::VMContextBuilder, testing_env, AccountId};
use crate::{Contract, ContractExt};

fn setup_contract() -> Contract {
    let context = VMContextBuilder::new()
        .signer_account_id(AccountId::new_unchecked("alice.testnet".to_string()))
        .build();
    testing_env!(context);
    Contract::new()
}

#[test]
fn test_initial_state() {
    let contract = setup_contract();
    assert_eq!(contract.get_entries().len(), 0);
}

#[test]
#[should_panic(expected = "Unauthorized")]
fn test_unauthorized_access() {
    let mut contract = setup_contract();
    // This should panic when not called by owner
    contract.owner_only_method();
}