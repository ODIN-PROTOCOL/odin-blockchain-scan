<template>
  <div class="info-panel__chart">
    <div class="info-panel__chart-title">Transactions history statistics</div>
    <vue3-chart-js ref="chartRef" v-bind="{ ...Chart }" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import zoomPlugin from 'chartjs-plugin-zoom'
Vue3ChartJs.registerGlobalPlugins([zoomPlugin])

export default defineComponent({
  name: 'InfoPanelChart',
  components: {
    Vue3ChartJs,
  },
  setup() {
    const chartRef = ref<HTMLElement>()
    // TODO: Get read data for chart
    const Chart = {
      id: 'line',
      type: 'line',
      data: {
        labels: ['May 18', 'May 25', 'Jun 1'],
        datasets: [
          {
            label: false,
            backgroundColor: '#007bff',
            borderColor: '#007bff',
            borderWidth: 2,
            borderJoinStyle: 'round',
            borderCapStyle: 'round',
            tension: 0.5,
            borderSkipped: false,
            data: [1080, 1220, 1540],
          },
        ],
      },
      options: {
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
              },
            },
          },
        },
        elements: {
          point: {
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            borderWidth: 0,
            radius: 0,
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
            borderWidth: 0,
          },
          zoom: {
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: 'y',
            },
          },
        },
      },
    }
    return { chartRef, Chart }
  },
})
</script>

<style lang="scss" scoped>
.info-panel__chart {
  &-title {
    margin-bottom: 1.53rem;
  }
}
</style>
