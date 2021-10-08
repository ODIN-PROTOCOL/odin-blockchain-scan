<template>
  <transition name="fade" mode="out-in">
    <div class="info-panel" v-if="priceData && transactionData">
      <InfoPanelCol :key="'priceData'" :infoPanelRows="priceData" />
      <InfoPanelCol :key="'transactionData'" :infoPanelRows="transactionData" />
      <div class="info-panel__chart">
        <div class="info-panel__title">Transactions history statistics</div>
        <AppChart
          :key="'chartData'"
          v-if="chartDataLoad"
          :chartData="chartData"
        />
        <span class="info-panel__empty-chart" v-else>
          We are in the process of drawing a chart!
        </span>
      </div>
    </div>
    <div v-else class="info-panel">
      <span class="info-panel__empty">Waiting to receive data</span>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import AppChart from '@/components/Charts/LineChart.vue'
import InfoPanelCol from '@/components/InfoPanel/InfoPanelCol.vue'
import { ChartDataType, CoingeckoCoinsType, Link } from '@/helpers/Types'
import { callers } from '@/api/callers'
import { convertToDayMonth } from '@/helpers/dates'
import { bigMath } from '@/helpers/bigMath'
import { getAPIDate } from '@/helpers/requests'
import { handleError } from '@/helpers/errors'

export default defineComponent({
  name: 'InfoPanel',
  components: { AppChart, InfoPanelCol },
  setup() {
    const priceData = ref<Array<Link> | null>()
    const transactionData = ref<Array<Link> | null>()
    const transactionCount = ref<number>()
    const chartDataLoad = ref(false)

    const chartData = ref<ChartDataType>({
      labels: [],
      datasets: [
        {
          backgroundColor: ['#007bff'],
          borderColor: ['#007bff'],
          borderWidth: 2,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [],
        },
      ],
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: 'transparent',
              borderColor: '#CCE4FF',
            },
            ticks: {
              padding: 20,
              color: '#212529',
              font: {
                size: 14,
                family: 'SF Display',
                lineHeight: 2,
              },
            },
          },
          y: {
            grid: {
              color: '#CCE4FF',
              borderColor: 'transparent',
            },
            ticks: {
              color: '#212529',
              padding: 20,
              font: {
                size: 14,
                family: 'SF Display',
                lineHeight: 2,
              },
            },
          },
        },
        elements: {
          point: {
            backgroundColor: '#007bff',
            borderColor: '#007bff',
            borderWidth: 3,
            radius: 2,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          subtitle: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
          point: {
            borderWidth: 2,
          },
        },
      },
    })

    const getLatestTelemetry = async (): Promise<void> => {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 2)

      const { txVolumePerDay } = await callers.getTxVolume({
        startDate,
        endDate,
      })

      console.debug('txVolumePerDay', txVolumePerDay)

      txVolumePerDay.map((el) => {
        chartData.value.labels = [
          ...chartData.value.labels,
          convertToDayMonth(el?.date as Date),
        ] as Array<string>
        chartData.value.datasets[0].data = [
          ...chartData.value.datasets[0].data,
          bigMath.toNum(el.volume),
        ]
      })

      transactionCount.value = chartData.value.datasets[0].data.reduce(
        (sum: number, el): number => sum + Number(el),
        0
      )

      console.debug('chartData', chartData.value)

      await getCoinInfo()
      chartDataLoad.value = true
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
      } = (await getAPIDate(
        `${process.env.VUE_APP_COINGECKO_API}/coins/odin-protocol`
      )) as CoingeckoCoinsType
      const {
        data: {
          name: geoDBName,
          market_data: {
            current_price: { usd: geoDBUSD },
            market_cap: { usd: geoDBMarketCapUSD },
          },
        },
      } = (await getAPIDate(
        `${process.env.VUE_APP_COINGECKO_API}/coins/geodb`
      )) as CoingeckoCoinsType

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
      try {
        await getLatestTelemetry()
      } catch (error) {
        handleError(error)
        console.error(error)
      }
    })

    return {
      chartData,
      chartDataLoad,
      transactionData,
      priceData,
    }
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
    &-chart {
      color: var(--clr__input-border);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3.4rem;
      font-weight: 600;
      text-transform: uppercase;
    }
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
