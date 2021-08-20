<template>
  <transition name="fade" mode="out-in">
    <div class="info-panel" v-if="priceData && transactionData && chartData">
      <InfoPanelCol :key="'priceData'" :infoPanelRows="priceData" />
      <InfoPanelCol :key="'transactionData'" :infoPanelRows="transactionData" />
      <InfoPanelChart :key="'chartData'" :chartData="chartData" />
    </div>
  </transition>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, onMounted, ref } from 'vue'
import InfoPanelChart from '@/components/InfoPanel/InfoPanelChart.vue'
import InfoPanelCol from '@/components/InfoPanel/InfoPanelCol.vue'
import { Link } from '@/helpers/Types'
import { callers } from '@/api/callers'

// TODO: env
const api = 'https://api.coingecko.com/api/v3'

export default defineComponent({
  name: 'InfoPanel',
  components: { InfoPanelChart, InfoPanelCol },
  setup() {
    const priceData = ref<Array<Link> | null>()
    const transactionData = ref<Array<Link> | null>()
    // TODO: Get real data:{} for chart
    const chartData = ref({
      labels: ['May 18', 'May 25', 'Jun 1'],
      datasets: [
        {
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 2,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [1080, 1220, 1540],
        },
      ],
    })
    const getLatestTelemetry = async (): Promise<void> => {
      // TODO: Error: Query failed with (18): failed to get tx volume: failed to get the blocks by date: failed to find the blocks: page should be within [1, 101] range, given 102: invalid request
      const endDate = new Date()
      const res = await callers.getTelemetry({
        startDate: undefined,
        endDate,
      })
      console.log('getLatestTelemetry', res)
    }

    const getCoinInfo = async (): Promise<void> => {
      const {
        data: {
          name: odinName,
          market_data: {
            current_price: { usd: odinUSD },
            market_cap: { usd: odinMarketCapUSD },
          },
        },
      } = await axios.get(`${api}/coins/odin-protocol`)
      const {
        data: {
          name: geoDBName,
          market_data: {
            current_price: { usd: geoDBUSD },
            market_cap: { usd: geoDBMarketCapUSD },
          },
        },
      } = await axios.get(`${api}/coins/geodb`)

      transactionData.value = [
        {
          title: 'Total number of transactions',
          text: `2,521 (temp data)`,
        },
        {
          title: 'Market CAP',
          text: `$ ${odinMarketCapUSD + geoDBMarketCapUSD}`,
        },
      ]

      priceData.value = [
        { title: odinName, text: `$ ${odinUSD}` },
        { title: geoDBName, text: `$ ${geoDBUSD}` },
      ]
    }

    onMounted(async () => {
      await getCoinInfo()
      // await getLatestTelemetry()
    })

    return { chartData, transactionData, priceData }
  },
})
</script>

<style lang="scss">
.info-panel {
  display: grid;
  grid: auto/ repeat(2, 1fr) 2fr;
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid var(--clr__action);
  width: 100%;
  margin-bottom: 3.2rem;
  &__title {
    margin-bottom: 1.53rem;
    font-size: 1.4rem;
    font-weight: 300;
  }
  &__text {
    font-weight: 600;
    font-size: 1.6rem;
    line-height: 2.4rem;
  }
  &__row {
    &:not(&:last-child) {
      margin-bottom: 3.2rem;
    }
  }
  &__chart {
    height: 26.9rem;
  }
  @media (max-width: 768px) {
    grid: auto / repeat(2, 1fr);
    gap: 2.4rem;
    &__title {
      margin-bottom: 0.8rem;
    }
    &__chart {
      grid-column: 1/-1;
    }
  }
}
</style>
