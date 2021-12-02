<template>
  <div>
    <LineChart ref="lineRef" v-bind="lineChartProps" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, toRef, PropType } from 'vue'
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
    data: {
      type: Object as PropType<formatedTelemetryDataForCharts>,
    },
  },
  setup: function (props) {
    const _data = toRef(props, 'data')
    const _datasetLabel = toRef(props, 'datasetLabel')
    const _datasetUnit = toRef(props, 'datasetUnit')
    const lineRef = ref()

    const options = computed(() => {
      return getChartOptions(_datasetUnit.value, _data.value?.labels || [])
    })

    const chartData = computed(() => ({
      labels: _data.value?.labels || [],
      datasets: [
        {
          label: _datasetLabel.value,
          data: _data.value?.data || [],
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

<style lang="scss" scoped></style>
