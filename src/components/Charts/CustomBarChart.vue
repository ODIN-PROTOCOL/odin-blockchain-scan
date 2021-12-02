<template>
  <BarChart ref="barRef" v-bind="barChartProps" />
</template>

<script lang="ts">
import { defineComponent, computed, ref, toRef, PropType } from 'vue'
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
    data: {
      type: (Object as PropType<formatedTelemetryDataForCharts>) || undefined,
    },
  },
  setup: function (props) {
    const _data = toRef(props, 'data')
    const _datasetLabel = toRef(props, 'datasetLabel')
    const _datasetUnit = toRef(props, 'datasetUnit')
    const barRef = ref()
    const options = computed(() => {
      return getChartOptions(_datasetUnit.value, _data.value?.labels || [])
    })

    const chartData = computed(() => ({
      labels: _data.value?.labels || [],
      datasets: [
        {
          label: _datasetLabel.value,
          data: _data.value?.data || [],
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