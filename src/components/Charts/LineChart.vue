<template>
  <vue3-chart-js ref="lineChartRef" v-bind="{ ...Chart }" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

const props = defineProps<{
  chartData: { options: [] }
}>()

const lineChartRef = ref<HTMLElement>()
const Chart = ref({
  id: 'line',
  type: 'line',
  data: props.chartData,
  options: props.chartData.options,
})
</script>
