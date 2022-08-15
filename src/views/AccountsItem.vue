<template>
  <div class="app__main-view accounts-item">
    <div class="app__main-view-title-wrapper">
      <BackButton text="Top accounts" />
      <h1 class="app__main-view-title accounts-item__title">Account</h1>
      <div
        v-if="!isLoadingError"
        class="app__main-view-subtitle-wrapper accounts-item__subtitle-wrapper"
      >
        <p class="app__main-view-subtitle fs-cut">
          {{ route.params.hash }}
        </p>
        <CopyButton class="mg-l8" :text="route.params.hash" />
      </div>
    </div>

    <template v-if="isLoadingError">
      <div class="app-table__empty-stub">
        <ui-loading-error-message message="Not Found" title="404" />
      </div>
    </template>
    <template v-else>
      <account-info :address="accountAdress" />
      <div class="accounts-item__subtitle-line">
        <div class="accounts-item__subtitle app__main-view-subtitle mg-b32">
          <div class="accounts-item__tx-info">
            <img src="~@/assets/icons/info.svg" alt="info" />
            <span class="accounts-item__tooltip">
              Based on last transactions in system
            </span>
          </div>
          <span class="view-main__subtitle-item">Transaction list</span>
        </div>
        <div class="accounts-item__selection">
          <div class="accounts-item__selection-item">
            <span class="accounts-item__selection-item-title">Filter</span>
            <VuePicker
              class="accounts-item__vue-picker _vue-picker"
              name="filter"
              v-model="sortingValue"
              :is-disabled="isLoading || isTransactionLoading"
            >
              <template #dropdownInner>
                <div class="_vue-picker__dropdown-custom">
                  <VuePickerOption
                    v-for="{ text, value } in sortingTypeTx"
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
        </div>
      </div>

      <div v-if="transactions" class="app-table">
        <div class="app-table__head">
          <span> Transaction hash </span>
          <span> Type </span>
          <span> Block </span>
          <span> Date and time </span>
          <span> Sender </span>
          <span> Receiver </span>
          <span> Amount </span>
          <span> Transaction Fee </span>
        </div>
        <div class="app-table__body">
          <template v-if="transactions?.length">
            <AccountTxLine
              v-for="(item, index) in transactions"
              :key="index"
              :tx="item"
            />
          </template>
          <template v-else>
            <SkeletonTable
              v-if="isLoading || isTransactionLoading"
              :header-titles="headerTitles"
              table-size="10"
            />
            <div v-else class="app-table__empty-stub">
              <ui-no-data-message />
            </div>
          </template>
        </div>
      </div>
      <AppPagination
        v-if="totalTxCount > ITEMS_PER_PAGE"
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="updateHandler"
      />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { UiLoadingErrorMessage, UiNoDataMessage } from '@/components/ui'
import { useQuery } from '@vue/apollo-composable'
import { AccountTransactionsQuery } from '@/graphql/queries'
import {
  prepareAccountTransaction,
  sortingTypeTx,
  TYPE_TX_SORT,
  decodeTypeTxSort,
} from '@/helpers/account.helpers'
import BackButton from '@/components/BackButton.vue'
import CopyButton from '@/components/CopyButton.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import AccountTxLine from '@/components/AccountTxLine.vue'
import AccountInfo from '@/components/AccountInfo.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const isLoadingError = ref(false)
const route: RouteLocationNormalizedLoaded = useRoute()
const transactions = ref()
const totalTxCount = ref(0)
const currentPage = ref(1)
const totalPages = ref(1)
const ITEMS_PER_PAGE = 50
const sortingValue = ref(TYPE_TX_SORT.all)
const accountAdress = String(route.params.hash)
const headerTitles = [
  { title: 'Transaction hash' },
  { title: 'Type' },
  { title: 'Block' },
  { title: 'Date and time' },
  { title: 'Sender' },
  { title: 'Receiver' },
  { title: 'Amount' },
  { title: 'Transaction Fee' },
]

