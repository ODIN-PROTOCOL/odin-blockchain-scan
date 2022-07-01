<template>
  <div class="app__main-view">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Transactions</h2>
    </div>
    <div class="mg-b16 mg-t16">
      <skeleton-loader
        v-if="isLoading"
        :height="24"
        rounded
        animation="wave"
        color="rgb(225, 229, 233)"
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
          v-if="isLoading"
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
      v-model="currentPage"
      :pages="totalPages"
      @update:modelValue="updateHandler"
    />
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { defineComponent, ref, onMounted } from 'vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'
import TxLine from '@/components/TxLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import SkeletonTable from '@/components/SkeletonTable.vue'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  name: 'TransactionsView',
  components: { TxLine, AppPagination, SkeletonTable },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const router: Router = useRouter()
    const ITEMS_PER_PAGE = 20
    const transactions = ref()
    const currentPage = ref<number>(1)
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
    const getTransactions = async () => {
      lockLoading()
      try {
        transactions.value = []
        const { data, total_count } = await callers
          .getTxSearchFromTelemetry(
            currentPage.value - 1,
            ITEMS_PER_PAGE,
            'desc'
          )
          .then((resp) => resp.json())

        transactions.value = await prepareTransaction(data)
        totalTransactions.value = total_count
        totalPages.value = Math.ceil(totalTransactions.value / ITEMS_PER_PAGE)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const updateHandler = async () => {
      const query = { page: currentPage.value }
      await router.push({
        name: 'Transactions',
        query,
      })
      await getTransactions()
    }

    onMounted(async () => {
      if (router.currentRoute.value.query.page) {
        const { page } = router.currentRoute.value.query
        currentPage.value = Number(page)
      } else {
        const query = { page: currentPage.value }
        await router.push({
          name: 'Transactions',
          query,
        })
      }
      await getTransactions()
    })

    return {
      transactions,
      currentPage,
      totalPages,
      totalTransactions,
      updateHandler,
      isLoading,
      ITEMS_PER_PAGE,
      headerTitles,
    }
  },
})
</script>
