<template>
  <div>
    <div class="title">
      <BackButton :current-router="router" />
      <h1 class="title-name">Block Validators Chart</h1>
    </div>
    <div class="sort-wrapper">
      <VuePicker
        class="app-form__field-input app-filter app-filter--coin"
        name="filter"
        v-model="sortingValue"
        v-on:update:modelValue="sortChartByDays"
        :isDisabled="isLoading"
      >
        <template #dropdownInner>
          <div class="app-filter__dropdown-inner">
            <VuePickerOption
              v-for="{ text, value } in sortingDays"
              :key="text"
              :value="value"
              :text="text"
            >
              {{ text }}
            </VuePickerOption>
          </div>
        </template>
      </VuePicker>
    </div>

    <button class="button" @click="getValidatorsData(1)">
      test request '1 day'
    </button>

    <template v-if="!isLoading">
      <div class="content">
        <div class="chart-block">
          <div class="chart-block__total">
            <h3>{{ totalBlocks }}</h3>
            <span>Blocks</span>
          </div>
          <div class="chart-block__wrapper">
            <DoughnutChart :chartData="chartData" />
          </div>
        </div>
        <div class="validators-table">
          <div class="app-table">
            <div class="data-sources__table-head app-table__head">
              <div class="app-table__cell">
                <span class="app-table__cell-txt">Rank</span>
              </div>
              <div class="app-table__cell">
                <span class="app-table__cell-txt">Address</span>
              </div>
              <div class="app-table__cell">
                <span class="app-table__cell-txt"> Blocks </span>
              </div>
              <div class="app-table__cell">
                <span class="app-table__cell-txt"> Stake percentage </span>
              </div>
            </div>

            <template v-for="v in topValidators" :key="v.validatorAddress">
              <div class="data-sources__table-row app-table__row">
                <div class="app-table__cell">
                  <span class="app-table__header">Rank</span>
                  {{ v.rank }}
                </div>
                <div class="app-table__cell">
                  <span class="app-table__header">Address</span>
                  <router-link :to="`/validators/${v.validatorAddress}`">
                    <TitledLink
                      class="app-table__cell-txt"
                      :text="`Ox${v.validatorAddress}`"
                    />
                  </router-link>
                </div>
                <div class="app-table__cell">
                  <span class="app-table__header">Blocks</span>
                  {{ bigMath.format(v.blocksCount) }}
                </div>
                <div class="app-table__cell">
                  <span class="app-table__header">Stake percentage</span>
                  {{ bigMath.format(v.stakePercentage) }}
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </template>
    <span class="empty" v-else> Wait data preparation </span>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { ChartDataType, topValidatorsChartDataInterface } from '@/helpers/Types'
import { Pagination } from '@/api/query-ext/telemetryExtension'
import { callers } from '@/api/callers'
import { bigMath } from '@/helpers/bigMath'
import BackButton from '@/components/BackButton.vue'
import TitledLink from '@/components/TitledLink.vue'
import DoughnutChart from '@/components/Charts/DoughnutChart.vue'
import { ValidatorBlockStats } from '@provider/codec/telemetry/telemetry'
import { DONUT_COLORS } from '@/helpers/ChartColors'

