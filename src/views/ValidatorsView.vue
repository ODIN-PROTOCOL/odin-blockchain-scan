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
        <span
          class="validators-view__table-head-item validators-view__table-head-item_end"
        >
          Delegator Share
        </span>
        <span
          class="validators-view__table-head-item validators-view__table-head-item_end"
        >
          Commission
        </span>
        <span
          class="validators-view__table-head-item validators-view__table-head-item_center"
        >
          Oracle Status
        </span>
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
            <div class="app-table__cell validators-view__table-cell_end">
              <span class="app-table__title">Delegator Share</span>
              <span>
                {{
                  $convertLokiToOdin(item.delegatorShares, {
                    withDenom: true,
                    withPrecise: true,
                  })
                }}
              </span>
            </div>
            <div class="app-table__cell validators-view__table-cell_end">
              <span class="app-table__title">Commission</span>
              <span>
                {{ $getPrecisePercents(item.commission.commissionRates.rate) }}
              </span>
            </div>
            <div class="app-table__cell validators-view__table-cell_center">
              <span class="app-table__title">Oracle Status</span>
              <StatusIcon :status="item.isActive ? 'success' : 'error'" />
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

export default defineComponent({
  name: 'ValidatorsView',
  components: { AppTabs, AppTab, TitledLink, StatusIcon, AppPagination },
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

        activeValidators = await Promise.all(
          await getTransformedValidators([
            ...bonded.validators,
            ...unbonding.validators,
          ]).then((validators) =>
            validators.map(async (item) => {
              return {
                ...item,
                isActive: await isActiveValidator(item.operatorAddress),
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
.validators-view {
  &__count-info {
    margin-bottom: 3.2rem;
  }

  &__table-cell {
    &_center {
      justify-content: center;
    }
    &_end {
      justify-content: flex-end;
    }
  }

  &__table-head-item {
    &_center {
      text-align: center;
    }
    &_end {
      text-align: end;
    }
  }

  &__table-head,
  &__table-row {
    grid:
      auto /
      minmax(3rem, 1fr)
      minmax(8rem, 4fr)
      minmax(8rem, 4fr)
      minmax(8rem, 4fr)
      minmax(8rem, 4fr);
  }
}

@include respond-to(tablet) {
  .validators-view {
    &__count-info {
      margin-bottom: 0;
    }

    &__table-cell {
      &_center {
        justify-content: flex-start;
      }
      &_end {
        justify-content: flex-start;
      }
    }

    &__table-row {
      grid: none;
    }
  }
}
</style>
