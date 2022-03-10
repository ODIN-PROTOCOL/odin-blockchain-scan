<template>
  <div class="app__main-view block-validators-chart">
    <div class="app__main-view-title-wrapper">
      <BackButton :text="'Charts & Stats'" />
      <h2 class="app__main-view-title block-validators-chart__title">
        Block Validators Chart
      </h2>
    </div>

    <div class="block-validators-chart__sort-wrapper mg-b32">
      <VuePicker
        class="app-form__field-input app-filter app-filter--coin block-validators-chart__filter"
        name="filter"
        v-model="sortingValue"
        :isDisabled="isLoading"
      >
        <template #dropdownInner>
          <div class="app-filter__dropdown-inner">
            <VuePickerOption
              v-for="{ text, value } in sortingDaysForChart"
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

    <CustomDoughnutChart
      class="mg-b40"
      :type="DoughnutChartType.EXTENDED"
      :chartDataset="chartData"
      :additionalInfo="additionalData"
    />

    <div class="app-table">
      <div class="app-table__head block-validators-chart__head">
        <span>Rank</span>
        <span>Address</span>
        <span>Blocks</span>
        <span>Stake percentage</span>
      </div>
      <template v-if="validators">
        <div>
          <div
            class="app-table__row block-validators-chart__row"
            v-for="(item, idx) in validators"
            :key="item.validatorAddress"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Rank</span>
              <span>{{ idx + 1 }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Address</span>
              <TitledLink
                :to="`/validators/${item.validatorAddress}`"
                :text="item.validatorAddress"
                class="app-table-cell-txt"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Blocks</span>
              <span>{{ item.blocksCount }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Stake percentage</span>
              <span>{{ item.stakePercentage }}</span>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="app-table__empty-stub">
          <p v-if="isLoading">Loading…</p>
          <p v-else>No items yet</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue'
import { handleError } from '@/helpers/errors'
import BackButton from '@/components/BackButton.vue'
import { callers } from '@/api/callers'
import TitledLink from '@/components/TitledLink.vue'
import CustomDoughnutChart from '@/components/Charts/CustomDoughnutChart.vue'
import { DoughnutChartType } from '@/helpers/customChartHelpers'
import { ExtendedDoughnutChartAdditionalInfo } from '@/helpers/Types'
import { ValidatorBlockStats } from '@provider/codec/telemetry/telemetry'

export default defineComponent({
  name: 'ValidatorChart',
  components: {
    CustomDoughnutChart,
    BackButton,
    TitledLink,
  },
  setup: function () {
    const isLoading = ref<boolean>(false)
    const validators = ref<ValidatorBlockStats[]>()
    const sortingValue = ref<string>('1')
    const chartData = ref()
    const additionalData = ref<ExtendedDoughnutChartAdditionalInfo[]>()
    const sortingDaysForChart: Array<{ text: string; value: string }> = [
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

    const getChartData = async () => {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - Number(sortingValue.value))
      isLoading.value = true
      try {
        // TODO check the request when the telemetry is ready, data is temporarily not returned
        const { topValidators } = await callers.getValidatorsBlockStats({
          startDate,
          endDate,
        })
        validators.value = topValidators
        _prepareAdditionalData(validators.value)
      } catch (error) {
        handleError(error as Error)
      }
      isLoading.value = false
    }

    const _prepareAdditionalData = (validatorsArr: ValidatorBlockStats[]) => {
      let tempDataArr: number[] = []

      additionalData.value = validatorsArr.map((item: ValidatorBlockStats) => {
        tempDataArr.push(Number(item.blocksCount))
        return {
          validatorAddress: item.validatorAddress,
          Blocks: Number(item.blocksCount),
          'Stake percentage': item.stakePercentage,
        }
      })
      chartData.value = { data: tempDataArr }
    }

    watch(sortingValue, async (): Promise<void> => await getChartData())

    onMounted(async () => {
      await getChartData()
    })

    return {
      DoughnutChartType,
      chartData,
      additionalData,
      validators,
      sortingDaysForChart,
      sortingValue,
      isLoading,
    }
  },
})
</script>

<style lang="scss" scoped>
.block-validators-chart {
  &__title {
    margin: 0 1.6rem 0 2rem;
  }

  &__sort-wrapper {
    display: flex;
    justify-content: flex-end;
  }
}

.block-validators-chart__head,
.block-validators-chart__row {
  grid:
    auto /
    minmax(3rem, 0.5fr)
    minmax(8rem, 8fr)
    minmax(8rem, 2fr)
    minmax(8rem, 2fr);
}

@include respond-to(tablet) {
  .block-validators-chart {
    &__title {
      margin: 0.8rem 0 0.4rem 0;
    }
  }

  .block-validators-chart__row {
    grid: none;
  }

  .block-validators-chart__filter {
    width: 100%;
    padding: 0;
  }
}
</style>