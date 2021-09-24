<template>
  <vue3-chart-js ref="chartRef" v-bind="{ ...Chart }" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'
Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

export default defineComponent({
  name: 'AppChart',
  components: {
    Vue3ChartJs,
  },
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartType: {
      type: String,
      default: () => 'line',
    },
    chartOptions: {
      type: Object,
    },
  },
  setup(props) {
    const chartRef = ref()
    const Chart = {
      id: 'line',
      type: props.chartType,
      data: props.chartData,
      options: {
        maintainAspectRatio: false,
        ...props.chartOptions,
      },
    }
    return { chartRef, Chart }
  },
})
</script>
