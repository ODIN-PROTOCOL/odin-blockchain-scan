<template>
  <div
    class="app__main-view validators-view load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">All Validators</h2>
    </div>

    <template v-if="validatorsCount">
      <div class="validators-view__count-info">
        <p>{{ validatorsCount }} validators found</p>
      </div>
    </template>

    <AppTabs @changeTab="tabHandler($event)">
      <AppTab title="Active" />
      <AppTab title="Inactive" />
    </AppTabs>

    <div class="app-table">
      <div class="app-table__head validators-view__table-head">
        <span class="validators-view__table-head-item">Rank</span>
        <span class="validators-view__table-head-item">Validator</span>
        <span class="validators-view__table-head-item"> Delegator Share </span>
        <span
          class="validators-view__table-head-item validators-view__table-head-item--center"
        >
          Commission
        </span>
        <span
          class="validators-view__table-head-item validators-view__table-head-item--center"
        >
          Oracle Status
        </span>
        <span class="validators-view__table-head-item"> Uptime </span>
      </div>
      <div>
        <template v-if="validators?.length">
          <div
            v-for="item in filteredValidators"
            :key="item.operatorAddress"
            class="app-table__row validators-view__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Rank</span>
              <span>{{ item.rank }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Validator</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.description.moniker"
                :to="`/validators/${item.operatorAddress}`"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Delegator Share</span>
              <span :title="$convertLokiToOdin(item.delegatorShares)">
                {{
                  $convertLokiToOdin(item.delegatorShares, {
                    withDenom: true,
                    withPrecise: true,
                  })
                }}
              </span>
            </div>
            <div class="app-table__cell validators-view__table-cell--center">
              <span class="app-table__title">Commission</span>
              <span>
                {{ $getPrecisePercents(item.commission.commissionRates.rate) }}
              </span>
            </div>
            <div class="app-table__cell validators-view__table-cell--center">
              <span class="app-table__title">Oracle Status</span>
              <StatusIcon :status="item.isActive ? 'success' : 'error'" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Uptime</span>
              <ProgressbarTool
                v-if="item.uptimeInfo.uptime"
                :min="0"
                :max="100"
                :current="Number(item.uptimeInfo.uptime) || 0"
                :forValidators="true"
              />
              <span v-else>N/A</span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p v-if="isLoading" class="empty mg-t32">Loading…</p>
            <p v-else class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="filteredValidatorsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { handleError } from '@/helpers/errors'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import TitledLink from '@/components/TitledLink.vue'
import StatusIcon from '@/components/StatusIcon.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import {
  getTransformedValidators,
  isActiveValidator,
} from '@/helpers/validatorsHelpers'
import ProgressbarTool from '@/components/ProgressbarTool.vue'

export default defineComponent({
  name: 'ValidatorsView',
  components: {
    AppTabs,
    AppTab,
    TitledLink,
    StatusIcon,
    AppPagination,
    ProgressbarTool,
  },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
    const validatorsStatus = ref('Active')
    const filteredValidatorsCount = ref(0)
    const validatorsCount = ref(0)
    const filteredValidators = ref()
    const validators = ref()

    let activeValidators: ValidatorDecoded[] = []
    let inactiveValidators: ValidatorDecoded[] = []

    const getValidators = async () => {
      lockLoading()
      try {
        const bonded = await callers.getValidators('BOND_STATUS_BONDED')
        const unbonding = await callers.getValidators('BOND_STATUS_UNBONDING')
        const unbonded = await callers.getValidators('BOND_STATUS_UNBONDED')
        const allUptime = await callers
          .getValidatorUptime()
          .then((resp) => resp.json())
        activeValidators = await Promise.all(
          await getTransformedValidators([
            ...bonded.validators,
            ...unbonding.validators,
          ]).then((validators) =>
            validators.map(async (item) => {
              return {
                ...item,
                isActive: await isActiveValidator(item.operatorAddress),
                uptimeInfo: allUptime.find(
                  (name: { operator_address: string }) =>
                    name.operator_address === item.operatorAddress
                ),
              }
            })
          )
        )
        inactiveValidators = await Promise.all(
          await getTransformedValidators([...unbonded.validators]).then(
            (validators) =>
              validators.map(async (item) => {
                return {
                  ...item,
                  isActive: await isActiveValidator(item.operatorAddress),
                  uptimeInfo: allUptime.find(
                    (name: { operator_address: string }) =>
                      name.operator_address === item.operatorAddress
                  ),
                }
              })
          )
        )

        if (validatorsStatus.value === 'Active') {
          validators.value = [...activeValidators]
        } else if (validatorsStatus.value === 'Inactive') {
          validators.value = [...inactiveValidators]
        }

        validatorsCount.value =
          activeValidators.length + inactiveValidators.length
        filteredValidatorsCount.value = validators.value.length
        totalPages.value = Math.ceil(
          filteredValidatorsCount.value / ITEMS_PER_PAGE
        )
        filterValidators(currentPage.value)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const filterValidators = (newPage: number) => {
      let tempArr = validators.value

      if (newPage === 1) {
        filteredValidators.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredValidators.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterValidators(num)
    }

    const tabHandler = async (title: string) => {
      console.debug('tabHandler', title)
      if (title !== validatorsStatus.value) {
        validatorsStatus.value = title

        if (validatorsStatus.value === 'Active') {
          validators.value = [...activeValidators]
        } else if (validatorsStatus.value === 'Inactive') {
          validators.value = [...inactiveValidators]
        }

        filteredValidatorsCount.value = validators.value.length
        totalPages.value = Math.ceil(
          filteredValidatorsCount.value / ITEMS_PER_PAGE
        )
        currentPage.value = 1
        filterValidators(currentPage.value)
      }
    }

    onMounted(async () => {
      await getValidators()
    })

    return {
      ITEMS_PER_PAGE,
      currentPage,
      totalPages,
      filteredValidatorsCount,
      validatorsCount,
      filteredValidators,
      validators,
      isLoading,
      getValidators,
      paginationHandler,
      tabHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.validators-view__count-info {
  margin-bottom: 3.2rem;
}

.validators-view__table-cell--center {
  justify-content: center;
}
.validators-view__table-cell--end {
  justify-content: flex-end;
}

.validators-view__table-head-item--center {
  text-align: center;
}
.validators-view__table-head-item--end {
  text-align: end;
}

.validators-view__table-head,
.validators-view__table-row {
  gap: 3.2rem;
  grid:
    auto /
    minmax(2rem, 5rem)
    minmax(5rem, 2fr)
    minmax(11rem, 1fr)
    minmax(8rem, 1fr)
    minmax(10rem, 1fr)
    minmax(6rem, 2fr);
}

@include respond-to(tablet) {
  .validators-view__count-info {
    margin-bottom: 0;
  }

  .validators-view__table-cell--center {
    justify-content: flex-start;
  }
  .validators-view__table-cell--end {
    justify-content: flex-start;
  }

  .validators-view__table-row {
    grid: none;
  }
}
</style>
