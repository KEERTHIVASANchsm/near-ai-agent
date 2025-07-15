# Detailed Deployment Guide

## Smart Contract
```bash
# 1. Build WASM
RUSTFLAGS='-C link-arg=-s' cargo build --release --target wasm32-unknown-unknown

# 2. Deploy to Testnet
near deploy \
  --wasmFile target/wasm32-unknown-unknown/release/near_ai_agent.wasm \
  --accountId agent.$USER.testnet \
  --initFunction new \
  --initArgs '{"owner_id":"'$USER.testnet'"}'