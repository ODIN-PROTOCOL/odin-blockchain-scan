<template>
  <div class="chart-block">
    <DoughnutChart ref="doughnutRef" v-bind="doughnutChartProps" />
    <template v-if="type === DoughnutChartType.SIMPLE">
      <div class="chart-block__stats mg-t32">
        <div
          class="chart-block__stats-row"
          v-for="(item, idx) in additionalInfo"
          :key="item.title"
        >
          <span class="chart-block__stats-percent">{{ item.percent }}%</span>
          <span
            class="chart-block__stats-color"
            :style="`background: ${SIMPLE_CHART_COLORS[idx]}`"
          ></span>
          <span class="chart-block__stats-info">
            {{ item.title }} ({{ item.count }} {{ item.denom }})
          </span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="chart-block__stats chart-block__stats_extended">
        <span class="chart-block__stats-count">{{ totalBlocks }}</span>
        <span class="chart-block__stats-title">Blocks</span>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, toRefs } from 'vue'
import { Chart, registerables } from 'chart.js'
import { DoughnutChart, useDoughnutChart } from 'vue-chart-3'
import {
  createExternalTooltip,
  DoughnutChartType,
} from '@/helpers/customChartHelpers'
import {
  formatedTelemetryDataForCharts,
  SimpleDoughnutChartAdditionalInfo,
  ExtendedDoughnutChartAdditionalInfo,
} from '@/helpers/Types'

Chart.register(...registerables)

const DEFAULT_CHART_COLORS = ['#CED4DA']
const DEFAULT_CHART_DATA = [100]

const SIMPLE_CHART_OPTIONS = {
  responsive: true,
  borderWidth: 0,
  cutout: '70%',
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
}
const SIMPLE_CHART_COLORS = ['#007BFF', '#66B0FF']
const EXTENDED_CHART_COLORS = [
  '#FDC748',
  '#00D097',
  '#F65160',
  '#CCE4FF',
  '#6C757D',
  '#053F7D',
  '#007BFF',
  '#66B0FF',
]

export default defineComponent({
  components: { DoughnutChart },
  props: {
    type: {
      type: Number as PropType<DoughnutChartType>,
      default: DoughnutChartType.EXTENDED,
    },
    chartDataset: {
      type: Object as PropType<formatedTelemetryDataForCharts>,
      default: () => ({ data: [], labels: [] }),
    },
    additionalInfo: {
      type: Array as PropType<
        | SimpleDoughnutChartAdditionalInfo[]
        | ExtendedDoughnutChartAdditionalInfo[]
      >,
      default: () => [],
    },
  },
  setup: function (props) {
    const { type, chartDataset, additionalInfo } = toRefs(props)
    const doughnutRef = ref()
    const totalBlocks = computed(() => {
      return chartDataset.value.data.reduce((prev, curr) => prev + curr, 0)
    })

    const chartColors = computed(() => {
      if (!chartDataset.value.data.length) return DEFAULT_CHART_COLORS
      return type.value === DoughnutChartType.SIMPLE
        ? SIMPLE_CHART_COLORS
        : EXTENDED_CHART_COLORS
    })

    const options = computed(() => {
      if (!chartDataset.value.data.length) return SIMPLE_CHART_OPTIONS
      return type.value === DoughnutChartType.SIMPLE
        ? SIMPLE_CHART_OPTIONS
        : {
            responsive: true,
            borderWidth: 0,
            hoverBorderRadius: 1,
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
                external: createExternalTooltip('', additionalInfo.value),
              },
            },
          }
    })

    const chartData = computed(() => ({
      datasets: [
        {
          data: chartDataset.value.data.length
            ? chartDataset.value.data
            : DEFAULT_CHART_DATA,
          backgroundColor: chartColors.value,
          borderColor: chartColors.value,
        },
      ],
    }))

    const { doughnutChartProps } = useDoughnutChart({
      chartData,
      options,
    })

    return {
      DoughnutChartType,
      totalBlocks,
      doughnutRef,
      doughnutChartProps,
      SIMPLE_CHART_COLORS,
    }
  },
})
</script>

<style lang="scss" scoped>
.chart-block {
  position: relative;

  &__stats {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    &_extended {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      align-items: center;
    }
  }

  &__stats-count {
    font-size: 2.4rem;
    font-weight: 600;
  }

  &__stats-row {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 1.6rem;
    }
  }

  &__stats-percent {
    display: inline-block;
    min-width: 3.6rem;
    font-size: 1.4rem;
    font-weight: 600;
  }

  &__stats-color {
    display: inline-block;
    width: 0.4rem;
    height: 1.8rem;
    margin: 0 0.8rem;
  }

  &__stats-info {
    font-size: 1.4rem;
  }
}

@include respond-to(tablet) {
  .chart-block {
    &__stats-count {
      font-size: 1.6rem;
    }
  }
}
</style>
