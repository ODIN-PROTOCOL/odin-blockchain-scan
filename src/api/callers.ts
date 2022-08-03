import { api } from './api'
import { sendGet } from './callersHelpers'
import { cacheAnswers, getAPIDate } from '@/helpers/requests'
import { API_CONFIG } from './api-config'

import axios from 'axios'

const makeCallers = () => {
  const querier = api.makeQueryCaller.bind(api)
  const tmQuerier = api.makeTendermintCaller.bind(api)

  return {
    getReports: querier(qc => qc.oracle.unverified.reporters),
    getUnverifiedBalances: querier(qc => qc.bank.balance),
    getValidatorByConsensusKey: cacheAnswers((validatorHash: string) => {
      return axios.get(
        `${API_CONFIG.api}telemetry/validator_by_cons_addr/${validatorHash}`,
      )
    }),
    getChannel: querier(qc => qc.ibc.channel.allChannels),
    getConnections: querier(qc => qc.ibc.connection.allConnections),
    getClientState: querier(qc => qc.ibc.client.state),
    getValidatorDelegations: querier(qc => qc.staking.validatorDelegations),
    getBlockchain: tmQuerier(tc => tc.blockchain.bind(tc)),
    getBlock: cacheAnswers(tmQuerier(tc => tc.block.bind(tc))),
    getValidatorStatus: querier(qc => qc.oracle.unverified.validator),
    getTxForTxDetailsPage: (hash: string) => {
      return getAPIDate(`${API_CONFIG.rpc}tx?hash=0x${hash}&prove=true`)
    },
    getTxVolumePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(`${API_CONFIG.telemetryUrl}/blocks/txVolumePerDays`, {
        params: {
          start_time: (startTime.getTime() / 1000).toFixed(),
          end_time: (endTime.getTime() / 1000).toFixed(),
        },
      })
    },
    getRequestsVolumePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(`${API_CONFIG.telemetryUrl}/requests/volume_per_days`, {
        params: {
          start_time: (startTime.getTime() / 1000).toFixed(),
          end_time: (endTime.getTime() / 1000).toFixed(),
        },
      })
    },
    getAvgSizePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(`${API_CONFIG.telemetryUrl}/blocks/avgSizePerDays`, {
        params: {
          start_time: (startTime.getTime() / 1000).toFixed(),
          end_time: (endTime.getTime() / 1000).toFixed(),
        },
      })
    },
    getAvgTimePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(`${API_CONFIG.telemetryUrl}/blocks/avgTimePerDays`, {
        params: {
          start_time: (startTime.getTime() / 1000).toFixed(),
          end_time: (endTime.getTime() / 1000).toFixed(),
        },
      })
    },
    getAvgTxFeePerDays: (startTime: Date, endTime: Date) => {
      return axios.get(`${API_CONFIG.telemetryUrl}/blocks/avgTxFeePerDays`, {
        params: {
          start_time: (startTime.getTime() / 1000).toFixed(),
          end_time: (endTime.getTime() / 1000).toFixed(),
        },
      })
    },
    getProposedBlocks: (
      proposer: string,
      page_number: number,
      page_limit: number,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/validator/${proposer}/transactions?page[number]=${page_number}&page[limit]=${page_limit}&page[order]=desc`,
      )
    },
    getValidatorsBlock: () => {
      return axios.get(`${API_CONFIG.telemetryUrl}/validators?sort=tokens`)
    },
    getBlockSize: (height: number) => {
      return axios.get(`${API_CONFIG.telemetryUrl}/block_size/${height}`)
    },
    getTxSearchFromTelemetry: (
      page_number: number,
      page_limit: number,
      page_order: string,
      block = 0,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/txs?page[number]=${page_number}&page[limit]=${page_limit}&page[order]=${page_order}&block=${block}`,
      )
    },
    getAccountTx: (
      page_number: number,
      page_limit: number,
      owner: string,
      page_order: string,
      tx_type: string,
    ) => {
      return sendGet(
        `${API_CONFIG.telemetryUrl}/account_txs/${owner}?page[number]=${page_number}&page[limit]=${page_limit}&page[order]=${page_order}&type=${tx_type}`,
      )
    },
    getTopAccounts: () => {
      return sendGet(`${API_CONFIG.telemetryUrl}/accounts?sort=odin_balance`)
    },
    getOracleReports: (id: string, page_number: number, page_limit: number) => {
      return axios.get(
        `${API_CONFIG.telemetryUrl}/validator/${id}/reports?page[number]=${page_number}&page[limit]=${page_limit}`,
      )
    },
  }
}

export const callers = makeCallers()
