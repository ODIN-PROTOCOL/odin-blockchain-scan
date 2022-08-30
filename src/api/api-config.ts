export const API_CONFIG = {
  api: process.env.VUE_APP_API_URL as string,
  rpc: process.env.VUE_APP_RPC_URL as string,
  faucet: process.env.VUE_APP_FAUCET_URL as string,
  exBridge: process.env.VUE_APP_EX_BRIDGE_URL as string,
  exBridgeFee: process.env.VUE_APP_EX_BRIDGE_FEE as string,
  telemetryUrl: process.env.VUE_APP_TELEMETRY_URL?.slice(0, -1) as string,
  graphqlUrl: process.env.VUE_APP_NEXT_PUBLIC_GRAPHQL_URL as string,
  graphqlActions: process.env.VUE_APP_GRAPHQL_ACTIONS_URL as string,
}

export enum COINS_LIST {
  LOKI = 'loki',
  ODIN = 'odin',
  GEO = 'geo',
}
export const START_VALUE = {
  minHeight: process.env.VUE_APP_MIN_POSSIBLE_BLOCK_HEIGHT as string,
  walletLink: process.env.VUE_APP_LINK_TO_WALLET as string,
  server: process.env.VUE_APP_SERVER as string,
  medium: 'https://odinprotocol.medium.com/',
  reddit: 'https://www.reddit.com/r/OdinProtocol',
  discord: 'https://discord.gg/cUXKyRq',
  twitter: 'https://twitter.com/odinprotocol',
  gitHub: 'https://github.com/ODIN-PROTOCOL',
  docs: 'https://geodb.gitbook.io/odin-protocol/getting-started',
  mainnetWeb: 'http://mainnet.odinprotocol.io/',
  mainnetScan: 'https://scan.odinprotocol.io/',
  infoOdin: 'https://odinprotocol.io/',
  testnetWeb: 'http://testnet.odinprotocol.io/',
  testnetScan: 'https://odin-web-mainnet.web.app/',
}
