<template>
  <div class="doughnut_chart">
    <vue3-chart-js ref="doughnutChartRef" v-bind="{ ...Chart }" />
  </div>
</template>

<style lang="scss">
.doughnut_chart {
  height: 100%;
  width: 100%;
}
</style>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'

export default defineComponent({
  name: 'DoughnutChart',
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
    const doughnutChartRef = ref<HTMLElement>()
    const Chart = ref({
      id: 'doughnut',
      type: 'doughnut',
      data: props.chartData,
      options: props.chartData.options,
    })
    return { doughnutChartRef, Chart }
  },
})
</script>
