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
import { QueryTreasuryPoolResponse } from '@provider/codec/mint/query'

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
      const {
        treasuryPool,
      } = (await callers.getTreasuryPool()) as QueryTreasuryPoolResponse
      console.log('getTreasuryPool', treasuryPool)

      coins.map(async (coin) => {
        const {
          data: {
            name,
            market_data: { total_supply },
          },
        } = (await getAPIDate(
          `${process.env.VUE_APP_COINGECKO_API}/coins/${coin}`
        )) as CoingeckoCoinsType

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
              treasury_pool: `${
                treasuryPool[0].amount
              } ${treasuryPool[0].denom.toUpperCase()}`,
              providers_pool: `${
                treasuryPool[0].amount
              } ${treasuryPool[0].denom.toUpperCase()}`,
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
