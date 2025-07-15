# NEAR AI Agent Architecture

## Core Components
```mermaid
graph TD
    A[React Frontend] -->|Submit Strategy| B[NEAR Contract]
    C[Ethereum] -->|Monitor Events| D[Node.js Watcher]
    D -->|Trigger Execution| B
    B -->|Swap Tokens| E[Ref Finance]
    B -->|Store Results| F[On-chain History]