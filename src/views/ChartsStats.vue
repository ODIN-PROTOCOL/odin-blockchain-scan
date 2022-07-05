<template>
  <div class="app__main-view charts-stats">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Charts & Stats</h2>
    </div>
    <div class="charts-stats__charts-section mg-b40">
      <!-- TODO unhide when market data chart will be ready -->
      <!-- <div class="charts-stats__charts-wrapper">
        <h3 class="charts-stats__charts-title mg-b24">Market Data</h3>
        <div class="charts-stats__charts-item">
          <img
            :src="require('/src/assets/imgs/marketBarChart.png')"
            alt="chart"
          />
          <span class="charts-stats__charts-item-title">
            Total Supply & Market Cap Chart
          </span>
        </div>
      </div> -->

      <div class="charts-stats__charts-wrapper">
        <h3 class="charts-stats__charts-title mg-b24">Statistics</h3>
        <router-link class="charts-stats__charts-item" to="/charts/validators">
          <img
            :src="require('/src/assets/imgs/doughnutChart.png')"
            alt="chart"
          />
          <span class="charts-stats__charts-item-title">
            Block Validators Chart
          </span>
        </router-link>
      </div>
    </div>
    <div class="charts-stats__charts-section">
      <div class="charts-stats__charts-wrapper">
        <h3 class="charts-stats__charts-title mg-b24">Blockchain Data</h3>
        <table class="charts-stats__charts-table">
          <tbody>
            <tr v-for="(chartRow, idx) in blockchainData" :key="idx">
              <td v-for="item in chartRow" :key="item.title">
                <router-link
                  class="charts-stats__charts-item"
                  :to="{ path: `/charts/${item.chartPageUrl}` }"
                >
                  <img
                    :src="
                      require(`/src/assets/imgs/${item.chartType}Chart.png`)
                    "
                    alt="chart"
                  />
                  <span class="charts-stats__charts-item-title">
                    {{ item.title }}
                  </span>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { blockchainData } from '@/helpers/customChartHelpers'
</script>

<style lang="scss" scoped>
.charts-stats__charts-section {
  display: flex;
  gap: 2.4rem;
  & > * {
    flex: 1;
  }
}

.charts-stats__charts-wrapper {
  display: flex;
  flex-direction: column;
  padding: 3.2rem 2.4rem;
  border: 0.1rem solid var(--clr__action);
  border-radius: 0.8rem;
}

.charts-stats__charts-title {
  font-size: 2.4rem;
  font-weight: 400;
  line-height: 3.2rem;
}

.charts-stats__charts-table {
  width: 100%;
  border-collapse: collapse;
  border-style: hidden;

  td {
    width: 33.3333%;
    border: 0.1rem solid var(--clr__table-border);
  }
}

.charts-stats__charts-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  flex-grow: 1;
  padding: 3.3rem;
  cursor: pointer;
  color: var(--clr__text);
  text-decoration: none;
  &:hover {
    background-color: var(--clr__table-row-hover);
  }
}

.charts-stats__charts-item-title {
  font-weight: 600;
  margin-top: 2.4rem;
  text-align: center;
}

@include respond-to(tablet) {
  .charts-stats__charts-section {
    flex-direction: column;
  }

  .charts-stats__charts-table {
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
</style>
