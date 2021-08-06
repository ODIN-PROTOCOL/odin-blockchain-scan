import {
  MsgCreateDataSource,
  MsgCreateOracleScript,
  MsgRequestData,
} from '@provider/codec/oracle/v1/tx'
import { MsgExchange } from '@provider/codec/coinswap/tx'
import { MsgDeposit, MsgVote } from '@provider/codec/cosmos/gov/v1beta1/tx'
import { api } from './api'
import { wallet } from './wallet'
import { mapResponse, sendPost, sendGet } from './callersHelpers'
import { decodeRequestResults } from '@/helpers/requestResultDecoders'
import { decodeProposals } from '@/helpers/proposalDecoders'
import { decodeValidators } from '@/helpers/validatorDecoders'
import { API_CONFIG } from './api-config'
import {
  MsgCreateValidator,
  MsgDelegate,
  MsgUndelegate,
} from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/tx'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'

const makeCallers = () => {
  const broadcaster = api.makeBroadcastCaller.bind(api)
  const querier = api.makeQueryCaller.bind(api)
  const tmQuerier = api.makeTendermintCaller.bind(api)

  return {
    createDataSource: broadcaster<MsgCreateDataSource>(
      '/oracle.v1.MsgCreateDataSource',
      MsgCreateDataSource
    ),
    getDataSources: querier((qc) => qc.oracle.unverified.dataSources),

    createOracleScript: broadcaster<MsgCreateOracleScript>(
      '/oracle.v1.MsgCreateOracleScript',
      MsgCreateOracleScript
    ),
    getOracleScripts: querier((qc) => qc.oracle.unverified.oracleScripts),

    createRequest: broadcaster<MsgRequestData>(
      '/oracle.v1.MsgRequestData',
      MsgRequestData
    ),
    getRequests: querier((qc) =>
      mapResponse(qc.oracle.unverified.requests, (response) => {
        return {
          ...response,
          requests: decodeRequestResults(response.requests),
        }
      })
    ),

    getProposals: querier((qc) =>
      mapResponse(qc.gov.unverified.proposals, (response) => {
        return {
          ...response,
          proposals: decodeProposals(response.proposals),
        }
      })
    ),
    getProposalVote: querier((qc) => qc.gov.unverified.vote),
    getProposalVotes: querier((qc) => qc.gov.unverified.votes),
    getProposalTally: querier((qc) => qc.gov.unverified.tallyResult),
    proposalDeposit: broadcaster<MsgDeposit>(
      '/cosmos.gov.v1beta1.MsgDeposit',
      MsgDeposit
    ),
    proposalVote: broadcaster<MsgVote>('/cosmos.gov.v1beta1.MsgVote', MsgVote),

    getBalances: querier((qc) => () => {
      const myAddress = wallet.account.address
      return qc.bank.unverified.allBalances(myAddress)
    }),

    createExchange: broadcaster<MsgExchange>(
      '/coinswap.MsgExchange',
      MsgExchange
    ),
    createBinanceExchange: (req: {
      binance_address: string
      odin_address: string
      amount: string
      denom: string
    }) => {
      return sendPost(`${API_CONFIG.exBridge}/bsc/exchange`, req)
    },
    getRate: querier((qc) => qc.coinswap.unverified.rate),

    getTreasuryPool: querier((qc) => qc.mint.unverified.treasuryPool),
    getTotalSupply: querier((qc) => qc.bank.unverified.totalSupply),

    createValidator: broadcaster<MsgCreateValidator>(
      '/cosmos.staking.v1beta1.MsgCreateValidator',
      MsgCreateValidator
    ),
    getValidators: querier((qc) =>
      mapResponse(qc.staking.unverified.validators, (response) => {
        return {
          ...response,
          validators: decodeValidators(response.validators),
        }
      })
    ),

    validatorDelegate: broadcaster<MsgDelegate>(
      '/cosmos.staking.v1beta1.MsgDelegate',
      MsgDelegate
    ),
    validatorUndelegate: broadcaster<MsgUndelegate>(
      '/cosmos.staking.v1beta1.MsgUndelegate',
      MsgUndelegate
    ),
    getDelegations: querier((qc) => qc.staking.unverified.validatorDelegations),

    faucetRequest: (req: { denom: string }) => {
      return sendPost(`${API_CONFIG.faucet}/request`, {
        address: wallet.account.address,
        denom: req.denom,
      })
    },

    getClient: () => {
      return Tendermint34Client.connect(API_CONFIG.rpc)
    },
    getBlockchain: tmQuerier((tc) => tc.blockchain.bind(tc)),
    getTxSearch: tmQuerier((tc) => tc.txSearch.bind(tc)),
    // getTelemetry: tmQuerier((tc) => tc.telemetry.unverified.avgTxFee.bind(tc)),
    getPendingTransactions: (limit: number) => {
      return sendGet(`${API_CONFIG.rpc}/unconfirmed_txs?limit=${limit}`)
    },
  }
}

export const callers = makeCallers()
