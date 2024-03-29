<template>
  <div class="app__main-view block-validators-chart">
    <div class="app__main-view-title-wrapper">
      <BackButton :text="'Charts & Stats'" />
      <h2 class="app__main-view-title block-validators-chart__title">
        Block Validators Chart
      </h2>
    </div>
    <template v-if="!isLoading">
      <template v-if="isLoadingError">
        <ui-loading-error-message message="Not Found" title="404" />
      </template>
      <template v-else>
        <template v-if="chartData?.data?.length && validators.length">
          <CustomDoughnutChart
            class="mg-b40"
            :type="DoughnutChartType.EXTENDED"
            :chart-dataset="chartData"
            :additional-info="additionalData"
          />
          <div class="app-table">
            <div class="app-table__head block-validators-chart__head">
              <span>Rank</span>
              <span>Address</span>
              <span>Blocks</span>
              <span>Stake percentage</span>
            </div>

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
                    :name="{
                      name: $routes.validatorDetails,
                      params: { address: item.validatorAddress },
                    }"
                    :text="item.validatorAddress"
                    class="app-table-cell-txt app-table__link"
                  />
                </div>
                <div class="app-table__cell">
                  <span class="app-table__title">Blocks</span>
                  <span>{{ item.blocksCount }}</span>
                </div>
                <div class="app-table__cell">
                  <span class="app-table__title">Stake percentage</span>
                  <span>{{ item.stakePercentage }} %</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <ui-no-data-message-with-img
              message="Insufficient data to visualize"
            />
          </div>
        </template>
      </template>
    </template>
    <template v-else>
      <div class="app-table__empty-stub">
        <ui-loader positionCenter message="Loading" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { DoughnutChartType } from '@/helpers/customChartHelpers'
import { ExtendedDoughnutChartAdditionalInfo } from '@/helpers/Types'
import { ValidatorBlockStats } from '@provider/codec/telemetry/telemetry'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import {
  UiLoadingErrorMessage,
  UiLoader,
  UiNoDataMessageWithImg,
} from '@/components/ui'
import BackButton from '@/components/BackButton.vue'
import TitledLink from '@/components/TitledLink.vue'
import CustomDoughnutChart from '@/components/Charts/CustomDoughnutChart.vue'

const isLoading = ref(false)
const validators = ref<ValidatorBlockStats[]>()
const chartData = ref()
const additionalData = ref<ExtendedDoughnutChartAdditionalInfo[]>()
const isLoadingError = ref(false)

const getChartData = async () => {
  isLoading.value = true
  try {
    const topValidators = await callers.getValidatorsBlock()
    validators.value = topValidators.data.map(item => {
      return {
        validatorAddress: item.operator_address,
        blocksCount: Number(item.validated_blocks),
        stakePercentage: Number(item.tokens).toFixed(2),
      }
    })
    _prepareAdditionalData(validators.value)
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  isLoading.value = false
}

const _prepareAdditionalData = (
  validatorsArr: ValidatorBlockStats[] | undefined,
) => {
  let tempDataArr: number[] = []

  additionalData.value = validatorsArr?.map((item: ValidatorBlockStats) => {
    tempDataArr.push(Number(item.stakePercentage))
    return {
      validatorAddress: item.validatorAddress,
      Blocks: Number(item.blocksCount),
      'Stake percentage': item.stakePercentage + '%',
    }
  })
  chartData.value = { data: tempDataArr }
}

onMounted(async () => {
  await getChartData()
})
</script>

<style lang="scss" scoped>
.block-validators-chart__title {
  margin: 0 1.6rem 0 2rem;
}

.block-validators-chart__sort-wrapper {
  display: flex;
  justify-content: flex-end;
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
  .block-validators-chart__title {
    margin: 0.8rem 0 0.4rem 0;
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
