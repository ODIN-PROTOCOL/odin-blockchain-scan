<template>
  <LineChart class="custom-line-chart" ref="lineRef" v-bind="lineChartProps" />
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
import { Chart, registerables } from 'chart.js'
import { LineChart, useLineChart } from 'vue-chart-3'
import { getChartOptions } from '@/helpers/customChartHelpers'
import { formatedTelemetryDataForCharts } from '@/helpers/Types'

Chart.register(...registerables)

export default defineComponent({
  components: { LineChart },
  props: {
    datasetLabel: { type: String, default: 'Dataset' },
    datasetUnit: { type: String, default: '' },
    chartDataset: {
      type: Object as PropType<formatedTelemetryDataForCharts>,
      default: () => ({ data: [], labels: [] }),
    },
  },
  setup: function (props) {
    const { chartDataset, datasetUnit, datasetLabel } = toRefs(props)
    const lineRef = ref()

    const options = computed(() => {
      return getChartOptions(datasetUnit.value, chartDataset.value.labels)
    })

    const chartData = computed(() => ({
      labels: chartDataset.value.labels,
      datasets: [
        {
          label: datasetLabel.value,
          data: chartDataset.value.data,
          borderColor: '#66B0FF',
          backgroundColor: '#007BFF',
          tension: 0.4,
          radius: 0,
        },
      ],
    }))

    const { lineChartProps } = useLineChart({
      chartData,
      options,
    })

    return { lineRef, lineChartProps }
  },
})
</script>

<style lang="scss" scoped>
.custom-line-chart {
  min-height: 10rem;
}
</style>
