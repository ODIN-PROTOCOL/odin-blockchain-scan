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

export const setPage = (pageNumber: number): void => {
  router.push({
    query: { page: pageNumber },
  })
}

const routes: Array<RouteRecordRaw> = [
  { path: '/', name: 'Redirector', redirect: { name: 'Home' } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: { name: 'Home' } },
  {
    path: '/',
    name: 'Home',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
  },
  {
    path: '/blocks',
    name: 'Blocks',
    component: () =>
      import(/* webpackChunkName: "blocks" */ '../views/BlocksList.vue'),
  },
  {
    path: '/blocks/:id',
    name: 'BlocksItem',
    component: () =>
      import(/* webpackChunkName: "blocks" */ '../views/BlocksItem.vue'),
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () =>
      import(
        /* webpackChunkName: "transactions" */ '../views/TransactionsView.vue'
      ),
  },
  {
    path: '/transactions/:hash',
    name: 'TransactionsItem',
    component: () =>
      import(
        /* webpackChunkName: "transactions" */ '../views/TransactionsItem.vue'
      ),
  },
  {
    path: '/validators',
    name: 'Validators',
    component: () =>
      import(
        /* webpackChunkName: "validators" */ '../views/ValidatorsView.vue'
      ),
  },
  {
    path: '/validators/:address',
    name: 'ValidatorItem',
    component: () =>
      import(/* webpackChunkName: "validators" */ '../views/ValidatorItem.vue'),
  },
  {
    path: '/top-accounts',
    name: 'TopAccounts',
    component: () =>
      import(/* webpackChunkName: "accounts" */ '../views/TopAccounts.vue'),
  },
  {
    path: '/account/:hash',
    name: 'AccountsItem',
    component: () =>
      import(/* webpackChunkName: "accounts" */ '../views/AccountsItem.vue'),
  },
  {
    path: '/charts',
    name: 'ChartPage',
    children: [
      {
        path: '',
        name: 'ChartsStats',
        component: () =>
          import(/* webpackChunkName: "charts" */ '../views/ChartsStats.vue'),
      },
      {
        path: 'validators',
        name: 'BlockValidatorsChart',
        component: () =>
          import(
            /* webpackChunkName: "charts" */ '../views/BlockValidatorsChart.vue'
          ),
      },
      {
        path: 'average-odin-block-size',
        name: 'AverageOdinBlockSizeChart',
        component: () =>
          import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
        props: chartPagesProps.averageOdinBlockSizeChart,
      },
      {
        path: 'average-block-time',
        name: 'AverageBlockTimeChart',
        component: () =>
          import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
        props: chartPagesProps.averageBlockTimeChart,
      },
      {
        path: 'daily-transactions-volume',
        name: 'DailyTransactionsVolumeChart',
        component: () =>
          import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
        props: chartPagesProps.dailyTransactionsVolumeChart,
      },
      {
        path: 'average-transactions-fee',
        name: 'AverageTransactionFeeChart',
        component: () =>
          import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
        props: chartPagesProps.averageTransactionFeeChart,
      },
      {
        path: 'total-requests-chart',
        name: 'TotalRequestsChart',
        component: () =>
          import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
        props: chartPagesProps.averageRequestsChart,
      },
    ],
    component: () =>
      import(/* webpackChunkName: "charts" */ '../views/ChartPage.vue'),
  },
  {
    path: '/ibc',
    name: 'IBC',
    component: () =>
      import(/* webpackChunkName: "ibc" */ '../views/IbcView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
