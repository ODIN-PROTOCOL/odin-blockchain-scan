export const blockchainData = [
  [
    {
      title: 'Average ODIN Block Size Chart',
      chartType: 'bar',
      chartPageUrl: 'average-odin-block-size',
    },
    {
      title: 'Average Block Time Chart',
      chartType: 'bar',
      chartPageUrl: 'average-block-time',
    },
    {
      title: 'Daily Transactions Volume Chart',
      chartType: 'line',
      chartPageUrl: 'daily-transactions-volume',
    },
  ],
  [
    {
      title: 'Average Transaction Fee Chart',
      chartType: 'line',
      chartPageUrl: 'average-transactions-fee',
    },
    {
      title: 'Total Requests Chart',
      chartType: 'line',
      chartPageUrl: 'total-requests-chart',
    },
  ],
]

export const chartPagesProps = {
  averageOdinBlockSizeChart: {
    chartPageTitle: 'Average Odin Block Size Chart',
    chartType: 'bar',
    getDataMethodName: 'getAvgSizePerDays',
    datasetLabel: 'Block Size',
    datasetUnit: 'kilobytes',
    yAxisTitle: 'Block Size in Kilobyte',
  },
  averageBlockTimeChart: {
    chartPageTitle: 'Average Block Time Chart',
    chartType: 'bar',
    getDataMethodName: 'getAvgTimePerDays',
    datasetLabel: 'Block Time',
    datasetUnit: 'sec',
    yAxisTitle: 'Block Time in Seconds',
  },
  dailyTransactionsVolumeChart: {
    chartPageTitle: 'Daily Transactions Volume Chart',
    chartType: 'line',
    getDataMethodName: 'getTxVolumePerDays',
    datasetLabel: 'Transactions',
    yAxisTitle: 'Transactions per Day',
  },
  averageTransactionFeeChart: {
    chartPageTitle: 'Average Transaction Fee Chart',
    chartType: 'line',
    getDataMethodName: 'getAvgTxFeePerDays',
    datasetLabel: 'Average Transaction Fee',
    yAxisTitle: 'Average Transaction Fee',
  },
  averageRequestsChart: {
    chartPageTitle: 'Total Requests Chart',
    chartType: 'line',
    getDataMethodName: 'getRequestsVolumePerDays',
    datasetLabel: 'Number of request',
    yAxisTitle: 'Number of requests',
  },
}

export const DEFAULT_CHART_COLORS = ['#CED4DA']
export const DEFAULT_CHART_DATA = [100]

export const SIMPLE_CHART_OPTIONS = {
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
export const SIMPLE_CHART_COLORS = ['#007BFF', '#66B0FF']
export const EXTENDED_CHART_COLORS = [
  '#FDC748',
  '#00D097',
  '#F65160',
  '#CCE4FF',
  '#6C757D',
  '#053F7D',
  '#007BFF',
  '#66B0FF',
]