export default defineComponent({
  name: 'ValidatorChart',
  components: { DoughnutChart, BackButton, TitledLink },
  setup: function () {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const pagination: Pagination = new Pagination(0, 1000, true, true)
    const isLoading = ref<boolean>(false)
    const sortingValue = ref<string>('1')
    const sortingDays: Array<{ text: string; value: string }> = [
      {
        text: 'Last 24 hours',
        value: '1',
      },
      {
        text: 'Last 7 days',
        value: '7',
      },
      {
        text: 'Last 14 days',
        value: '14',
      },
    ]

    const totalBlocks = ref<string>('')

    const chartDataLoad = ref(false)
    const chartData = ref<ChartDataType>({
      labels: [],
      datasets: [
        {
          backgroundColor: ['#fff'],
          borderColor: ['#fff'],
          borderWidth: 2,
          hoverBorderWidth: 8,
          borderJoinStyle: 'round',
          borderCapStyle: 'round',
          tension: 0.5,
          borderSkipped: false,
          data: [],
        },
      ],
    })

    const topValidators = ref<Array<topValidatorsChartDataInterface>>()

    const addedRankBy = <T extends topValidatorsChartDataInterface>(
      arr: Array<T>,
      by: string
    ): Array<T> => {
      arr
        .sort(function (a, b) {
          return bigMath.toNum(a[by]) - bigMath.toNum(b[by])
        })
        .forEach(function (d, i) {
          d.rank = i + 1
        })
      return arr
    }

    const getDataByDays = async (
      days: number
    ): Promise<Array<ValidatorBlockStats>> => {
      const endDate = new Date()
      const startDate = new Date()

      let tempArr: Array<ValidatorBlockStats> = []
      for (let i = 0; i <= days * 24; ++i) {
        startDate.setHours(startDate.getHours() - 1)
        const { topValidators } = await callers.getTopValidators({
          startDate,
          endDate,
          pagination,
        })
        if (topValidators.length) {
          tempArr.push(...topValidators)
        }
      }
      tempArr = tempArr.filter(
        (el, index, self) =>
          index ===
          self.findIndex((t) => t.validatorAddress === el.validatorAddress)
      )
      console.debug('getDataByDays', tempArr)
      return tempArr
    }

    const sortChartByDays = async (): Promise<void> =>
      await getValidatorsData(Number(sortingValue.value))

    const getValidatorsData = async (days = 1): Promise<void> => {
      isLoading.value = true
      const TopValidators = await getDataByDays(days)
      topValidators.value = addedRankBy(TopValidators, 'blocksCount')

      const blocksCounters: Array<number> = []
      for (const v of TopValidators) {
        // ERROR: RangeError: Maximum call stack size exceeded
        // TODO: Fix this
        console.log(v)
        chartData.value.datasets[0].data.push(bigMath.toNum(v.blocksCount))
        chartData.value.labels.push({
          validatorAddress: v.validatorAddress,
          blocksCounter: bigMath.format(v.blocksCount),
          stakePercentage: v.stakePercentage,
        })
        blocksCounters.push(bigMath.toNum(v.blocksCount))
      }

      totalBlocks.value = bigMath.format(
        blocksCounters.reduce((sum, el): number => {
          return Number(sum) + Number(el)
        }, 0)
      )

      chartData.value.datasets[0].backgroundColor = DONUT_COLORS
      chartData.value.datasets[0].borderColor = DONUT_COLORS

      console.debug(topValidators.value)
      isLoading.value = false
      chartDataLoad.value = true
    }

    return {
      router,
      route,
      chartData,
      chartDataLoad,
      totalBlocks,
      topValidators,
      bigMath,
      sortingDays,
      sortingValue,
      sortChartByDays,
      isLoading,
      getValidatorsData,
    }
  },
})
</script>

<style lang="scss" scoped>
.sort-wrapper {
  justify-content: flex-end;
}

.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    repeat(4, minmax(4rem, 1fr));

  @media screen and (max-width: 99.2rem) {
    grid: repeat(4, minmax(4rem, 1fr)) / auto;
  }
}
.data-sources__table-head {
  @media (max-width: 48rem) {
    display: none;
  }
}

.app-table__cell-txt {
  max-width: 150px;
}

.app-table__header {
  display: none;
  @media screen and (max-width: 99.2rem) {
    display: inline-block;
    width: 20rem;
  }
}

.title {
  display: flex;
  align-items: center;
  gap: 2rem;
}
.chart-block {
  display: flex;
  height: 39.1rem;
  width: 100%;
  position: relative;
  margin: 10.3rem 0 7.5rem 0;
  @media (max-width: 48rem) {
    margin: 3.2rem 0 4.2rem;
  }
  &__wrapper {
    width: 100%;
    height: 100%;
  }
  &__total {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #212529;
    text-align: center;
    h3 {
      font-weight: 600;
      font-size: 2.4rem;
      line-height: 2.9rem;
    }
    span {
      margin-top: 0.4rem;
      font-size: 1.6rem;
      line-height: 2.4rem;
      font-weight: 600;
    }
  }
}
</style>
