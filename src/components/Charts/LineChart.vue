<template>
  <vue3-chart-js ref="chartRef" v-bind="{ ...Chart }" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

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
  },
  setup(props) {
    const chartRef = ref<HTMLElement>()
    const Chart = {
      id: 'line',
      type: 'line',
      data: props.chartData,
      options: props.chartData.options,
    }
    return { chartRef, Chart }
  },
})
</script>
