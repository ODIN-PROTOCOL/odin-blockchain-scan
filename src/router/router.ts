import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { chartPagesProps } from '@/const'
import { ROUTE_NAMES } from '@/enums'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:pathMatch(.*)*',
    name: ROUTE_NAMES.notFound,
    redirect: { name: ROUTE_NAMES.app },
  },
  {
    path: '/',
    name: ROUTE_NAMES.app,
    redirect: { name: ROUTE_NAMES.home },
    children: [
      {
        path: '',
        name: ROUTE_NAMES.home,
        component: () =>
          import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
      },
      {
        path: '/blocks',
        name: ROUTE_NAMES.blocks,
        component: () =>
          import(/* webpackChunkName: "blocks" */ '../views/BlocksList.vue'),
      },
      {
        path: '/blocks/:id',
        name: ROUTE_NAMES.blockDetails,
        component: () =>
          import(/* webpackChunkName: "blocks" */ '../views/BlocksItem.vue'),
      },
      {
        path: '/transactions',
        name: ROUTE_NAMES.transactions,
        component: () =>
          import(
            /* webpackChunkName: "transactions" */ '../views/TransactionsView.vue'
          ),
      },
      {
        path: '/transactions/:hash',
        name: ROUTE_NAMES.transactionDetails,
        component: () =>
          import(
            /* webpackChunkName: "transactions" */ '../views/TransactionsItem.vue'
          ),
      },
      {
        path: '/validators',
        name: ROUTE_NAMES.validators,
        component: () =>
          import(
            /* webpackChunkName: "validators" */ '../views/ValidatorsView.vue'
          ),
      },
      {
        path: '/validators/:address',
        name: ROUTE_NAMES.validatorDetails,
        component: () =>
          import(
            /* webpackChunkName: "validators" */ '../views/ValidatorItem.vue'
          ),
      },
      {
        path: '/accounts',
        name: ROUTE_NAMES.accounts,
        component: () =>
          import(/* webpackChunkName: "accounts" */ '../views/TopAccounts.vue'),
      },
      {
        path: '/accounts/:hash',
        name: ROUTE_NAMES.accountDetails,
        component: () =>
          import(
            /* webpackChunkName: "accounts" */ '../views/AccountsItem.vue'
          ),
      },
      {
        path: '/charts',
        name: ROUTE_NAMES.charts,
        redirect: { name: ROUTE_NAMES.chartsStats },
        component: () =>
          import(/* webpackChunkName: "charts" */ '../views/ChartPage.vue'),
        children: [
          {
            path: '',
            name: ROUTE_NAMES.chartsStats,
            component: () =>
              import(
                /* webpackChunkName: "charts" */ '../views/ChartsStats.vue'
              ),
          },
          {
            path: 'validators',
            name: ROUTE_NAMES.blockValidatorsChart,
            component: () =>
              import(
                /* webpackChunkName: "charts" */ '../views/BlockValidatorsChart.vue'
              ),
          },
          {
            path: 'average-odin-block-size',
            name: ROUTE_NAMES.averageOdinBlockSizeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
            props: chartPagesProps.averageOdinBlockSizeChart,
          },
          {
            path: 'average-block-time',
            name: ROUTE_NAMES.averageBlockTimeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
            props: chartPagesProps.averageBlockTimeChart,
          },
          {
            path: 'daily-transactions-volume',
            name: ROUTE_NAMES.dailyTransactionsVolumeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
            props: chartPagesProps.dailyTransactionsVolumeChart,
          },
          {
            path: 'average-transactions-fee',
            name: ROUTE_NAMES.averageTransactionFeeChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
            props: chartPagesProps.averageTransactionFeeChart,
          },
          {
            path: 'total-requests',
            name: ROUTE_NAMES.totalRequestsChart,
            component: () =>
              import(/* webpackChunkName: "charts" */ '../views/ChartView.vue'),
            props: chartPagesProps.averageRequestsChart,
          },
        ],
      },
      {
        path: '/ibc',
        name: ROUTE_NAMES.ibc,
        component: () =>
          import(/* webpackChunkName: "ibc" */ '../views/IbcView.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
