import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const chartPagesProps = {
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
    yAxisTitle: 'Average Transaction Fee (in LOKI)',
  },
}

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/blocks',
    name: 'Blocks',
    component: () => import('../views/Blocks.vue'),
  },
  {
    path: '/blocks/:id',
    name: 'BlocksItem',
    component: () => import('../views/BlocksItem.vue'),
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../views/Transactions.vue'),
  },
  {
    path: '/transactions/:hash',
    name: 'TransactionsItem',
    component: () => import('../views/TransactionsItem.vue'),
  },
  {
    path: '/pending_transactions',
    name: 'PendingTransactions',
    component: () => import('../views/PendingTransactions.vue'),
  },
  {
    path: '/validators',
    name: 'Validators',
    component: () => import('../views/Validators.vue'),
  },
  {
    path: '/validators/:address',
    name: 'ValidatorItem',
    component: () => import('../views/ValidatorItem.vue'),
  },
  {
    path: '/tokenomics',
    name: 'Tokenomics',
    component: () => import('../views/Tokenomics.vue'),
  },
  {
    path: '/odin-geo',
    name: 'odin&geo',
    component: () => import('../views/OdinGeo.vue'),
  },
  {
    path: '/delegators/:hash/',
    name: 'DelegatorItem',
    component: () => import('../views/DelegatorItem.vue'),
  },
  {
    path: '/top_accounts/',
    name: 'TopAccounts',
    component: () => import('../views/TopAccounts.vue'),
  },
  {
    path: '/account/:hash/',
    name: 'AccountsItem',
    component: () => import('../views/AccountsItem.vue'),
  },
  {
    path: '/charts-stats',
    name: 'Chart&Stats',
    component: () => import('../views/Charts-stats.vue'),
  },
  {
    path: '/charts-stats/charts',
    name: 'charts',
    children: [
      {
        path: 'validators',
        name: 'BlockValidatorsChart',
        component: () => import('../views/BlockValidatorsChart.vue'),
      },
      {
        path: 'average-odin-block-size',
        name: 'AverageOdinBlockSizeChart',
        component: () => import('../views/Chart.vue'),
        props: chartPagesProps.averageOdinBlockSizeChart,
      },
      {
        path: 'average-block-time',
        name: 'AverageBlockTimeChart',
        component: () => import('../views/Chart.vue'),
        props: chartPagesProps.averageBlockTimeChart,
      },
      {
        path: 'daily-transactions-volume',
        name: 'DailyTransactionsVolumeChart',
        component: () => import('../views/Chart.vue'),
        props: chartPagesProps.dailyTransactionsVolumeChart,
      },
      {
        path: 'average-transactions-fee',
        name: 'AverageTransactionFeeChart',
        component: () => import('../views/Chart.vue'),
        props: chartPagesProps.averageTransactionFeeChart,
      },
    ],
    component: () => import('../views/ChartPage.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
