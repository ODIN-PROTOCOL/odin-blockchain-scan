import { BlockResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import { BlockMeta } from '@cosmjs/tendermint-rpc'
import { Chart, ChartType, TooltipModel } from 'chart.js'
import { BigNumber } from 'bignumber.js'

export type Link = {
  to?: string
  name?: string
  text?: string
  title?: string
  url?: string
}
export type LinkList = {
  name: string
  links: Array<Link>
}

export type ChartLabelsType = {
  validatorAddress: string
  blocksCounter: string | number
  stakePercentage: string | number
  rank: number | string
  date: string
  volume: string | number
  txs: string | number
}

export type CoingeckoCoinsType = {
  data: {
    name: string
    symbol: string
    market_data: {
      current_price: { usd: string }
      market_cap: { usd: string }
      total_supply: number | string
    }
  }
}

export type SearchResultType = {
  blocks?: Array<TransformedBlocks>
  transactions?: Array<DecodedTxData>
  accounts?: Array<TempSearchAccountInfoType>
}

export type TempSearchAccountInfoType = {
  address: string
  geoBalance: Coin
  odinBalance: Coin
}

export type CoinBlocksDataType = {
  info: {
    name: string
    supply: number | string
    precision: string
  }
  amount: {
    balances: string
    community_pool: string
    treasury_pool: string
    providers_pool: string
  }
}

export type TempBalanceType = {
  address: string
  geo_balance: number
  geo_percent: string
  odin_balance: number
  odin_percent: string
  tx_count: number
}

export type DecodedTxData = {
  voter?: string
  type: string
  hash?: string
  block?: string | number | undefined
  delegatorAddress?: string
  time: string | Date | number
  sender?: string
  receiver?: string
  amount?: string | BigNumber
  denom?: string
  fee?: string | BigNumber
  feeDenom?: string
  status?: number | string | undefined
  memo?: string
  gasWanted?: string | number
  gasUsed?: string | number
}

export interface blocksWithTotalTxInterface extends BlockMeta {
  total_tx: string | number
  validator: string
}
export interface TransformedBlocks extends BlockMeta {
  validator: string
  txs: number
}

export type externalTooltipType = {
  chart?: Chart
  replay?: boolean | undefined
  tooltip?: TooltipModel<ChartType>
}

export type titleLineType = {
  stakePercentage: string
  validatorAddress: string
  blocksCounter: string
  date: string
}

export interface searchBlocksInterface extends BlockResponse {
  total_tx?: string | number
}

export type marginType = {
  top: number
  right: number
  bottom: number
  left: number
}

export type telemetryDataForCharts = {
  date: string
  size?: number
  seconds?: number
  volume?: number
  fee?: Coin[]
}

export type formatedTelemetryDataForCharts = {
  data: number[]
  labels: string[]
}

export type SimpleDoughnutChartAdditionalInfo = {
  count: number
  percent: number
  title: string
  denom: string
}

export type ExtendedDoughnutChartAdditionalInfo = {
  validatorAddress: string
  Blocks: number
  'Stake percentage': string
}

export type PreparedPoolsData = {
  balances: string
  community: string
  treasury: string
  data_provider: string
  total_supply: string
}

export enum POOLS_IDS {
  COMMUNITY = 'community_pool',
  TREASURY = 'treasury_pool',
  DATA_PROVIDERS = 'data_providers_pool',
}

export type POOL = {
  id: POOLS_IDS
  type: string
  attributes: { coins: Coin[] }
}
export interface EventTx {
  readonly type: string
  readonly attributes?: [{ readonly key: string; readonly value: string }]
}
export interface TxData {
  readonly code: number
  readonly codeSpace?: string
  readonly log?: string
  readonly data?: string | null
  readonly events: EventTx[]
  readonly gas_wanted: string
  readonly gas_used: string
}
export interface TxTelemetry {
  readonly tx: string
  readonly hash: string
  readonly height: number
  readonly index: number
  readonly tx_result: TxData
}
export interface TxSearchTelemetry {
  readonly txs: readonly TxTelemetry[]
  readonly totalCount: number
}

export type AmountDetails = {
  amount: string
  denom: string
}

export type txFromTelemetry = {
  amount: AmountDetails[]
  block: number
  fee: AmountDetails[]
  receiver: string
  sender: string
  timestamp: number
  tx_hash: string
  type: string
}
