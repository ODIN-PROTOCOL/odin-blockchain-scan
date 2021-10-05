<template>
  <div>
    <div class="title">
      <BackButton :current-router="router" />
      <h1 class="title-name">Daily Transactions Volume Chart</h1>
    </div>
    <div class="sort-wrapper">
      <VuePicker
        class="app-form__field-input app-filter app-filter--coin"
        name="filter"
        v-model="sortingValue"
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
    <transition name="fade" mode="out-in">
      <template v-if="!isLoading">
        <div class="content"></div>
      </template>
      <span class="empty" v-else>
        <span id="loading" class="empty-loading"></span>
        Wait data preparation
      </span>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  RouteLocationNormalizedLoaded,
  Router,
  useRoute,
  useRouter,
} from 'vue-router'
import { ChartDataType } from '@/helpers/Types'
import { Pagination } from '@/api/query-ext/telemetryExtension'
import { callers } from '@/api/callers'
import { ValidatorBlockStats } from '@provider/codec/telemetry/telemetry'
import { DONUT_COLORS } from '@/helpers/ChartColors'
import { withoutDuplicates, testAAAAAAAAA } from '@/helpers/helpers'
import BackButton from '@/components/BackButton.vue'

export default defineComponent({
  name: 'ValidatorChart',
  components: { BackButton },
  setup: function () {
    const router: Router = useRouter()
    const route: RouteLocationNormalizedLoaded = useRoute()
    const pagination: Pagination = new Pagination(0, 1000, true, true)
    const isLoading = ref<boolean>(false)
    const sortingValue = ref<string>('1')
    const sortingDays: Array<{ text: string; value: string }> = [
      {
        text: 'Last year',
        value: '1',
      },
      {
        text: 'Last mounth',
        value: '1',
      },
      {
        text: 'Last week',
        value: '1',
      },
      {
        text: 'Last day',
        value: '1',
      },
    ]
    const chartData = ref<ChartDataType>({
      labels: [],
      datasets: [
        {
          backgroundColor: DONUT_COLORS,
          borderColor: DONUT_COLORS,
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

    const getDataByDays = async (
      days: number
    ): Promise<Array<ValidatorBlockStats> | void> => {
      const endDate = new Date()
      const startDate = new Date()

      return withoutDuplicates(
        await testAAAAAAAAA({ startDate, endDate }, callers.getTxVolume, days)
      ) as Array<ValidatorBlockStats>
    }

    watch(
      sortingValue,
      async (): Promise<void> => await getChartData(Number(sortingValue.value))
    )

    const getChartData = async (_sortingValue: number): Promise<void> => {
      isLoading.value = true
      console.log(await getDataByDays(_sortingValue))
      isLoading.value = false
    }

    onMounted(async (): Promise<void> => {
      await getChartData(Number(sortingValue.value))
    })

    return {
      router,
      route,
      chartData,
      sortingDays,
      sortingValue,
      isLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

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
