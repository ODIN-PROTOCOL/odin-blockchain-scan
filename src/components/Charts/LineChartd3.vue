<template>
  <div ref="chartEl" class="chart-wrapper" />
</template>

<style>
.chart-wrapper {
  width: 100%;
  height: 45.9rem;
}

.domain,
.tick line {
  color: transparent;
}
.tick text {
  font-size: 1.3rem;
}
</style>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { marginType } from '@/helpers/Types'
import {
  select,
  scaleLinear,
  scaleBand,
  scaleTime,
  line,
  max,
  extent,
  timeParse,
  axisLeft,
  axisBottom,
} from 'd3'

export default defineComponent({
  name: 'LineChartD3',
  props: {
    chart: {
      type: Array as <T>() => Array<T>,
      required: true,
    },
    margin: {
      type: Object as () => marginType,
      default: () => ({
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
      }),
    },
    duration: {
      type: Number,
      default: () => 250,
    },
  },
  setup(props) {
    const chartEl = ref<HTMLDivElement | null>(null)
    const height = ref<number>()
    const width = ref<number>()
    const chart = ref()
    const _scaleX = ref()
    const _scaleY = ref()
    const xAxis = ref()
    const yAxis = ref()
    const _line = ref()

    function _init() {
      if (!chartEl.value) throw new ReferenceError(`chartEl ref error`)
      height.value =
        chartEl?.value?.clientHeight - props.margin.top - props.margin.bottom
      width.value =
        chartEl?.value?.clientWidth - props.margin.left - props.margin.right

      chart.value = select(chartEl.value)
        .append('svg')
        .attr('class', 'chart-svg')
        .attr('width', width.value + props.margin.left + props.margin.right)
        .attr('height', height.value + props.margin.top + props.margin.bottom)
        .append('svg:g')
        .attr(
          'transform',
          `translate(${props.margin.left},${props.margin.top})`
        )

      _scaleX.value = scaleBand().range([0, width.value as number])
      _scaleY.value = scaleLinear().range([height.value as number, 0])

      xAxis.value = axisBottom(_scaleX.value)
      yAxis.value = axisLeft(_scaleY.value)

      chart.value
        .append('svg:g')
        .attr('class', 'axis-x')
        .call(xAxis.value)
        .attr('transform', `translate(0,${height.value})`)

      chart.value.append('svg:g').attr('class', 'axis-y').call(yAxis.value)

      _draw()
    }

    function _draw() {
      _scaleX.value
        .domain(props.chart.map((d: any) => d.date))
        .range([0, width.value])
      _scaleY.value.domain([0, max(props.chart, (d: any) => d.value)])

      // Define the line
      _line.value = line()
        .y((d: any) => _scaleY.value(d.value))
        .x((d: any) => _scaleX.value(d.date))

      chart.value
        .append('path')
        .attr('class', 'line')
        .datum(props.chart)
        .attr('fill', 'none')
        .attr('stroke', '#66B0FF')
        .attr('stroke-width', 1.5)
        .attr('d', _line.value)

      select('.chart-svg').select('.axis-x').transition().call(xAxis.value)
      select('.chart-svg').select('.axis-y').transition().call(yAxis.value)
    }

    onMounted(() => {
      _init()
    })

    watch(props.chart, () => {
      return _draw()
    })

    return { chartEl }
  },
})
</script>
