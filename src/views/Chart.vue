<template>
  <div class="app__main-view chart">
    <div class="app__main-view-title-wrapper">
      <BackButton :current-router="router" :text="'Charts & Stats'" />
      <h2 class="app__main-view-title chart__title">{{ chartPageTitle }}</h2>
    </div>

    <div class="chart__sort-wrapper">
      <span class="chart__y-axis">{{ yAxisTitle }}</span>

      <VuePicker
        class="app-form__field-input app-filter app-filter--coin"
        name="filter"
        v-model="sortingValue"
        :isDisabled="isLoading"
      >
        <template #dropdownInner>
          <div class="app-filter__dropdown-inner">
            <VuePickerOption
              v-for="{ text, value } in sortingDaysForChart"
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
    <template v-if="chartType === 'bar'">
      <CustomBarChart
        :chartDataset="chartData"
        :datasetLabel="datasetLabel"
        :datasetUnit="datasetUnit"
      />
    </template>
    <template v-if="chartType === 'line'">
      <CustomLineChart
        :chartDataset="chartData"
        :datasetLabel="datasetLabel"
        :datasetUnit="datasetUnit"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs, watch } from 'vue'
import { Router, useRouter } from 'vue-router'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'
import { formatDataForCharts } from '@/helpers/customChartHelpers'
import { sortingDaysForChart } from '@/helpers/helpers'
import CustomBarChart from '@/components/Charts/CustomBarChart.vue'
import CustomLineChart from '@/components/Charts/CustomLineChart.vue'
import BackButton from '@/components/BackButton.vue'

export default defineComponent({
  name: 'chart',
  components: { CustomBarChart, CustomLineChart, BackButton },
  props: {
    chartPageTitle: { type: String, required: true },
    chartType: { type: String, required: true },
    getDataMethodName: { type: String, required: true },
    datasetLabel: { type: String, required: true },
    datasetUnit: { type: String, default: '' },
    yAxisTitle: { type: String, required: true },
  },
  setup(props) {
    const { getDataMethodName } = toRefs(props)
    const router: Router = useRouter()
    const chartData = ref()
    const isLoading = ref<boolean>(false)
    const sortingValue = ref<string>('1')

    const getChartData = async () => {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - Number(sortingValue.value))

      isLoading.value = true
      try {
        const { data } = await callers[getDataMethodName.value](
          startDate,
          endDate
        )

        chartData.value = formatDataForCharts(data)
      } catch (error) {
        handleError(error as Error)
      } finally {
        isLoading.value = false
      }
    }

    watch(sortingValue, async (): Promise<void> => await getChartData())

    onMounted(async (): Promise<void> => {
      await getChartData()
    })

    return {
      router,
      chartData,
      isLoading,
      sortingValue,
      sortingDaysForChart,
    }
  },
})
</script>

<style lang="scss" scoped>
.chart {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__sort-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2.4rem;
    width: 100%;
  }

  &__y-axis {
    font-size: 1.4rem;
    width: 8rem;
  }
}

@include respond-to(tablet) {
  .chart {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }

    &__sort-wrapper {
      flex-direction: column-reverse;
      gap: 3.2rem;

      .app-filter {
        width: 100%;
        padding: 0;
      }
    }
  }
}
</style>
