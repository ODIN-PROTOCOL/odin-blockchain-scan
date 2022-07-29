import { externalTooltipType, titleLineType } from '@/helpers/Types'

class TooltipHandler {
  private readonly _context: externalTooltipType
  private _tooltipEl: HTMLElement | null

  constructor(context: externalTooltipType = {}) {
    this._context = context
    this._tooltipEl = null
  }

  get context(): externalTooltipType {
    return this._context
  }

  get tooltipEl(): HTMLElement | null {
    return this._tooltipEl
  }

  set tooltipEl(value: HTMLElement | null) {
    this._tooltipEl = value
  }

  private static _createDesignSpanForTooltip(
    text?: string,
    color?: string,
  ): HTMLSpanElement {
    const spanBlocks = document.createElement('span')
    spanBlocks.style.display = 'inline-block'
    spanBlocks.style.color = color ? color : 'rgba(255,255,255,0.6)'
    spanBlocks.style.paddingRight = '8px'
    spanBlocks.innerText = text ? text : ''
    return spanBlocks
  }

  private static _createArrow(position: string): HTMLSpanElement {
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

  private createTooltipEl(): void {
    const { chart } = this.context
    if (chart?.canvas?.parentNode?.querySelector('div'))
      this.tooltipEl = chart?.canvas?.parentNode?.querySelector('div')

    if (!this.tooltipEl) {
      this.tooltipEl = document.createElement('div')
      this.tooltipEl.style.background = '#053F7D'
      this.tooltipEl.style.borderRadius = '3px'
      this.tooltipEl.style.color = 'white'
      this.tooltipEl.style.opacity = '1'
      this.tooltipEl.style.pointerEvents = 'none'
      this.tooltipEl.style.position = 'absolute'
      this.tooltipEl.style.transition = 'all .1s ease'

      const table: HTMLElement = document.createElement('table')
      table.style.margin = '0px'

      this.tooltipEl.appendChild(table)
      this.tooltipEl.appendChild(TooltipHandler._createArrow('bottom'))
      chart?.canvas?.parentNode?.appendChild(this.tooltipEl)
    }
  }

  init(): void {
    this.createTooltipEl()
    if (this.context.tooltip?.opacity === 0 && this.tooltipEl) {
      this.tooltipEl.style.opacity = '0'
      return
    }

    if (this.context.tooltip?.body && this.tooltipEl) {
      const titleLines: Partial<titleLineType> = this.context.tooltip
        .dataPoints[0].label as Partial<titleLineType>
      const bodyLines = [titleLines]

      if (typeof this.context.tooltip.dataPoints[0].raw === 'object') {
        // eslint-disable-next-line no-console
        console.debug(this.context.tooltip.dataPoints[0].raw)
      }

      const tableHead = document.createElement('thead')
      const tr = document.createElement('tr')
      tr.style.borderWidth = '0'
      const th = document.createElement('th')
      th.style.borderWidth = '0'
      th.style.textAlign = 'left'

      const text = document.createTextNode(this.context.tooltip.title[0])

      th.appendChild(text)
      tr.appendChild(th)
      tableHead.appendChild(tr)

      const tableBody = document.createElement('tbody')

      bodyLines.forEach(() => {
        const tr = document.createElement('tr')
        tr.style.backgroundColor = 'inherit'
        tr.style.borderWidth = '0'
        const td = document.createElement('td')
        td.style.borderWidth = '0'
        td.appendChild(
          TooltipHandler._createDesignSpanForTooltip('Transactions:'),
        )
        td.appendChild(
          TooltipHandler._createDesignSpanForTooltip(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.context.tooltip.dataPoints[0].raw.data,
            '#fff',
          ),
        )
        tr.appendChild(td)
        tableBody.appendChild(tr)
      })

      const tableRoot = this.tooltipEl?.querySelector('table')
      while (tableRoot?.firstChild) {
        tableRoot?.firstChild.remove()
      }
      tableRoot?.appendChild(tableHead)
      tableRoot?.appendChild(tableBody)
    }
    const { offsetLeft, offsetTop } = this.context.chart?.canvas as HTMLElement
    if (this.tooltipEl) this.tooltipEl.style.opacity = '1'
    if (
      this.tooltipEl &&
      this.context.tooltip &&
      'caretX' in this.context.tooltip &&
      'caretY' in this.context.tooltip
    ) {
      this.tooltipEl.style.left =
        offsetLeft + this.context.tooltip?.caretX - 72 + 'px'
      this.tooltipEl.style.top =
        offsetTop + this.context.tooltip?.caretY - 76 + 'px'
    }
    if (this.tooltipEl) {
      this.tooltipEl.style.padding =
        this.context.tooltip?.options.padding +
        'px ' +
        this.context.tooltip?.options.padding +
        'px'
    }
  }
}

export const dailyTransactionsVolumeTooltipHandler = (
  context: externalTooltipType,
): void => {
  const th = new TooltipHandler(context)
  th.init()
}