const {
  result,
  loading: isTransactionLoading,
  refetch,
  onResult,
} = useQuery(AccountTransactionsQuery, {
  offset: (currentPage.value - 1) * ITEMS_PER_PAGE,
  limit: ITEMS_PER_PAGE,
  address: accountAdress,
  type: decodeTypeTxSort(sortingValue.value),
})

onResult(async () => {
  await getAccountInfo()
})

const getAccountInfo = async () => {
  lockLoading()
  try {
    transactions.value = []
    if (!isTransactionLoading.value) {
      // const tx = await callers
      //   .getAccountTx(
      //     currentPage.value - 1,
      //     50,
      //     String(route.params.hash),
      //     'desc',
      //     sortingValue.value,
      //   )
      //   .then(resp => resp.json())
      // totalTxCount.value = tx.total_count
      // totalPages.value = Math.ceil(tx.total_count / ITEMS_PER_PAGE)
      transactions.value = prepareAccountTransaction(result.value.message)
    }
  } catch (error) {
    isLoadingError.value = true
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onMounted(async () => {
  await getAccountInfo()
})

const updateHandler = async () => {
  transactions.value = []
  refetch({
    offset: (currentPage.value - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    address: accountAdress,
    type: decodeTypeTxSort(sortingValue.value),
  })
}

watch([sortingValue], async () => {
  currentPage.value = 1
  transactions.value = []
  refetch({
    offset: (currentPage.value - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
    address: accountAdress,
    type: decodeTypeTxSort(sortingValue.value),
  })
})
</script>

<style lang="scss" scoped>
.accounts-item__title {
  margin: 0 1.6rem 0 2rem;
}

.accounts-item__subtitle-wrapper {
  display: flex;
}

.accounts-item__stats {
  display: inline-block;
}

.accounts-item__stats-row {
  display: grid;
  grid-template-columns: 10rem 1fr;
  align-items: center;

  &:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}

.accounts-item__stats-title {
  font-size: 1.6rem;
  width: 10rem;
  display: inline-block;
}

.accounts-item__stats-amount {
  font-weight: 600;
  font-size: 1.6rem;
  margin-left: 2.4rem;
  @include ellipsis();
}
.accounts-item__subtitle-line {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.accounts-item__selection {
  display: flex;
}
.accounts-item__selection-item {
  display: flex;
  justify-content: center;
  align-items: center;
}
.accounts-item__selection-item-title {
  font-size: 1.4rem;
  font-weight: 300;
  margin-right: 0.4rem;
}
.accounts-item__subtitle {
  display: flex;
  align-items: center;
}
.accounts-item__tx-info {
  display: flex;
  align-items: center;
  height: 2.3rem;
  position: relative;
  cursor: pointer;
  margin-right: 0.9rem;
  &:hover {
    .accounts-item__tooltip {
      display: block;
    }
  }
}
.accounts-item__tooltip {
  display: none;
  position: absolute;
  bottom: 130%;
  left: -0.7rem;
  width: 20rem;
  padding: 1.2rem 2.4rem;
  background: var(--clr__tooltip-bg);
  border-radius: 0.8rem;
  font-size: 1.6rem;
  font-weight: 400;
  line-height: 1.6rem;
  color: var(--clr__tooltip-text);
  &:before {
    content: '';
    display: block;
    width: 0.6rem;
    height: 0.6rem;
    position: absolute;
    bottom: -0.3rem;
    left: 8%;
    transform: translateX(-50%) rotate(45deg);
    background: var(--clr__tooltip-bg);
  }
}
@include respond-to(tablet) {
  .accounts-item__title {
    margin: 0.8rem 0 0.4rem 0;
  }

  .accounts-item__subtitle-wrapper {
    width: 100%;
  }

  .accounts-item__stats {
    width: 100%;
  }
  .accounts-item__selection {
    width: 100%;
    flex-direction: column;
    margin-bottom: 0rem;
  }
  .accounts-item__subtitle-line {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .accounts-item__selection-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .accounts-item__vue-picker {
    width: 100%;
  }
  .accounts-item__selection-item-title {
    margin: 0 0 0.4rem;
  }
}
</style>
