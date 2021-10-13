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
.y.axis-grid .tick line {
  color: #cce4ff !important;
}
.y.axis-grid > .domain {
  display: none;
}
</style>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from 'vue'
import { marginType } from '@/helpers/Types'
import {
  select,
  scaleLinear,
  scaleTime,
  line,
  extent,
  axisLeft,
  axisBottom,
  curveBumpY,
  curveBumpX,
  max,
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
        top: 25,
        right: 25,
        bottom: 25,
        left: 25,
      }),
    },
    duration: {
      type: Number,
      default: () => 250,
    },
  },
  setup: function (props) {
    const chartEl = ref<HTMLDivElement | null>(null)
    const chart = ref()

    const height = ref<number>()
    const width = ref<number>()

    const _x = ref()
    const _y = ref()
    const xAxis = ref()
    const yAxisGrid = ref()
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
        .attr(
          'viewBox',
          `0, 0, ${width.value + props.margin.left + props.margin.right}, ${
            height.value + props.margin.top + props.margin.bottom
          }`
        )
        .style('-webkit-tap-highlight-color', 'transparent')
        .style('overflow', 'visible')
        .attr('class', 'chart-svg')
        .attr('width', width.value + props.margin.left + props.margin.right)
        .attr('height', height.value + props.margin.top + props.margin.bottom)
        .append('svg:g')
        .attr(
          'transform',
          `translate(${props.margin.left},${props.margin.top})`
        )

      /**
       * Tooltip
       */
      chart.value.append('svg:g').attr('class', 'chart-tooltip')
      chart.value.on('touchmove mousemove', (event) => {
        console.debug('event', event)
      })

      // TODO: scaleBand ? scaleTime? or smth else?
      _x.value = scaleTime()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .domain(extent(props.chart, (d: any) => d.date))
        .range([
          props.margin.left,
          (width.value as number) - props.margin.right,
        ])

      _y.value = scaleLinear()
        .domain([0, max(props.chart, (d: any) => d.value)])
        .range([
          (height.value as number) - props.margin.bottom,
          props.margin.top,
        ])
        .range([
          (height.value as number) - props.margin.bottom,
          props.margin.top,
        ])

      xAxis.value = axisBottom(_x.value)
      yAxis.value = axisLeft(_y.value)

      yAxisGrid.value = axisLeft(_y.value)
        .tickSize(-width.value)
        .tickFormat(() => '')
        .ticks(10)

      _draw()
    }

    function _draw() {
      _line.value = line()
        .defined((d: any) => !isNaN(d.value))
        // Kappa :D
        .curve(curveBumpY)
        .curve(curveBumpX)
        .x((d: any) => _x.value(d.date))
        .y((d: any) => _y.value(d.value))

      chart.value
        .append('path')
        .attr('class', 'line')
        .datum(props.chart)
        .attr('fill', 'none')
        .attr('stroke', '#66B0FF')
        .attr('stroke-width', 1.5)
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('d', _line.value)

      chart.value
        .append('svg:g')
        .attr('class', 'dots')
        .selectAll('dot')
        .data(props.chart)
        .enter()
        .append('circle')
        .attr('cx', (d: any) => _x.value(d.date))
        .attr('cy', (d: any) => _y.value(d.value))
        .attr('r', 3)
        .attr('fill', '#66B0FF')

      chart.value
        .append('svg:g')
        .attr('class', 'axis-x')
        .attr(
          'transform',
          `translate(0,${(height.value as number) - props.margin.bottom})`
        )
        .call(xAxis.value)

      chart.value
        .append('svg:g')
        .attr('class', 'y axis-grid')
        .call(yAxisGrid.value)
        .attr('transform', `translate(${props.margin.left},0)`)

      chart.value
        .append('svg:g')
        .attr('class', 'axis-y')
        .attr('transform', `translate(${props.margin.left},0)`)
        .call(yAxis.value)
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
