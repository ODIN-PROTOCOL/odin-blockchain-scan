<template>
  <div>
    <div class="title">
      <BackButton :current-router="router" />
      <h1 class="title-name">Daily Transactions Volume Chart</h1>
    </div>

    <div class="sort-wrapper" v-if="!isLoading">
      <span>
        Transactions<br />
        per Day
      </span>
      <VuePicker
        class="app-form__field-input app-filter app-filter--coin"
        name="filter"
        v-model="sortingValue"
        :isDisabled="isLoading"
      >
        <template #dropdownInner>
          <div class="app-filter__dropdown-inner">
            <VuePickerOption
              v-for="{ text, value } in sortingDays"
              :key="text"
              :value="value"
              :text="text"
            >
              {{ text }}
            </VuePickerOption>
          </div>
        </template>
      </VuePicker>
    </div>
    <transition name="fade" mode="out-in">
      <template v-if="!isLoading && chartData">
        <div class="content">
          <LineChart :key="'chartData'" :chartData="chartData" />
        </div>
      </template>
      <span class="empty" v-else>
        <span id="loading" class="empty-loading"></span>
        Wait data preparation
      </span>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { ChartDataType } from '@/helpers/Types'
import { handleError } from '@/helpers/errors'
import LineChart from '@/components/Charts/LineChart.vue'
import BackButton from '@/components/BackButton.vue'
import { dailyTransactionsVolumeTooltipHandler } from '@/helpers/chartTooltipHelpers'

export default defineComponent({
  name: 'DailyTransactionsVolumeChart',
  components: { BackButton, LineChart },
  setup: function () {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const isLoading = ref<boolean>(false)
    const sortingValue = ref<string>('1')
    const sortingDays: Array<{ text: string; value: string }> = [
      {
        text: 'Last 24 hours',
        value: '1',
      },
      {
        text: 'Last 7 days',
        value: '7',
      },
      {
        text: 'Last 14 days',
        value: '14',
      },
    ]
    // Todo: some kind of wild trash with data for the graph, somewhere the data is convect to a string, somewhere not, (in the same place), I did not find any pattern, now there is just a test dataset that "works" All this is needed will redo from scratch
    const chartData = ref<Partial<ChartDataType>>({
      datasets: [
        {
          backgroundColor: ['#66B0FF'],
          borderColor: ['#66B0FF'],
          borderWidth: 2,
          hoverBorderWidth: 4,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [
            { label: 'Oct 1', data: 4 },
            { label: 'Oct 2', data: 2 },
            { label: 'Oct 3', data: 5 },
            { label: 'Oct 4', data: 11 },
            { label: 'Oct 5', data: 21 },
          ],
        },
      ],
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: 20,
        },
        parsing: {
          xAxisKey: 'label',
          yAxisKey: 'data',
        },
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
            external: dailyTransactionsVolumeTooltipHandler,
          },
          point: {
            borderWidth: 2,
          },
        },
      },
    })

    const getDataByDays = async (days: number): Promise<void> => {
      // const endDate = new Date()
      // const startDate = new Date()
      console.debug('getDataByDays', days)
      isLoading.value = true
      let tsx: Array<number> = []
      try {
        // Todo: rework requestByDays, and change get info methods it InfoPanel.vue
        // const queryTxVolumeResponseList = withoutDuplicates(
        //   await requestByDays({ startDate, endDate }, callers.getTxVolume, days)
        // )
        // const { txVolumePerDay } = await requestByDays(
        //   { startDate, endDate },
        //   callers.getTxVolume,
        //   days
        // )
        // const { txVolumePerDay } = await callers.getTxVolume({
        //   startDate,
        //   endDate,
        // })
        // txVolumePerDay.forEach((el) => {
        /*
         * ERROR: With push we have RangeError: Maximum call stack size exceeded
         */
        // chartData.value.labels.push(convertToDayMonth(el?.date as Date))
        // chartData.value.datasets[0].data.push(bigMath.toNum(el.volume))
        // chartData.value.labels = [
        //   ...chartData.value.labels,
        //   {
        //     date: convertToDayMonth(el?.date as Date),
        //     volume: bigMath.toNum(el.volume),
        //   },
        // ]
        //
        // chartData.value.datasets[0].data = [
        //   ...chartData.value.datasets[0].data,
        //   bigMath.toNum(el.volume),
        // ]
        // })
        console.debug('chartData.value', chartData.value)
        isLoading.value = false
      } catch (error) {
        handleError(error)
        console.error(error)
      }
    }

    watch(
      sortingValue,
      async (): Promise<void> => await getChartData(Number(sortingValue.value))
    )

    const getChartData = async (_sortingValue: number): Promise<void> => {
      await getDataByDays(_sortingValue)
    }

    onMounted(async (): Promise<void> => {
      await getChartData(Number(sortingValue.value))
    })

    return {
      router,
      route,
      chartData,
      sortingDays,
      sortingValue,
      isLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
#line {
  height: 45.9rem;
}

.empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.sort-wrapper {
  margin-top: 3.2rem;
  justify-content: space-between;
  span {
    font-weight: 300;
    font-size: 1.4rem;
    line-height: 2rem;
  }
}

.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    repeat(4, minmax(4rem, 1fr));

  @media screen and (max-width: 99.2rem) {
    grid: repeat(4, minmax(4rem, 1fr)) / auto;
  }
}
.data-sources__table-head {
  @media (max-width: 48rem) {
    display: none;
  }
}

.app-table__cell-txt {
  max-width: 150px;
}

.app-table__header {
  display: none;
  @media screen and (max-width: 99.2rem) {
    display: inline-block;
    width: 20rem;
  }
}

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
  margin: 10.3rem 0 7.5rem 0;
  @media (max-width: 48rem) {
    margin: 3.2rem 0 4.2rem;
  }
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
