<template>
  <div>
    <div class="title">
      <BackButton :current-router="router" />
      <h1 class="title-name">Block Validators Chart</h1>
    </div>
    <div class="content">
      <div class="chart-block">
        <div class="chart-block__total">
          <h3>{{ totalBlocks }}</h3>
          <span>Blocks</span>
        </div>
        <div class="chart-block__wrapper" v-if="chartDataLoad">
          <AppChart
            :key="'chartData'"
            :chartData="chartData"
            :chartType="'doughnut'"
            :chartOptions="chartOptions"
          />
        </div>
        <span class="info-panel__empty-chart" v-else>
          We are in the process of drawing a chart!
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { ChartDataType } from '@/helpers/Types'
import { Pagination } from '@/api/query-ext/telemetryExtension'
import { callers } from '@/api/callers'
import { bigMath } from '@/helpers/bigMath'
import { getRandomColors } from '@/helpers/helpers'
import { externalTooltipHandler } from '@/helpers/chartHelpers'
import AppChart from '@/components/AppChart.vue'
import BackButton from '@/components/BackButton.vue'

export default defineComponent({
  name: 'ValidatorChart',
  components: { AppChart, BackButton },
  setup: function () {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const pagination: Pagination = new Pagination(0, 1000, true, true)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 2)
    const totalBlocks = ref<string>('')

    const chartDataLoad = ref(false)
    const chartData = ref<ChartDataType>({
      labels: [],
      datasets: [
        {
          backgroundColor: ['#fff'],
          borderColor: ['#fff'],
          borderWidth: 2,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [],
        },
      ],
    })
    const chartOptions = {
      // TODO: try to scale
      onHover: ({chart}) => {
        console.log(chart)
      },
      plugins: {
        beforeEvent(chart, args, pluginOptions) {
          console.log('asdasd')
          const event = args.event;
          if (event.type === 'mouseout') {
            // process the event
          }
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: false,
          external: externalTooltipHandler,
        },
        legend: {
          display: false,
        },
      },
    }

    const getValidatorsData = async (): Promise<void> => {
      const { topValidators } = await callers.getTopValidators({
        startDate,
        endDate,
        pagination,
      })

      const backgroundColor = getRandomColors(topValidators.length)

      console.log('topValidators', topValidators)
      const blocksCounters: Array<number> = []
      for (const v of topValidators) {
        chartData.value.datasets[0].data.push(bigMath.format(v.blocksCount))
        chartData.value.labels.push({
          validatorAddress: v.validatorAddress,
          blocksCounter: bigMath.format(v.blocksCount),
          stakePercentage: v.stakePercentage,
        })
        blocksCounters.push(bigMath.toNum(v.blocksCount))
      }

      totalBlocks.value = bigMath.format(
        blocksCounters.reduce((sum, el): number => {
          return Number(sum) + Number(el)
        }, 0)
      )

      chartData.value.datasets[0].backgroundColor = backgroundColor
      chartData.value.datasets[0].borderColor = backgroundColor

      chartDataLoad.value = true
    }

    onMounted(async (): Promise<void> => {
      try {
        await getValidatorsData()
      } catch (e) {
        console.error(e)
      }
    })

    return {
      router,
      route,
      chartData,
      chartDataLoad,
      chartOptions,
      totalBlocks,
    }
  },
})
</script>

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.chart-block {
  display: flex;
  height: 39.1rem;
  width: 100%;
  position: relative;
  margin: 17.5rem 0 7.5rem 0;
  &__wrapper {
    width: 100%;
    height: 100%;
  }
  &__total {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #212529;
    text-align: center;
    h3 {
      font-weight: 600;
      font-size: 2.4rem;
      line-height: 2.9rem;
    }
    span {
      margin-top: 0.4rem;
      font-size: 1.6rem;
      line-height: 2.4rem;
      font-weight: 600;
    }
  }
}
</style>
