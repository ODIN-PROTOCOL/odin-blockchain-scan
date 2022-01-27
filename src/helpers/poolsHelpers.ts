import { COINS_LIST } from '@/api/api-config'
import { POOLS_IDS, POOL, PreparedPoolsData } from '@/helpers/Types'
import { bigMath } from '@/helpers/bigMath'
import { Coin } from '@provider/codec/cosmos/base/v1beta1/coin'
import BigNumber from 'bignumber.js'

export const preparePoolsData = (
  pools: POOL[],
  totalSupply: Coin[]
): PreparedPoolsData => {
  const preparedPoolData = {
    balances: '0',
    community: '0',
    treasury: '0',
    data_provider: '0',
    total_supply: _processAmount(totalSupply, COINS_LIST.LOKI),
  }
  let poolsSum: BigNumber = bigMath.zero

  pools.forEach((item: POOL) => {
    const amount = _processAmount(item.attributes.coins, COINS_LIST.LOKI)
    poolsSum = bigMath.add(poolsSum, amount)

    switch (item.id) {
      case POOLS_IDS.TREASURY:
        preparedPoolData.treasury = amount
        break
      case POOLS_IDS.DATA_PROVIDERS:
        preparedPoolData.data_provider = amount
        break
      case POOLS_IDS.COMMUNITY:
        preparedPoolData.community = amount
        break
    }
  })

  preparedPoolData.balances = bigMath
    .subtract(preparedPoolData.total_supply, poolsSum)
    .toString()

  return preparedPoolData
}

const _processAmount = (coins: Coin[] | undefined, denom: COINS_LIST) => {
  if (!coins || !coins.length) return '0'
  const foundCoin = coins.find((item) => item.denom === denom)
  return foundCoin ? foundCoin.amount : '0'
}
