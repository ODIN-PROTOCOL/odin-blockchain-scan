export type Link = {
  to?: string
  text?: string
  title?: string
}
export type LinkList = {
  name: string
  links: Array<Link>
}

export type ChartDataSetsType = {
  backgroundColor: string
  borderColor: string
  borderWidth: string | number
  borderJoinStyle: string
  borderCapStyle: string
  tension: number
  borderSkipped: boolean
  data: Array<string | number>
}

export type ChartDataType = {
  labels: Array<string | Date>
  datasets: Array<ChartDataSetsType>
}
