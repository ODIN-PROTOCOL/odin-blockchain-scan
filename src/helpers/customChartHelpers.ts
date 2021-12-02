import {
  telemetryDataForCharts,
  formatedTelemetryDataForCharts,
} from '@/helpers/Types'

export const getChartOptions = (datasetUnit: string, labels: string[]) => {
  return {
    responsive: true,
    scales: {
      yAxis: {
        beginAtZero: true,
        ticks: {
          count: 6,
        }
      },
      xAxis: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 10,
          callback: (value) => {
            return _getShortLabelDate(labels[value])
          }
        }
      }
    },
    interaction: {
      intersect: false,
      axis: 'x',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        yAlign: 'bottom',
        padding: 0,
        enabled: false,
        external: function (ctx): void {
          const tooltipModel = ctx.tooltip
          let tooltipEl = document.getElementById('chartjs-tooltip')
          let tooltipArrow = tooltipEl?.querySelector('.arrow') as HTMLElement

          // Create element on first render
          if (!tooltipEl) {
            tooltipEl = _createTooltip()
            tooltipArrow = _createTooltipArrow(tooltipEl)
          }

          _setTooltipArrowPosition(tooltipEl, tooltipModel)

          // Set Text
          if (tooltipModel.body) {
            let innerHtml = ''
            innerHtml += _setTooltipTitles(tooltipModel)
            innerHtml += _setTooltipBody(tooltipModel, datasetUnit)

            const divRoot = tooltipEl.querySelector('div')
            if (divRoot) {
              divRoot.innerHTML = innerHtml
            }
          }

          _toggleTooltipDisplay(tooltipEl, tooltipModel)

          _setTooltipAndArrowOnChart(
            ctx.chart,
            tooltipModel,
            tooltipEl,
            tooltipArrow
          )
        },
      },
    },
  }
}

const _createTooltip = (): HTMLElement => {
  const tooltipEl = document.createElement('div')
  tooltipEl.id = 'chartjs-tooltip'
  tooltipEl.innerHTML = '<div></div>'
  document.body.appendChild(tooltipEl)

  return tooltipEl
}

const _createTooltipArrow = (tooltip: HTMLElement): HTMLElement => {
  const tooltipArrow = document.createElement('span')
  tooltipArrow.className = 'arrow'
  tooltip.appendChild(tooltipArrow)
  
  return tooltipArrow
}

const _toggleTooltipDisplay = (tooltip: HTMLElement, tooltipModel: any) => {
  tooltip.style.opacity = tooltipModel.opacity === 0 ? '0' : '1'
}

const _setTooltipArrowPosition = (tooltip: HTMLElement, tooltipModel: any) => {
  tooltip.classList.remove('above', 'below', 'no-transform')

  if (tooltipModel.yAlign) {
    tooltip.classList.add(tooltipModel.yAlign)
  } else {
    tooltip.classList.add('no-transform')
  }
}

const _setTooltipAndArrowOnChart = (
  chart: any,
  tooltipModel: any,
  tooltip: HTMLElement,
  tooltipArrow: HTMLElement
) => {
  const position = chart.canvas.getBoundingClientRect()

  tooltip.style.left =
    position.left +
    window.pageXOffset +
    tooltipModel.x -
    (tooltip.offsetWidth - tooltipModel.width) / 2 +
    'px'
  tooltip.style.top =
    position.top +
    window.pageYOffset +
    tooltipModel.caretY -
    tooltip.offsetHeight -
    18 +
    'px'

  tooltipArrow.style.left =
    tooltipModel.caretX + position.left - tooltip.offsetLeft + 'px'
}

const _setTooltipTitles = (tooltipModel) => {
  const titleLines = tooltipModel.title
  let innerHtml = ''

  titleLines.forEach((title) => {
    innerHtml += '<span>' + _getLabelDate(title) + '</span>'
  })

  return innerHtml
}

const _setTooltipBody = (tooltipModel, unit: string) => {
  const bodyLines = tooltipModel.body.map((item) => item.lines)
  let innerHtml = ''

  bodyLines.forEach((body) => {
    const delimiterIndex = body[0].lastIndexOf(':')
    const lineTitle = body[0].substring(0, delimiterIndex + 1)
    const lineValue = body[0].substring(delimiterIndex + 1, body[0].length)
    innerHtml +=
      '<div class="tooltip-row"><span class="tooltip-row__title">' +
      lineTitle +
      '</span><span>' +
      '&nbsp' +
      lineValue +
      '&nbsp' +
      unit +
      '</span></div>'
  })

  return innerHtml
}

const _getLabelDate = (date: string) => {
  const dateObj = new Date(date)
  const month = dateObj.toLocaleString('en', { month: 'long' })
  const day = dateObj.getDate()
  const year = dateObj.getFullYear()

  return `${month} ${day}, ${year}`
}

const _getShortLabelDate = (date: string) => {
  const dateObj = new Date(date)
  const month = dateObj.toLocaleString('en', { month: 'short' })
  const day = dateObj.getDate()
  
  return `${month}. ${day}`
}

export const formatDataForCharts = (
  data: telemetryDataForCharts[]
): formatedTelemetryDataForCharts => {
  const values: number[] = []
  const labels: string[] = []

  data.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  data.forEach(({ date, ...rest }: telemetryDataForCharts) => {
    labels.push(date)
    if (rest.fee) {
      const amount = Number(rest.fee[0]?.amount) || 0
      values.push(amount)
    } else {
      values.push(Object.values(rest)[0])
    }
  })

  return { data: values, labels }
}
