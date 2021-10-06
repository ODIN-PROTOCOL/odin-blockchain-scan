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
      options: {
        maintainAspectRatio: false,
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
          },
          point: {
            borderWidth: 2,
          },
        },
      },
    }
    return { chartRef, Chart }
  },
})
</script>
