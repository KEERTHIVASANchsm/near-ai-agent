#!/bin/bash
set -e

# Set environment
export CONTRACT_NAME=agent.$USER.testnet
export NETWORK=testnet

# Build contract
cd contracts/agent
RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p ../../out
cp target/wasm32-unknown-unknown/release/*.wasm ../../out/agent.wasm
cd ../../

# Deploy to NEAR testnet
near deploy $CONTRACT_NAME \
  --wasmFile out/agent.wasm \
  --initFunction new \
  --initArgs '{}' \
  --networkId $NETWORK

echo "Contract deployed to $CONTRACT_NAME on $NETWORK"