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
