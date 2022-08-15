<template>
  <div class="app__main-view">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Transactions</h2>
    </div>
    <div class="mg-b16 mg-t16">
      <skeleton-loader
        v-if="!isFinishLoading"
        pill
        shimmer
        :height="24"
        width="100"
      />
      <p v-else>{{ totalTransactions }} Transactions found</p>
    </div>
    <div class="app-table">
      <div class="app-table__head">
        <span>Transaction hash</span>
        <span>Type</span>
        <span>Block</span>
        <span>Date and time</span>
        <span>Sender</span>
        <span>Receiver</span>
        <span>Amount</span>
        <span>Transaction Fee</span>
      </div>
      <template v-if="transactions?.length">
        <TxLine
          v-for="(item, index) in transactions"
          :key="index"
          :transition="item"
        />
      </template>
      <template v-else>
        <SkeletonTable
          v-if="!isFinishLoading"
          :header-titles="headerTitles"
          table-size="10"
          class-string="data-sources__table-row"
        />
        <div v-else class="app-table__empty-stub">
          <p class="empty mg-t32">No items yet</p>
        </div>
      </template>
    </div>

    <AppPagination
      v-if="totalTransactions > ITEMS_PER_PAGE"
      class="mg-t32"
      v-model="page"
      :pages="totalPages"
      @update:modelValue="updateHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { callers } from '@/api/callers'
import { ref, onMounted, computed } from 'vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/transaction.helpers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { useQuery } from '@vue/apollo-composable'
import { TransactionsQuery } from '@/graphql/queries'
import { TransactionsVariables } from '@/graphql/types'
import TxLine from '@/components/TxLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

const ITEMS_PER_PAGE = 20
const transactions = ref()
const page = ref<number>(1)
const totalPages = ref<number>(0)
const totalTransactions = ref<number>(0)
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
  loading: isTransactionsLoading,
  refetch,
  onResult,
} = useQuery(TransactionsQuery, {
  offset: (page.value - 1) * ITEMS_PER_PAGE,
  limit: ITEMS_PER_PAGE,
})

const isFinishLoading = computed(
  () =>
    !(
      isLoading.value ||
      isTransactionsLoading.value ||
      !result.value?.transaction
    ),
)
const getTx = async () => {
  lockLoading()
  try {
    transactions.value = []
    const { total_count } = await callers
      .getTxSearchFromTelemetry(page.value - 1, ITEMS_PER_PAGE, 'desc')
      .then(resp => resp.json())

    // transactions.value = await prepareTransaction(data)
    totalTransactions.value = total_count
    totalPages.value = Math.ceil(totalTransactions.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getTransactions = async () => {
  lockLoading()
  try {
    if (!isTransactionsLoading.value && result.value.transaction.length) {
      transactions.value = prepareTransaction(result.value.transaction)
    }
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onResult(() => {
  getTransactions()
})

const updateHandler = async () => {
  // await getTransactions()
  transactions.value = []
  refetch({
    offset: (page.value - 1) * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  })
}

onMounted(async () => {
  await getTx()
  await getTransactions()
  // refetch({
  //   offset: 0,
  //   limit: ITEMS_PER_PAGE,
  // })
})
</script>
