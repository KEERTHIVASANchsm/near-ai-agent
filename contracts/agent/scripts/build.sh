#!/bin/bash
set -e

cd "$(dirname "$0")/.."

RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release
mkdir -p ../out
cp target/wasm32-unknown-unknown/release/*.wasm ../out/contract.wasm
echo "✅ Contract built successfully"