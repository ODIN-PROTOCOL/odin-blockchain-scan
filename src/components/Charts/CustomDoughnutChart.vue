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

<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'
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
import {
  SIMPLE_CHART_OPTIONS,
  DEFAULT_CHART_COLORS,
  SIMPLE_CHART_COLORS,
  EXTENDED_CHART_COLORS,
  DEFAULT_CHART_DATA,
} from '@/const'
Chart.register(...registerables)

const props = withDefaults(
  defineProps<{
    type?: DoughnutChartType
    chartDataset?: formatedTelemetryDataForCharts
    additionalInfo:
      | SimpleDoughnutChartAdditionalInfo[]
      | ExtendedDoughnutChartAdditionalInfo[]
  }>(),
  {
    type: DoughnutChartType.EXTENDED,
    additionalInfo: () => [],

    chartDataset: () => ({ data: [], labels: [] }),
  },
)

const { type, chartDataset, additionalInfo } = toRefs(props)
const doughnutRef = ref()
const totalBlocks = computed(() => {
  return additionalInfo.value
    .map(item => item?.Blocks)
    ?.reduce((prev, curr) => prev + curr, 0)
})

const chartColors = computed(() => {
  if (!chartDataset.value.data?.length) return DEFAULT_CHART_COLORS
  return type.value === DoughnutChartType.SIMPLE
    ? SIMPLE_CHART_COLORS
    : EXTENDED_CHART_COLORS
})

const options = computed(() => {
  if (!chartDataset.value.data?.length) return SIMPLE_CHART_OPTIONS
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
  labels: [],
  datasets: [
    {
      data: chartDataset.value.data?.length
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
