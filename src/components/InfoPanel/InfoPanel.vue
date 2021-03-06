<template>
  <transition name="fade" mode="out-in">
    <div class="info-panel">
      <InfoPanelData class="info-panel__data" :infoPanelRows="totalData" />
      <div class="info-panel__chart border">
        <div class="info-panel__chart-title">
          Transactions history statistics
        </div>
        <div class="info-panel__chart">
          <skeleton-loader
            v-if="isLoading"
            width="-1"
            height="-1"
            rounded
            animation="wave"
            color="rgb(225, 229, 233)"
            class="info-panel__chart-skeleton"
          />
          <CustomLineChart
            v-else
            :chartDataset="chartData"
            :datasetLabel="'Transactions'"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { CoingeckoCoinsType, Link } from '@/helpers/Types'
import { callers } from '@/api/callers'
import { formatDataForCharts } from '@/helpers/customChartHelpers'
import { getAPIDate } from '@/helpers/requests'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import CustomLineChart from '@/components/Charts/CustomLineChart.vue'
import InfoPanelData from '@/components/InfoPanel/InfoPanelData.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

export default defineComponent({
  name: 'InfoPanel',
  components: { InfoPanelData, CustomLineChart },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

    const CHART_DATA_PERIOD = 7
    const transactionCount = ref<number>()
    const chartData = ref()
    const totalData = ref<Array<Link> | null>([])
    const getTotalTxNumber = async () => {
      try {
        const { total_count } = await callers
          .getTxSearchFromTelemetry(0, 1, 'desc')
          .then((resp) => resp.json())
        transactionCount.value = total_count
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
    }

    const getLatestTelemetry = async (): Promise<void> => {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - CHART_DATA_PERIOD)

      try {
        const { data } = await callers.getTxVolumePerDays(startDate, endDate)

        chartData.value = formatDataForCharts(data)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      totalData.value = [
        { title: odinName, text: `$${odinUSD}` },
        { title: geoDBName, text: `$${geoDBUSD}` },
        {
          title: 'Transactions',
          text: `${transactionCount.value || 'Insufficient data'}`,
        },
        {
          title: 'Market CAP',
          text: `$${odinMarketCapUSD + geoDBMarketCapUSD}`,
        },
      ]
    }

    onMounted(async () => {
      lockLoading()
      try {
        await getTotalTxNumber()
        // Don`t work request
        // await getCoinInfo()
        await getLatestTelemetry()
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    })

    return {
      totalData,
      chartData,
      isLoading,
    }
  },
})
</script>

<style lang="scss">
.border {
  padding: 3.2rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid var(--clr__action);
  width: 100%;
  margin-bottom: 3.2rem;
}
.info-panel__data {
  margin-bottom: 3.2rem;
}
.info-panel__empty {
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
.info-panel__empty-chart {
  color: var(--clr__input-border);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3.4rem;
  font-weight: 600;
  text-transform: uppercase;
  height: 100%;
  @media (max-width: 48rem) {
    text-align: center;
    font-size: 2.4rem;
  }
}
.info-panel__chart-title {
  margin-bottom: 1.53rem;
  font-size: 2.4rem;
  font-weight: 400;
}
.info-panel__chart {
  min-height: 19.5rem;
  canvas {
    height: 19.5rem;
  }
}
.info-panel__chart-skeleton {
  height: 19rem;
  width: 100%;
}

@include respond-to(tablet) {
  .info-panel__text {
    font-size: 2rem;
    line-height: 2.4rem;
  }
  .info-panel__chart {
    grid-column: 1/-1;
  }
}
</style>
