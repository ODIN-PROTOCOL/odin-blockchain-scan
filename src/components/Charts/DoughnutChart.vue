<template>
  <div class="doughnut_chart">
    <vue3-chart-js ref="doughnutChartRef" v-bind="{ ...Chart }" />
  </div>
</template>

<style scoped lang="scss">
.doughnut_chart {
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const props = defineProps<{
  chartData: { options: [] }
}>()

const doughnutChartRef = ref<HTMLElement>()
const Chart = ref({
  id: 'doughnut',
  type: 'doughnut',
  data: props.chartData,
  options: props.chartData?.options,
})
</script>
