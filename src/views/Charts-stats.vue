<template>
  <div class="container">
    <div class="mg-b32 mg-t32">
      <h2 class="view-title">Charts & Stats</h2>
    </div>
    <div class="charts-section">
      <h3 class="charts-section__title mg-b24">Blockchain Data</h3>
      <table class="charts-section__table">
        <tbody>
          <tr v-for="(chartRow, idx) in blockchainData" :key="idx">
            <td v-for="item in chartRow" :key="item.title">
              <div
                class="table-cell"
                @click="redirectToChartPage(item.chartPageUrl)"
              >
                <img
                  :src="require(`/src/assets/imgs/${item.chartType}Chart.png`)"
                  alt="chart"
                />
                <span class="table-cell__title">
                  {{ item.title }}
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>  
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  name: 'Chart-stats',
  setup() {
    const router: Router = useRouter()
    const blockchainData = [
      [
        {
          title: 'Average ODIN Block Size Chart',
          chartType: 'bar',
          chartPageUrl: 'average-odin-block-size'
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
      ],
    ]

    const redirectToChartPage = (url: string) => {
      router.push({
        path: `/charts-stats/charts/${url}`
      })
    }

    return {
      blockchainData,
      redirectToChartPage,
    }
  },
})
</script>

<style lang="scss" scoped>
.charts-section {
  padding: 3.2rem 2.4rem;
  border: 1px solid var(--clr__action);
  border-radius: 0.8rem;

  &__title {
    font-size: 2.4rem;
    font-weight: 400;
    line-height: 3.2rem;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    border-style: hidden;

    td {
      width: 33.3333%;
      border: 1px solid var(--clr__table-border);
      cursor: pointer;

      &:hover {
        // background-color: var(--clr__table-row-hover);
        background-color: #ecf5ff;
      }
    }

    .table-cell {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      height: 100%;
      padding: 3.3rem;

      &__title {
        font-weight: 600;
        margin-top: 2.4rem;
        text-align: center;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .charts-section__table {
    tr {
      display: flex;
      flex-direction: column;

      &:last-child {
        td:last-child {
          border-bottom: none;
        }
      }
    }

    td {
      width: 100%;
      border: none;
      border-bottom: 1px solid var(--clr__table-border);
    }
  }
}
</style>
