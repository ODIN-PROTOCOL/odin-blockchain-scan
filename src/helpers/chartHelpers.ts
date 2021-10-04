import { cropAddress } from '@/helpers/formatters'
import { externalTooltipType, titleLineType } from '@/helpers/Types'

const _getOrCreateTooltip = (chart): HTMLElement => {
  let tooltipEl: HTMLElement = chart.canvas.parentNode.querySelector('div')
  if (!tooltipEl) {
    const arrow: HTMLSpanElement = document.createElement('span')
    tooltipEl = document.createElement('div')
    tooltipEl.style.background = '#053F7D'
    tooltipEl.style.borderRadius = '3px'
    tooltipEl.style.color = 'white'
    tooltipEl.style.opacity = '1'
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.transition = 'all .1s ease'

    arrow.style.position = 'absolute'
    arrow.style.background = 'transparent'
    arrow.style.top = 'calc(50% - 10px)'
    arrow.style.left = '-10px'
    arrow.style.width = '10px'
    arrow.style.height = '10px'
    arrow.style.borderTop = '10px solid transparent'
    arrow.style.borderRight = '10px solid #053F7D'
    arrow.style.borderBottom = '10px solid transparent'

    const table: HTMLElement = document.createElement('table')
    table.style.margin = '0px'

    tooltipEl.appendChild(table)
    tooltipEl.appendChild(arrow)
    chart.canvas.parentNode.appendChild(tooltipEl)
  }
  return tooltipEl
}

export const externalTooltipHandler = (context: externalTooltipType): void => {
  const { chart, tooltip } = context
  const tooltipEl = _getOrCreateTooltip(chart)
  if (tooltip?.opacity === 0) {
    tooltipEl.style.opacity = '0'
    return
  }
  if (tooltip?.body) {
    const titleLines: titleLineType = tooltip.dataPoints[0]
      .label as unknown as titleLineType
    const bodyLines = [titleLines]
    const tableHead = document.createElement('thead')
    const tr = document.createElement('tr')
    tr.style.borderWidth = '0'
    const th = document.createElement('th')
    th.style.borderWidth = '0'
    th.style.textAlign = 'left'
    const text = document.createTextNode(
      `${cropAddress(titleLines.validatorAddress)}`
    )
    th.appendChild(text)
    tr.appendChild(th)
    tableHead.appendChild(tr)

    const tableBody = document.createElement('tbody')
    bodyLines.forEach((body) => {
      const spanBlocks = document.createElement('span')
      spanBlocks.style.display = 'inline-block'
      spanBlocks.style.color = 'rgba(255,255,255,0.6)'
      spanBlocks.style.paddingRight = '8px'
      spanBlocks.innerText = 'Blocks:'
      const spanPercentage = document.createElement('span')
      spanPercentage.style.display = 'inline-block'
      spanPercentage.style.color = 'rgba(255,255,255,0.6)'
      spanPercentage.style.paddingRight = '8px'
      spanPercentage.innerText = 'Stake percentage:'

      const tr = document.createElement('tr')
      const tr2 = document.createElement('tr')
      tr.style.backgroundColor = 'inherit'
      tr.style.borderWidth = '0'

      const td = document.createElement('td')
      const td2 = document.createElement('td')
      td.style.borderWidth = '0'

      const blocksCounterText = document.createTextNode(body.blocksCounter)
      const StakePercentageText = document.createTextNode(
        `${body.stakePercentage}`
      )
      td.appendChild(spanBlocks)
      td.appendChild(blocksCounterText)
      tr.appendChild(td)
      td2.appendChild(spanPercentage)
      td2.appendChild(StakePercentageText)
      tr2.appendChild(td2)
      tableBody.appendChild(tr)
      tableBody.appendChild(tr2)
    })
    const tableRoot = tooltipEl.querySelector('table')
    while (tableRoot?.firstChild) {
      tableRoot?.firstChild.remove()
    }
    tableRoot?.appendChild(tableHead)
    tableRoot?.appendChild(tableBody)
  }
  const { offsetLeft, offsetTop } = chart?.canvas as HTMLElement
  tooltipEl.style.opacity = '1'
  if (tooltip && 'caretX' in tooltip && 'caretY' in tooltip) {
    tooltipEl.style.left = offsetLeft + tooltip?.caretX + 'px'
    tooltipEl.style.top = offsetTop + tooltip?.caretY + 'px'
  }
  tooltipEl.style.padding =
    tooltip?.options.padding + 'px ' + tooltip?.options.padding + 'px'
}
