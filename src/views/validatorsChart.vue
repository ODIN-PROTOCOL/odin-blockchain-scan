<template>
  <div>
    <div class="title">
      <BackButton :current-router="router" />
      <h1 class="title-name">Block Validators Chart</h1>
    </div>
    <div class="content">
      <div class="chart-block">
        <AppChart
          v-if="chartDataLoad"
          :key="'chartData'"
          :chartData="chartData"
          :chartType="'doughnut'"
          @afterInit="test($event)"
          @afterUpdate="test2($event)"
        />
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
import { callers } from '@/api/callers'
import { Pagination } from '@/api/query-ext/telemetryExtension'
import BackButton from '@/components/BackButton.vue'
import { bigMath } from '@/helpers/bigMath'
import { getRandomColors } from '@/helpers/helpers'
import AppChart from '@/components/AppChart.vue'
import { ChartDataType } from '@/helpers/Types'

export default defineComponent({
  name: 'ValidatorChart',
  components: { AppChart, BackButton },
  setup() {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const pagination: Pagination = new Pagination(0, 1000, true, true)
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 2)

    const chartDataLoad = ref(false)
    const chartData = ref<ChartDataType>({
      datasets: [
        {
          backgroundColor: '#fff',
          borderColor: '#fff',
          borderWidth: 2,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [],
        },
      ],
    })

    const getValidatorsData = async (): Promise<void> => {
      const { topValidators } = await callers.getTopValidators({
        startDate,
        endDate,
        pagination,
      })

      const backgroundColor = getRandomColors(topValidators.length)

      for (const v of topValidators) {
        chartData.value.datasets[0].data.push(bigMath.format(v.blocksCount))
      }
      chartData.value.datasets[0].backgroundColor = backgroundColor
      chartData.value.datasets[0].borderColor = backgroundColor

      chartDataLoad.value = true
    }

    const test = (event) => {
      console.log(event)
      // console.log(chartRef.value.update())
    }

    const test2 = (event) => {
      console.log(event)
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
      test,
      test2
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
  height: 391px;
  width: 100%;
  margin: 17.5rem 0;
}
</style>
