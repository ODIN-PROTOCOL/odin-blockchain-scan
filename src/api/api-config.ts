import { stringToPath } from '@cosmjs/crypto'

export const API_CONFIG = {
  api: process.env.VUE_APP_API_URL as string,
  rpc: process.env.VUE_APP_RPC_URL as string,
  faucet: process.env.VUE_APP_FAUCET_URL as string,
  exBridge: process.env.VUE_APP_EX_BRIDGE_URL as string,
  exBridgeFee: process.env.VUE_APP_EX_BRIDGE_FEE as string,
  hdDeviation: stringToPath(process.env.VUE_APP_DEVIATION as string),
  telemetryUrl: (process.env.VUE_APP_TELEMETRY_URL || '').replace(
    /\/$/,
    ''
  ) as string,
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
  github: 'https://github.com/ODIN-PROTOCOL',
  docs: 'https://geodb.gitbook.io/odin-protocol/getting-started',
  mainnetWeb: 'http://mainnet.odinprotocol.io/',
  mainnetScan: 'https://scan.odinprotocol.io/',
  infoOdin: 'https://odinprotocol.io/',
  testnetWeb: 'http://testnet.odinprotocol.io/',
  testnetScan: 'https://odin-web-mainnet.web.app/',
}
