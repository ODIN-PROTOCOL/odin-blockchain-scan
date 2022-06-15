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
    <div class="validators-view__filter">
      <AppTabs @changeTab="tabHandler($event)">
        <AppTab :title="activeValidatorsTitle" />
        <AppTab :title="inactiveValidatorsTitle" />
      </AppTabs>
      <div class="validators-view__filter-search">
        <div class="validators-view__filter-search-input-wrapper">
          <InputField
            v-model="searchValue"
            :placeholder="inputPlaceholder"
            class="validators-view__filter-search-input"
            @keydown.enter="filterValidators()"
          />
          <template v-if="searchValue">
            <button @click="clearText" class="search-bar__clear">
              <img src="~@/assets/icons/close.svg" alt="reset" />
            </button>
          </template>
        </div>
        <button
          class="validators-view__filter-search-button"
          @click="filterValidators()"
        >
          <SearchIcon />
        </button>
      </div>
    </div>

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
        <template v-if="filteredValidators?.length">
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
                v-if="item?.uptimeInfo?.uptime"
                :min="0"
                :max="100"
                :current="Number(item.uptimeInfo.uptime) || 0"
                :isForValidators="true"
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
import { defineComponent, ref, onMounted, computed } from 'vue'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
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
import InputField from '@/components/fields/InputField.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

export default defineComponent({
  name: 'ValidatorsView',
  components: {
    AppTabs,
    AppTab,
    TitledLink,
    StatusIcon,
    AppPagination,
    ProgressbarTool,
    InputField,
    SearchIcon,
  },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
    const currentPage = ref(1)
    const totalPages = ref()
    const filteredValidatorsCount = ref(0)
    const validatorsCount = ref(0)
    const filteredValidators = ref()
    const validators = ref()
    const activeValidators = ref<ValidatorDecoded[]>([])
    const inactiveValidators = ref<ValidatorDecoded[]>([])
    const activeValidatorsTitle = computed(() =>
      activeValidators.value?.length
        ? `Active (${activeValidators.value?.length})`
        : 'Active'
    )
    const inactiveValidatorsTitle = ref('Inactive')
    const tabStatus = ref(activeValidatorsTitle.value)
    const searchValue = ref<string | null>('')
    const inputPlaceholder = ref('Search validators')

    const getValidators = async () => {
      lockLoading()
      try {
        const bonded = await callers.getValidators('BOND_STATUS_BONDED')
        const unbonding = await callers.getValidators('BOND_STATUS_UNBONDING')
        const unbonded = await callers.getValidators('BOND_STATUS_UNBONDED')
        const allUptime = await callers
          .getValidatorUptime()
          .then((resp) => resp.json())
        activeValidators.value = await Promise.all(
          await getTransformedValidators([...bonded.validators]).then(
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

        inactiveValidators.value = await Promise.all(
          await getTransformedValidators([
            ...unbonded.validators,
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
        validators.value = [...activeValidators.value]
        validatorsCount.value =
          activeValidators.value.length + inactiveValidators.value.length
        filterValidators(currentPage.value)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const filterValidators = (newPage = 1) => {
      if (searchValue.value === '') return (searchValue.value = null)
      let tempArr = validators.value

      if (searchValue.value.trim()) {
        tempArr = tempArr.filter((item: { description: { moniker: string } }) =>
          item.description.moniker
            .toLowerCase()
            .includes(searchValue.value.toLowerCase())
        )
      }
      if (newPage === 1) {
        filteredValidators.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredValidators.value = tempArr?.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      filteredValidatorsCount.value = tempArr.length
      totalPages.value = Math.ceil(
        filteredValidatorsCount.value / ITEMS_PER_PAGE
      )
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterValidators(num)
    }

    const tabHandler = async (title: string) => {
      if (title !== tabStatus.value) {
        tabStatus.value = title
        if (tabStatus.value === activeValidatorsTitle.value) {
          validators.value = [...activeValidators.value]
        } else if (tabStatus.value === inactiveValidatorsTitle.value) {
          validators.value = [...inactiveValidators.value]
        }
        filterValidators(1)
      }
    }

    const clearText = (): void => {
      searchValue.value = null
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
      activeValidatorsTitle,
      inactiveValidatorsTitle,
      searchValue,
      filterValidators,
      clearText,
      inputPlaceholder,
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
.validators-view__filter-search {
  display: flex;
  align-items: center;
  border-bottom: 0.1rem solid var(--clr__input-border);
  transition: all 0.5s ease;
  color: var(--clr__input-border);
  svg {
    transition: all 0.5s ease;
    fill: var(--clr__input-border);
  }
  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    color: var(--clr__text);
    border-color: var(--clr__text);
    svg {
      fill: var(--clr__text);
    }
  }
  &:disabled {
    border-color: var(--clr__input-border);
    color: var(--clr__input-border);
    svg {
      fill: var(--clr__input-border);
    }
  }
}
.validators-view__filter-search-input-wrapper {
  position: relative;
  z-index: 0;
}
.validators-view__filter-search-input {
  border: none;
  &:focus::-webkit-input-placeholder {
    color: transparent;
  }
  &::-webkit-search-cancel-button {
    position: relative;
    right: 0.2rem;
  }
  &:active,
  &:hover,
  &:focus {
    border: none;
  }
}
.validators-view__filter-search-button {
  position: relative;
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.validators-view__filter {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2.4rem;
  align-items: center;
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
  .validators-view__filter {
    margin-bottom: 0;
    flex-direction: column;
    align-items: stretch;
  }
  .validators-view__filter-search {
    margin-bottom: 1.6rem;
  }
  .validators-view__filter-search-input-wrapper {
    width: 100%;
  }
  .validators-view__filter-search-input {
    width: 100%;
  }
}
</style>
