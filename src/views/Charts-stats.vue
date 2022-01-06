<template>
  <div class="container">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Charts & Stats</h2>
    </div>
    <div class="view-main__charts-section mg-b40">
      <!-- TODO unhide when market data chart will be ready -->
      <!-- <div class="view-main__charts-wrapper">
        <h3 class="view-main__charts-title mg-b24">Market Data</h3>
        <div class="view-main__charts-item">
          <img
            :src="require('/src/assets/imgs/marketBarChart.png')"
            alt="chart"
          />
          <span class="view-main__charts-item-title">
            Total Supply & Market Cap Chart
          </span>
        </div>
      </div> -->

      <div class="view-main__charts-wrapper">
        <h3 class="view-main__charts-title mg-b24">Statistics</h3>
        <div
          class="view-main__charts-item"
          @click="redirectToChartPage('validators')"
        >
          <img
            :src="require('/src/assets/imgs/doughnutChart.png')"
            alt="chart"
          />
          <span class="view-main__charts-item-title">
            Block Validators Chart
          </span>
        </div>
      </div>
    </div>

    <div class="view-main__charts-section">
      <div class="view-main__charts-wrapper">
        <h3 class="view-main__charts-title mg-b24">Blockchain Data</h3>
        <table class="view-main__charts-table">
          <tbody>
            <tr v-for="(chartRow, idx) in blockchainData" :key="idx">
              <td v-for="item in chartRow" :key="item.title">
                <div
                  class="view-main__charts-item"
                  @click="redirectToChartPage(item.chartPageUrl)"
                >
                  <img
                    :src="
                      require(`/src/assets/imgs/${item.chartType}Chart.png`)
                    "
                    alt="chart"
                  />
                  <span class="view-main__charts-item-title">
                    {{ item.title }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  name: 'chart-stats',
  setup() {
    const router: Router = useRouter()
    const blockchainData = [
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
      ],
    ]

    const redirectToChartPage = (url: string) => {
      router.push({
        path: `/charts-stats/charts/${url}`,
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
.view-main {
  &__charts-section {
    display: flex;
    gap: 2.4rem;

    & > * {
      flex: 1;
    }
  }

  &__charts-wrapper {
    display: flex;
    flex-direction: column;
    padding: 3.2rem 2.4rem;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.8rem;
  }

  &__charts-title {
    font-size: 2.4rem;
    font-weight: 400;
    line-height: 3.2rem;
  }

  &__charts-table {
    width: 100%;
    border-collapse: collapse;
    border-style: hidden;

    td {
      width: 33.3333%;
      border: 1px solid var(--clr__table-border);
    }
  }

  &__charts-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    flex-grow: 1;
    padding: 3.3rem;
    cursor: pointer;

    &:hover {
      background-color: #ecf5ff;
    }
  }

  &__charts-item-title {
    font-weight: 600;
    margin-top: 2.4rem;
    text-align: center;
  }
}

@include respond-to(768px) {
  .view-main {
    &__charts-section {
      flex-direction: column;
    }

    &__charts-table {
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
        border-bottom: 0.1rem solid var(--clr__table-border);
      }
    }
  }
}
</style>
