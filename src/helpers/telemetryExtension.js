import Long from 'long'

import { createRpc } from '@cosmjs/stargate/build/queries/utils'
import { QueryClientImpl } from './query.js'

export class Pagination {
  constructor(offset, limit, desc) {
    this.offset = new Long(offset)
    this.limit = new Long(limit)
    this.desc = desc
  }
}

export function setupTelemetryExtension(base) {
  // const rpc = cosmjsUtils.createProtobufRpcClient(base);
  const rpc = createRpc(base)
  // Use this service to get easy typed access to query methods
  const queryService = new QueryClientImpl(rpc)
  return {
    telemetry: {
      unverified: {
        topBalances: async (denom, pagination) => {
          return await queryService.TopBalances({
            denom: denom,
            pagination: {
              key: [],
              limit: pagination.limit,
              offset: pagination.offset,
            },
            desc: pagination.desc,
          })
        },
      },
    },
  }
}

// module.exports = {
//     setupTelemetryExtension,
//     Pagination
// }
