<template>
  <div class="container">
    <div class="page-title">
      <BackButton :current-router="router" :text="'Charts & Stats'" />
      <h2 class="view-title">AverageOdinBlockSizeChart</h2>
    </div>

    <div class="sort-wrapper">
      <span>
        Block Size in<br />
        Kilobyte
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
    <CustomBarChart
      :chartDataset="chartData"
      :datasetLabel="'Block Size'"
      :datasetUnit="'kilobytes'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { Router, useRouter } from 'vue-router'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'
import { formatDataForCharts } from '@/helpers/customChartHelpers'
import { sortingDaysForChart } from '@/helpers/helpers'
import CustomBarChart from '@/components/Charts/CustomBarChart.vue'
import BackButton from '@/components/BackButton.vue'

export default defineComponent({
  name: 'AverageOdinBlockSizeChart',
  components: { CustomBarChart, BackButton },
  setup() {
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
        const { data } = await callers.getAvgSizePerDays(startDate, endDate)

        chartData.value = formatDataForCharts(data)
      } catch (error) {
        handleError(error as Error)
        console.error(error)
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
.view-title {
  margin: 0 1.6rem 0 2rem;
}

.sort-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2.4rem;
  width: 100%;
}

@media screen and (max-width: 768px) {
  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .sort-wrapper {
    flex-direction: column-reverse;
    gap: 3.2rem;

    .app-filter {
      width: 100%;
      padding: 0;
    }
  }
}
</style>
