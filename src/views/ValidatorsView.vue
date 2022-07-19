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
            placeholder="Search validator"
            class="validators-view__filter-search-input"
            @keydown.enter="filterValidators()"
          />
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
              :tab-status="tabStatus"
              :inactive-validators-title="inactiveValidatorsTitle"
            />
          </template>
          <template v-else>
            <ValidatorsTableMobile
              v-for="validator in filteredValidators"
              :key="validator.operatorAddress"
              :validator="validator"
              :tab-status="tabStatus"
              :inactive-validators-title="inactiveValidatorsTitle"
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
import {
  defineComponent,
  ref,
  onMounted,
  computed,
  onUnmounted,
  watch,
} from 'vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import AppTabs from '@/components/tabs/AppTabs.vue'
import AppTab from '@/components/tabs/AppTab.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { isActiveValidator } from '@/helpers/validatorsHelpers'
import InputField from '@/components/fields/InputField.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import ValidatorsTableMobile from '@/components/ValidatorsTableRowMobile.vue'
import ValidatorsTable from '@/components/ValidatorsTableRow.vue'
import { useQuery } from '@vue/apollo-composable'
import { ValidatorsQuery } from '@/graphql/queries'
import { ValidatorsResponse, ValidatorsInfo } from '@/graphql/types'

export default defineComponent({
  name: 'ValidatorsView',
  components: {
    AppTabs,
    AppTab,
    AppPagination,
    InputField,
    SearchIcon,
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
    const activeValidators = ref<ValidatorsInfo[]>([])
    const inactiveValidators = ref<ValidatorsInfo[]>([])
    const activeValidatorsTitle = computed(() =>
      activeValidators.value?.length
        ? `Active (${activeValidators.value?.length})`
        : 'Active'
    )
    const inactiveValidatorsTitle = ref('Inactive')
    const tabStatus = ref(activeValidatorsTitle.value)
    const searchValue = ref('')
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
    const { result, loading } = useQuery<ValidatorsResponse>(ValidatorsQuery)
    const signedBlocks = computed(() =>
      Number(result.value?.slashingParams[0]?.params?.signed_blocks_window)
    )

    watch([loading], async () => {
      await getValidators()
    })

    const getValidators = async () => {
      if (loading.value) {
        return
      }
      lockLoading()
      try {
        console.log(result.value)

        const copyActiveValidator =
          result.value?.validator?.filter(
            (item: ValidatorsInfo) => item?.validatorStatuses[0]?.status === 3
          ) || []
        const copyInactiveValidator =
          result.value?.validator?.filter(
            (item: ValidatorsInfo) => item?.validatorStatuses[0]?.status !== 3
          ) || []

        activeValidators.value = (await Promise.all(
          copyActiveValidator.map(
            async (item: ValidatorsInfo, index: number) => {
              return {
                ...item,
                rank: index + 1,
                uptime:
                  ((signedBlocks.value -
                    item.validatorSigningInfos[0]?.missedBlocksCounter) /
                    signedBlocks.value) *
                  100,
                isActive: await isActiveValidator(
                  item.validatorInfo?.operatorAddress
                ).then((req) => req),
              }
            }
          )
        )) as unknown as ValidatorsInfo[]

        inactiveValidators.value = (await Promise.all(
          copyInactiveValidator.map(
            async (item: ValidatorsInfo, index: number) => {
              return {
                ...item,
                rank: index + 1,
                uptime:
                  ((signedBlocks.value -
                    item.validatorSigningInfos[0]?.missedBlocksCounter) /
                    signedBlocks.value) *
                  100,
                isActive: await isActiveValidator(
                  item.validatorInfo?.operatorAddress
                ).then((req) => req),
              }
            }
          )
        )) as unknown as ValidatorsInfo[]

        validators.value = activeValidators.value
        tabStatus.value = activeValidatorsTitle.value
        validatorsCount.value = result.value?.validator?.length || 0
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
