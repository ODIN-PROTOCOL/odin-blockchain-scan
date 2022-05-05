import { api } from './api'
import { wallet } from './wallet'
import { mapResponse, sendGet } from './callersHelpers'
import { cacheAnswers, getAPIDate } from '@/helpers/requests'
import { decodeValidators } from '@/helpers/validatorDecoders'
import { API_CONFIG } from './api-config'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import axios from 'axios'

const makeCallers = () => {
  const querier = api.makeQueryCaller.bind(api)
  const tmQuerier = api.makeTendermintCaller.bind(api)

  return {
    getReports: querier((qc) => qc.oracle.unverified.reporters),
    getAllBalances: querier((qc) => () => {
      const myAddress = wallet.account.address
      return qc.bank.allBalances(myAddress)
    }),
    getBalances: querier((qc) => () => {
      const myAddress = wallet.account.address
      return qc.bank.balance(myAddress, 'loki')
    }),
    getUnverifiedBalances: querier((qc) => qc.bank.balance),
    getUnverifiedTotalSupply: querier((qc) => qc.bank.totalSupply),
    getRate: querier((qc) => qc.coinswap.unverified.rate),
    getTreasuryPool: cacheAnswers(
      querier((qc) => qc.mint.unverified.treasuryPool)
    ),
    getValidators: querier((qc) =>
      mapResponse(qc.staking.validators, (response) => {
        return {
          ...response,
          validators: decodeValidators(response.validators),
        }
      })
    ),
    getValidatorByConsensusKey: cacheAnswers((validatorHash: string) => {
      return axios.get(
        `${API_CONFIG.api}telemetry/validator_by_cons_addr/${validatorHash}`
      )
    }),
    getChannel: querier((qc) => qc.ibc.channel.allChannels),
    getConnections: querier((qc) => qc.ibc.connection.allConnections),
    getClientState: querier((qc) => qc.ibc.client.state),
    getClient: () => {
      return Tendermint34Client.connect(API_CONFIG.rpc)
    },
    getValidator: querier((qc) => qc.staking.validator),
    getValidatorDelegations: querier((qc) => qc.staking.validatorDelegations),
    getBlockchain: tmQuerier((tc) => tc.blockchain.bind(tc)),
    getBlock: cacheAnswers(tmQuerier((tc) => tc.block.bind(tc))),
    getTxSearch: cacheAnswers(tmQuerier((tc) => tc.txSearch.bind(tc))),
    getTx: tmQuerier((tc) => tc.tx.bind(tc)),
    getTxVolume: cacheAnswers(
      querier((qc) => qc.telemetry.unverified.txVolume)
    ),
    getTopBalances: cacheAnswers(
      querier((qc) => qc.telemetry.unverified.topBalances)
    ),
    getValidatorStatus: querier((qc) => qc.oracle.unverified.validator),
    getTxForTxDetailsPage: (hash: string) => {
      return getAPIDate(`${API_CONFIG.rpc}/tx?hash=0x${hash}&prove=true`)
    },
    getTxVolumePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(
        `${API_CONFIG.telemetryUrl}/telemetry/blocks/txVolumePerDays`,
        {
          params: {
            start_time: (startTime.getTime() / 1000).toFixed(),
            end_time: (endTime.getTime() / 1000).toFixed(),
          },
        }
      )
    },
    getAvgSizePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(
        `${API_CONFIG.telemetryUrl}/telemetry/blocks/avgSizePerDays`,
        {
          params: {
            start_time: (startTime.getTime() / 1000).toFixed(),
            end_time: (endTime.getTime() / 1000).toFixed(),
          },
        }
      )
    },
    getAvgTimePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(
        `${API_CONFIG.telemetryUrl}/telemetry/blocks/avgTimePerDays`,
        {
          params: {
            start_time: (startTime.getTime() / 1000).toFixed(),
            end_time: (endTime.getTime() / 1000).toFixed(),
          },
        }
      )
    },
    getAvgTxFeePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(
        `${API_CONFIG.telemetryUrl}/telemetry/blocks/avgTxFeePerDays`,
        {
          params: {
            start_time: (startTime.getTime() / 1000).toFixed(),
            end_time: (endTime.getTime() / 1000).toFixed(),
          },
        }
      )
    },
    getProposedBlocks: (
      proposer: string,
      page_number: number,
      page_limit: number
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/telemetry/validator/${proposer}/transactions?page[number]=${page_number}&page[limit]=${page_limit}&page[order]=desc`
      )
    },
    getValidatorsBlock: () => {
      return axios.get(
        `${API_CONFIG.telemetryUrl}/telemetry/validators?sort=tokens`
      )
    },
    getBlockSize: (height: number) => {
      return axios.get(
        `${API_CONFIG.telemetryUrl}/telemetry/block_size/${height}`
      )
    },
  }
}

export const callers = makeCallers()
