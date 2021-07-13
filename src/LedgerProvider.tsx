import Web3ProviderEngine from 'web3-provider-engine'
// @ts-ignore
import CacheSubprovider from 'web3-provider-engine/subproviders/cache.js'
import { RPCSubprovider } from '@0x/subproviders/lib/src/subproviders/rpc_subprovider'
import { WindowPostMessageStream } from '@metamask/post-message-stream'
import LWClient from 'ledger-web-client';
import LedgerWebSubProvider from 'ledger-web-subprovider';
import client from "./client";

const engine = new Web3ProviderEngine();

const ledgerSubprovider = new LedgerWebSubProvider({
  client
});
engine.addProvider(ledgerSubprovider)
engine.addProvider(new CacheSubprovider())
engine.addProvider(new RPCSubprovider('https://mainnet.infura.io/v3/2e87c2891f3c431da2b024f83bd05571'))

engine.start();

export default engine;
