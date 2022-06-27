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
            :placeholder="inputPlaceholder"
            class="validators-view__filter-search-input"
            v-model="searchValue"
            @keydown.enter="filterValidators()"
          />
          <template v-if="searchValue">
            <button @click="clearText()" class="search-bar__clear">
              <CancelIcon
                :className="'validators-view__filter-search__cancel-button'"
              />
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

    <div
      class="app-table"
      :class="{
        'validators-view__table--inactive':
          tabStatus === inactiveValidatorsTitle,
      }"
    >
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
          v-if="tabStatus !== inactiveValidatorsTitle"
          class="validators-view__table-head-item"
        >
          Uptime
        </span>
        <span
          class="validators-view__table-head-item validators-view__table-head-item--center"
        >
          Status
        </span>
      </div>
      <div>
        <template v-if="filteredValidators?.length">
          <template v-if="windowInnerWidth > 768">
            <ValidatorsTable
              v-for="validator in filteredValidators"
              :key="validator.operatorAddress"
              :validator="validator"
              :tabStatus="tabStatus"
              :inactiveValidatorsTitle="inactiveValidatorsTitle"
            />
          </template>
          <template v-else>
            <ValidatorsTableMobile
              v-for="validator in filteredValidators"
              :key="validator.operatorAddress"
              :validator="validator"
              :tabStatus="tabStatus"
              :inactiveValidatorsTitle="inactiveValidatorsTitle"
            />
          </template>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="validators-view-table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
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
import { defineComponent, ref, onMounted, computed, onUnmounted } from 'vue'
import { callers } from '@/api/callers'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { ValidatorDecoded } from '@/helpers/validatorDecoders'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import {
  getTransformedValidators,
  isActiveValidator,
} from '@/helpers/validatorsHelpers'
import InputField from '@/components/fields/InputField.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import CancelIcon from '@/components/icons/CancelIcon.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import ValidatorsTableMobile from '@/components/ValidatorsTableRowMobile.vue'
import ValidatorsTable from '@/components/ValidatorsTableRow.vue'

export default defineComponent({
  name: 'ValidatorsView',
  components: {
    AppTabs,
    AppTab,
    AppPagination,
    InputField,
    SearchIcon,
    CancelIcon,
    SkeletonTable,
    ValidatorsTableMobile,
    ValidatorsTable,
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
    const searchValue = ref('')
    const inputPlaceholder = ref('Search validators')

    const headerTitles = computed(() => {
      if (windowInnerWidth.value > 768) {
        return [
          { title: 'Rank' },
          { title: 'Validator' },
          { title: 'Delegated' },
          { title: 'Commission' },
          { title: 'Uptime' },
          { title: 'Oracle Status' },
        ]
      } else {
        return [{ title: '' }, { title: 'Delegated' }]
      }
    })
    const windowInnerWidth = ref(document.documentElement.clientWidth)
    const updateWidth = () => {
      windowInnerWidth.value = document.documentElement.clientWidth
    }
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
      searchValue.value = ''
    }

    const validatorStatus = (validator: {
      status: number
      isActive: boolean
    }) => {
      if (validator.status === 3) {
        return validator.isActive ? 'success' : 'error'
      } else {
        return 'inactive'
      }
    }
    onMounted(async () => {
      window.addEventListener('resize', updateWidth)
      await getValidators()
    })
    onUnmounted(async () => {
      window.removeEventListener('resize', updateWidth)
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
      headerTitles,
      tabStatus,
      validatorStatus,
      windowInnerWidth,
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

.validators-view__filter-search {
  display: flex;
  align-items: center;
  border-bottom: 0.1rem solid var(--clr__input-border);
  transition: all 0.5s ease;
  color: var(--clr__input-border);
  svg {
    transition: all 0.5s ease;
    fill: var(--clr__text-muted);
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
  svg.validators-view__filter-search__cancel-button {
    fill: var(--clr__text-muted);
  }
}
.validators-view__filter-search-input-wrapper {
  position: relative;
  z-index: 0;
}
.validators-view__filter-search-input {
  border: none;
  padding-right: 2rem;
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

.search-bar__clear {
  overflow: visible;
  position: absolute;
  right: 0rem;
  top: 1.3rem;
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
