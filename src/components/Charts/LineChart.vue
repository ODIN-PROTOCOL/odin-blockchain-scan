<template>
  <vue3-chart-js ref="lineChartRef" v-bind="{ ...Chart }" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

export default defineComponent({
  name: 'LineChart',
  components: {
    Vue3ChartJs,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const lineChartRef = ref<HTMLElement>()
    const Chart = ref({
      id: 'line',
      type: 'line',
      data: props.chartData,
      options: props.chartData.options,
    })
    return { lineChartRef, Chart }
  },
})
</script>
