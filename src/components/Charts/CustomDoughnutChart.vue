<template>
  <div class="chart-block">
    <DoughnutChart ref="doughnutRef" v-bind="doughnutChartProps" />
    <div class="chart-block__stats">
      <span class="chart-block__stats-count">{{ totalBlocks }}</span>
      <span class="chart-block__stats-title">Blocks</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import { Chart, registerables } from 'chart.js'
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3'
import { formatedTelemetryDataForCharts } from '@/helpers/Types'
import { createExternalTooltip } from '@/helpers/customChartHelpers'

Chart.register(...registerables)

export default defineComponent({
  components: { DoughnutChart },
  props: {
    datasetLabel: { type: String, default: 'Dataset' },
    datasetUnit: { type: String, default: '' },
    chartDataset: {
      type: Object as PropType<formatedTelemetryDataForCharts>,
      default: () => ({ data: [], labels: [] }),
    },
  },
  setup: function (props) {
    const { chartDataset, datasetLabel } = toRefs(props)
    const totalBlocks = computed(() => {
      return chartDataset.value.data.reduce((prev, curr) => prev + curr, 0)
    })
    const doughnutRef = ref()

    const options = computed(() => {
      return {
        responsive: true,
        borderWidth: 0,
        // borderColor: 'transparent',
        hoverBorderRadius: {
          outerStart: 0,
          outerEnd: 0,
          innerStart: 1,
          innerEnd: 1,
        },
        borderJoinStyle: 'miter',
        cutout: '60%',
        hoverBorderWidth: 12,
        hoverOffset: -12,
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
          tooltip: {
            yAlign: 'chartjs-tooltip_bottom',
            padding: 0,
            enabled: false,
            external: createExternalTooltip(''),
          },
        },
      }
    })

    const chartData = computed(() => ({
      labels: chartDataset.value.labels,
      datasets: [
        {
          label: datasetLabel.value,
          data: chartDataset.value.data,
          backgroundColor: ['#FDC748','#00D097','#F65160','#CCE4FF','#6C757D','#053F7D','#007BFF','#66B0FF','#FDC748','#00D097'],
          borderColor: ['#FDC748','#00D097','#F65160','#CCE4FF','#6C757D','#053F7D','#007BFF','#66B0FF','#FDC748','#00D097'],
        },
      ],
    }))

    const { doughnutChartProps } = useDoughnutChart({
      chartData,
      options,
    })

    return { totalBlocks, doughnutRef, doughnutChartProps }
  },
})
</script>

<style lang="scss" scoped>
.chart-block {
  position: relative;

  &__stats {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__stats-count {
    font-size: 2.4rem;
    font-weight: 600;
  }
}

@include respond-to(768px) {
  .chart-block {
    &__stats-count {
      font-size: 1.6rem;
    }
  }
}
</style>
