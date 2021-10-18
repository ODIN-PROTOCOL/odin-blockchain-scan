import { cropAddress } from '@/helpers/formatters'
import { externalTooltipType, titleLineType } from '@/helpers/Types'

const _createDesignSpanForTooltip = (
  text?: string,
  color?: string
): HTMLSpanElement => {
  const spanBlocks = document.createElement('span')
  spanBlocks.style.display = 'inline-block'
  spanBlocks.style.color = color ? color : 'rgba(255,255,255,0.6)'
  spanBlocks.style.paddingRight = '8px'
  spanBlocks.innerText = text ? text : ''
  return spanBlocks
}

const _createArrow = (position: string): HTMLSpanElement => {
  const arrow: HTMLSpanElement = document.createElement('span')

  arrow.style.position = 'absolute'
  arrow.style.background = 'transparent'
  arrow.style.width = '10px'
  arrow.style.height = '10px'
  arrow.style.borderTop = '10px solid transparent'
  arrow.style.borderRight = '10px solid #053F7D'
  arrow.style.borderBottom = '10px solid transparent'

  // TODO: describe all positions
  switch (position) {
    case 'left':
      arrow.style.top = 'calc(50% - 10px)'
      arrow.style.left = '-10px'
      arrow.style.bottom = '-10px'
      break
    case 'bottom':
      arrow.style.top = 'calc(100% - 5px)'
      arrow.style.left = '50%'
      arrow.style.transform = 'rotate(270deg)'
      break
    default:
      throw new ReferenceError(`Unknown position ${position}`)
  }

  return arrow
}

const _getOrCreateTooltip = (chart): HTMLElement => {
  let tooltipEl: HTMLElement = chart.canvas.parentNode.querySelector('div')
  if (!tooltipEl) {
    tooltipEl = document.createElement('div')
    tooltipEl.style.background = '#053F7D'
    tooltipEl.style.borderRadius = '3px'
    tooltipEl.style.color = 'white'
    tooltipEl.style.opacity = '1'
    tooltipEl.style.pointerEvents = 'none'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.transition = 'all .1s ease'

    const table: HTMLElement = document.createElement('table')
    table.style.margin = '0px'

    tooltipEl.appendChild(table)
    tooltipEl.appendChild(_createArrow('left'))
    chart.canvas.parentNode.appendChild(tooltipEl)
  }
  return tooltipEl
}

export const doughnutTooltipHandler = (context: externalTooltipType): void => {
  const { chart, tooltip } = context
  const tooltipEl = _getOrCreateTooltip(chart)
  if (tooltip?.opacity === 0) {
    tooltipEl.style.opacity = '0'
    return
  }
  if (tooltip?.body) {
    const titleLines: Partial<titleLineType> = tooltip.dataPoints[0]
      .label as Partial<titleLineType>
    const bodyLines = [titleLines]
    console.debug('bodyLines', bodyLines)

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
      const tr = document.createElement('tr')
      const tr2 = document.createElement('tr')
      tr.style.backgroundColor = 'inherit'
      tr.style.borderWidth = '0'

      const td = document.createElement('td')
      const td2 = document.createElement('td')
      td.style.borderWidth = '0'

      td.appendChild(_createDesignSpanForTooltip('Blocks:'))
      td.appendChild(_createDesignSpanForTooltip(body.blocksCounter, '#fff'))
      tr.appendChild(td)
      td2.appendChild(_createDesignSpanForTooltip('Stake percentage:'))
      td2.appendChild(_createDesignSpanForTooltip(body.stakePercentage, '#fff'))
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
