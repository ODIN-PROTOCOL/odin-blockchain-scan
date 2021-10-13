<template>
  <div class="container">
    <h1>ODIN&GEO</h1>
    <BlockView
      v-for="coin in CoinBlocksData"
      :key="coin.name"
      :blockData="coin"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { getAPIDate } from '@/helpers/requests'
import { CoinBlocksDataType, CoingeckoCoinsType } from '@/helpers/Types'
import BlockView from '@/components/Odin-Geo/BlockView.vue'
import { callers } from '@/api/callers'
import {
  QueryParamsResponse,
  QueryTreasuryPoolResponse,
} from '@provider/codec/mint/query'
import { bigMath } from '@/helpers/bigMath'

export default defineComponent({
  name: 'Odin-geo',
  components: {
    BlockView,
  },
  setup() {
    const coins = ['geodb', 'odin-protocol']

    onMounted(async () => {
      await fetchData(coins)
    })

    const CoinBlocksData = ref<Array<CoinBlocksDataType>>([])

    const fetchData = async (coins: Array<string>): Promise<void> => {
      const { treasuryPool } =
        (await callers.getTreasuryPool()) as QueryTreasuryPoolResponse

      const { params: mintParams } =
        (await callers.getMintParams()) as QueryParamsResponse

      const { params: CoinswapParams } =
        (await callers.getCoinswapParams()) as QueryParamsResponse

      const TotalSupply = await callers.getUnverifiedTotalSupply()

      console.debug('TotalSupply', TotalSupply)
      console.debug('getTreasuryPool', treasuryPool)
      console.debug('getMintParams', mintParams)
      console.debug('getCoinswapParams', CoinswapParams)

      coins.map(async (coin) => {
        const {
          data,
          data: {
            name,
            symbol,
            market_data: { total_supply },
          },
        } = (await getAPIDate(
          `${process.env.VUE_APP_COINGECKO_API}/coins/${coin}`
        )) as CoingeckoCoinsType

        console.debug(`COINGECKO_API coin ${name}:`, data)
        console.debug(
          `COINGECKO_API coin ${name}/( ${symbol} ) total_supply:`,
          data.market_data.total_supply
        )

        CoinBlocksData.value = [
          ...CoinBlocksData.value,
          {
            info: {
              name,
              supply: total_supply,
              precision: '100',
            },
            amount: {
              balances: '4,684',
              community_pool: '4,684',
              treasury_pool: `${bigMath.bigConvectOdinAndGeo(
                treasuryPool[0].amount
              )} ${symbol.toUpperCase()}`,
              providers_pool: `${bigMath.bigConvectOdinAndGeo(
                treasuryPool[0].amount
              )} ${symbol.toUpperCase()}`,
            },
          },
        ]
      })
    }

    return { CoinBlocksData }
  },
})
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 3.1rem;
}
</style>
