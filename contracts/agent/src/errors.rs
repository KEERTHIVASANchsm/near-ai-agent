#[derive(Debug, PartialEq, near_sdk::serde::Serialize, near_sdk::serde::Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub enum ContractError {
    Unauthorized,
    InvalidInput(String),
    InsufficientDeposit { expected: u128, actual: u128 },
    NotFound,
    AlreadyExists,
}

impl std::fmt::Display for ContractError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Unauthorized => write!(f, "Unauthorized access"),
            Self::InvalidInput(msg) => write!(f, "Invalid input: {}", msg),
            Self::InsufficientDeposit { expected, actual } => 
                write!(f, "Insufficient deposit: expected {}, got {}", expected, actual),
            Self::NotFound => write!(f, "Resource not found"),
            Self::AlreadyExists => write!(f, "Resource already exists"),
        }
    }
}