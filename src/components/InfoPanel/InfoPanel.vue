<template>
  <transition name="fade" mode="out-in">
    <div class="info-panel" v-if="priceData && transactionData && chartData">
      <InfoPanelCol :key="'priceData'" :infoPanelRows="priceData" />
      <InfoPanelCol :key="'transactionData'" :infoPanelRows="transactionData" />
      <InfoPanelChart
        :key="'chartData'"
        v-if="chartDataLoad"
        :chartData="chartData"
      />
    </div>
    <div v-else class="info-panel">
      <span class="info-panel__empty">Waiting to receive data</span>
    </div>
  </transition>
</template>

<script lang="ts">
import axios from 'axios'
import { defineComponent, onMounted, ref } from 'vue'
import InfoPanelChart from '@/components/InfoPanel/InfoPanelChart.vue'
import InfoPanelCol from '@/components/InfoPanel/InfoPanelCol.vue'
import { ChartDataType, Link } from '@/helpers/Types'
import { callers } from '@/api/callers'
import { convertToDayMonth } from '@/helpers/dates'
import { bigMath } from '@/helpers/bigMath'

export default defineComponent({
  name: 'InfoPanel',
  components: { InfoPanelChart, InfoPanelCol },
  setup() {
    const priceData = ref<Array<Link> | null>()
    const transactionData = ref<Array<Link> | null>()
    const transactionCount = ref<number>()
    const chartDataLoad = ref(false)

    const chartData = ref<ChartDataType>({
      labels: [],
      datasets: [
        {
          backgroundColor: '#007bff',
          borderColor: '#007bff',
          borderWidth: 2,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [],
        },
      ],
    })

    const getLatestTelemetry = async (): Promise<void> => {
      try {
        const endDate = new Date()
        const { txVolumePerDay } = await callers.getTelemetry({
          startDate: undefined,
          endDate,
        })
        txVolumePerDay.map((el) => {
          chartData.value.labels = [
            ...chartData.value.labels,
            convertToDayMonth(el?.date as Date),
          ]
          chartData.value.datasets[0].data = [
            ...chartData.value.datasets[0].data,
            bigMath.toNum(el.volume),
          ]
        })
        transactionCount.value = chartData.value.datasets[0].data.reduce(
          (sum, el): number => {
            return Number(sum) + Number(el)
          },
          0
        ) as number
        await getCoinInfo()
        chartDataLoad.value = true
      } catch (error) {
        console.log(error)
      }
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
      } = await axios.get(
        `${process.env.VUE_APP_COINGECKO_API}/coins/odin-protocol`
      )
      const {
        data: {
          name: geoDBName,
          market_data: {
            current_price: { usd: geoDBUSD },
            market_cap: { usd: geoDBMarketCapUSD },
          },
        },
      } = await axios.get(`${process.env.VUE_APP_COINGECKO_API}/coins/geodb`)

      transactionData.value = [
        {
          title: 'Total number of transactions',
          text: `${transactionCount.value}`,
        },
        {
          title: 'Market CAP',
          text: `$${odinMarketCapUSD + geoDBMarketCapUSD}`,
        },
      ]

      priceData.value = [
        { title: odinName, text: `$${odinUSD}` },
        { title: geoDBName, text: `$${geoDBUSD}` },
      ]
    }

    onMounted(async () => {
      await getLatestTelemetry()
    })

    return { chartData, transactionData, priceData, chartDataLoad }
  },
})
</script>

<style lang="scss">
.info-panel {
  &__empty {
    grid-column-start: 1;
    grid-column-end: -1;
    color: var(--clr__input-border);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3.2rem;
    font-weight: 600;
    text-transform: uppercase;
  }
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