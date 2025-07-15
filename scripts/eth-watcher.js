const { ethers } = require('ethers');
const axios = require('axios');
const nearAPI = require('near-api-js');

// Configurations
const ETH_RPC_URL = 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
const ETH_PRIVATE_KEY = 'YOUR_ETH_PRIVATE_KEY';
const NEAR_ACCOUNT_ID = 'your-agent.near';
const NEAR_PRIVATE_KEY = 'YOUR_NEAR_PRIVATE_KEY';

// Initialize Ethereum provider
const ethProvider = new ethers.JsonRpcProvider(ETH_RPC_URL);
const ethSigner = new ethers.Wallet(ETH_PRIVATE_KEY, ethProvider);

// Initialize NEAR connection
async function initNear() {
  const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
  await keyStore.setKey('mainnet', NEAR_ACCOUNT_ID, nearAPI.KeyPair.fromString(NEAR_PRIVATE_KEY));
  
  const near = await nearAPI.connect({
    networkId: 'mainnet',
    keyStore,
    nodeUrl: 'https://rpc.mainnet.near.org',
  });
  
  return near.account(NEAR_ACCOUNT_ID);
}

// Monitor ETH price and trigger intent
async function monitorAndExecute() {
  try {
    const price = await getETHPrice();
    console.log(`Current ETH price: $${price}`);
    
    if (price > 3500) {
      console.log('ETH price > $3500, triggering intent...');
      
      // Create intent message
      const intentData = {
        action: 'rebalance',
        rules: [
          { token: 'usdc.near', target_percentage: 60 },
          { token: 'wrap.near', target_percentage: 40 },
        ],
        threshold: 5,
        frequency: 'eth_price_gt_3500',
        last_executed: Date.now(),
      };
      
      // Sign with Ethereum
      const message = JSON.stringify(intentData);
      const signature = await ethSigner.signMessage(message);
      
      // Submit to NEAR contract
      const nearAccount = await initNear();
      await nearAccount.functionCall({
        contractId: NEAR_ACCOUNT_ID,
        methodName: 'submit_intent',
        args: {
          intent: {
            ...intentData,
            signature,
            eth_address: ethSigner.address,
          }
        },
        gas: '300000000000000',
      });
      
      console.log('Intent submitted successfully!');
    }
  } catch (error) {
    console.error('Error in monitoring:', error);
  }
}

// Get ETH price from CoinGecko
async function getETHPrice() {
  const response = await axios.get(
    'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
  );
  return response.data.ethereum.usd;
}

// Run every 5 minutes
setInterval(monitorAndExecute, 5 * 60 * 1000);
monitorAndExecute();    