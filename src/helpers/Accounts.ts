import { callers } from '@/api/callers'
import { QueryTopBalancesResponse } from '@provider/codec/telemetry/query'
import { TempBalanceType } from '@/helpers/Types'
import { Pagination } from '@/api/query-ext/telemetryExtension'

export async function getAccountList(
  pagination: Pagination
): Promise<Array<TempBalanceType>> {
  const balances = (await callers.getTopBalances({
    denom: 'odin',
    pagination,
    desc: true,
  })) as QueryTopBalancesResponse

  const tempBalances: Array<TempBalanceType> = []
  balances.balances.forEach((el) => {
    const tempBalanceItem: TempBalanceType = {
      address: el.address,
      geoBalance: Number(
        el.coins.find((el) => el.denom === 'minigeo')?.amount
          ? el.coins.find((el) => el.denom === 'minigeo')?.amount
          : 0
      ),
      odinBalance: Number(
        el.coins.find((el) => el.denom === 'loki')?.amount
          ? el.coins.find((el) => el.denom === 'loki')?.amount
          : 0
      ),
    }
    tempBalances.push(tempBalanceItem)
  })

  return tempBalances
}
