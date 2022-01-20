<template>
  <div
    class="app__main-view validators load-fog"
    :class="{ 'load-fog_show': isLoading && validators?.length }"
  >
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">All Validators</h2>
    </div>

    <template v-if="validatorsCount">
      <div class="validators__count-info">
        <p>{{ validatorsCount }} validators found</p>
      </div>
    </template>

    <Tabs @changeTab="tabHandler($event)">
      <Tab title="Active" />
      <Tab title="Inactive" />
    </Tabs>

    <div class="app-table">
      <div class="app-table__head">
        <span>Rank</span>
        <span>Validator</span>
        <span>Delegator Share</span>
        <span>Commission</span>
        <span>Oracle Status</span>
      </div>
      <div>
        <template v-if="validators?.length">
          <div
            v-for="item in filteredValidators"
            :key="item.operatorAddress"
            class="app-table__row"
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
              <span>{{ $preciseAsPercents(item.delegatorShares) }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Commission</span>
              <span>
                {{ $preciseAsPercents(item.commission.commissionRates.rate) }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Status</span>
              <StatusIcon
                :status="item.isOracleValidator ? 'success' : 'error'"
              />
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
      <Pagination
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
import Tabs from '@/components/tabs/Tabs.vue'
import Tab from '@/components/tabs/Tab.vue'
import TitledLink from '@/components/TitledLink.vue'
import StatusIcon from '@/components/StatusIcon.vue'
import Pagination from '@/components/Pagination/Pagination.vue'
import { getTransformedValidators } from '@/helpers/validatorsHelpers'

export default defineComponent({
  name: 'Validators',
  components: { Tabs, Tab, TitledLink, StatusIcon, Pagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 6
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

        activeValidators = await getTransformedValidators([
          ...bonded.validators,
          ...unbonding.validators,
        ])
        inactiveValidators = await getTransformedValidators([
          ...unbonded.validators,
        ])

        if (validatorsStatus.value === 'Active') {
          validators.value = [...activeValidators]
        } else if (validatorsStatus.value === 'Inactive') {
          validators.value = [...inactiveValidators]
        }

        validatorsCount.value =
          activeValidators.length + inactiveValidators.length
        filteredValidatorsCount.value = validators.value.length
        totalPages.value = Math.ceil(validatorsCount.value / ITEMS_PER_PAGE)
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
.validators__count-info {
  margin-bottom: 3.2rem;
}

.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(3rem, 1fr)
    minmax(8rem, 4fr)
    minmax(8rem, 4fr)
    minmax(8rem, 4fr)
    minmax(8rem, 4fr);
}

@include respond-to(tablet) {
  .app-table__row {
    grid: none;
  }

  .validators__count-info {
    margin-bottom: 0;
  }
}
</style>
