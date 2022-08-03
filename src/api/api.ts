import { API_CONFIG } from './api-config'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import {
  setupIbcExtension,
  IbcExtension,
  BankExtension,
  QueryClient,
  setupBankExtension,
  setupStakingExtension,
  StakingExtension,
} from '@cosmjs/stargate'
import {
  setupTelemetryExtension,
  TelemetryExt,
} from './query-ext/telemetryExtension'
import { CoinswapExt, setupCoinswapExt } from './query-ext/coinswapExtension'
import { GovExt, setupGovExt } from './query-ext/govExtension'
import { MintExt, setupMintExt } from './query-ext/mintExtension'
import { OracleExt, setupOracleExt } from './query-ext/oracleExtension'
import { stub } from '@/helpers/stubs'

type OdinQueryClient = QueryClient &
  CoinswapExt &
  GovExt &
  MintExt &
  OracleExt &
  BankExtension &
  StakingExtension &
  TelemetryExt &
  IbcExtension

class Api {
  private _query: OdinQueryClient = stub('Query not initialized!')
  private _tendermint: Tendermint34Client = stub('Tendermint not initialized!')

  async init() {
    await this._initTendermint()
    await this._initQueryClient()
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  makeQueryCaller<T extends (...args: any) => any>(
    make: (qc: OdinQueryClient) => T,
  ): T {
    return make(this._query)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  makeTendermintCaller<T extends (...args: any) => any>(
    make: (tc: Tendermint34Client) => T,
  ): T {
    return make(this._tendermint)
  }

  private async _initTendermint(): Promise<void> {
    this._tendermint = await Tendermint34Client.connect(API_CONFIG.rpc)
  }

  private async _initQueryClient(): Promise<void> {
    this._query = QueryClient.withExtensions(
      this._tendermint,
      setupCoinswapExt,
      setupGovExt,
      setupMintExt,
      setupOracleExt,
      setupStakingExtension,
      setupBankExtension,
      setupTelemetryExtension,
      setupIbcExtension,
    )
  }
}

export const api = new Api()
