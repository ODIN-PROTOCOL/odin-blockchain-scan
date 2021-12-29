<template>
  <BarChart ref="barRef" v-bind="barChartProps" />
</template>

<script lang="ts">
import { defineComponent, computed, ref, PropType, toRefs } from 'vue'
import { Chart, registerables } from 'chart.js'
import { BarChart, useBarChart } from 'vue-chart-3'
import { getChartOptions } from '@/helpers/customChartHelpers'
import { formatedTelemetryDataForCharts } from '@/helpers/Types'

Chart.register(...registerables)

export default defineComponent({
  components: { BarChart },
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
    const barRef = ref()
    const options = computed(() => {
      return getChartOptions(datasetUnit.value, chartDataset.value.labels)
    })

    const chartData = computed(() => ({
      labels: chartDataset.value.labels,
      datasets: [
        {
          label: datasetLabel.value,
          data: chartDataset.value.data,
          backgroundColor: '#66B0FF',
          hoverBackgroundColor: '#007BFF',
          borderRadius: 8,
          tension: 0.4,
        },
      ],
    }))

    const { barChartProps } = useBarChart({
      chartData,
      options,
    })

    return { barRef, barChartProps }
  }
})
</script>