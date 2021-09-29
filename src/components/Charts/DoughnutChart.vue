<template>
  <div class="doughnut_chart">
    <vue3-chart-js ref="chartRef" v-bind="{ ...Chart }" />
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
import { externalTooltipHandler } from '@/helpers/chartHelpers'

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
    const chartRef = ref<HTMLElement>()
    // let segment = null
    const Chart = {
      id: 'doughnut',
      type: 'doughnut',
      data: props.chartData,

      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: 20,
        },
        plugins: {
          title: {
            display: false,
          },
          tooltip: {
            enabled: false,
            external: externalTooltipHandler,
          },
          legend: {
            display: false,
          },
        },
        // onHover: function ({ chart }, element) {
        //   if (element.length) {
        //     let segment = element[0]
        //     segment.element.options.offset = 20
        //     chart.update()
        //   }
        // },
      },
    }
    return { chartRef, Chart }
  },
})
</script>
