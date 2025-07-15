import { connect, WalletConnection, Contract } from 'near-api-js';

const config = {
  networkId: 'testnet',
  nodeUrl: 'https://rpc.testnet.near.org',
  walletUrl: 'https://wallet.testnet.near.org',
  contractName: 'agent.your-account.testnet',
};

let wallet: WalletConnection;
let contract: Contract;

export async function initNear() {
  const near = await connect({
    networkId: config.networkId,
    keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    nodeUrl: config.nodeUrl,
    walletUrl: config.walletUrl,
  });
  
  wallet = new WalletConnection(near, 'near-ai-agent');
  
  if (wallet.isSignedIn()) {
    contract = new Contract(wallet.account(), config.contractName, {
      viewMethods: ['get_intent', 'get_intent_history', 'get_preferences'],
      changeMethods: ['submit_intent', 'execute_intent'],
    });
  }
  
  return { wallet, contract };
}

export function signIn() {
  wallet.requestSignIn({ contractId: config.contractName });
}

export function signOut() {
  wallet.signOut();
}

export function getAccountId() {
  return wallet.getAccountId();
}

export const contractMethods = {
  submitIntent: (intent: any) => (contract as any).submit_intent({ intent }),
  executeIntent: () => (contract as any).execute_intent(),
  getIntent: () => (contract as any).get_intent({ account_id: getAccountId() }),
  getHistory: () => (contract as any).get_intent_history({ account_id: getAccountId() }),
};