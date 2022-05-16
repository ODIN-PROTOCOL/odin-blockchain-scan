<template>
  <div
    class="app__main-view load-fog"
    :class="{ 'load-fog_show': isLoading && transactions?.length }"
  >
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Transactions</h2>
    </div>
    <div class="mg-b16 mg-t16">
      <p>{{ totalTransactions }} Transactions found</p>
    </div>
    <div class="app-table">
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
      <template v-if="transactions?.length">
        <TxLine
          v-for="(item, index) in transactions"
          :key="index"
          :transition="item"
        />
      </template>
      <template v-else>
        <div>
          <p v-if="isLoading" class="empty mg-t32">Loading…</p>
          <p v-else class="empty mg-t32">No items yet</p>
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

<script lang="ts">
import { callers } from '@/api/callers'
import { defineComponent, ref, onMounted } from 'vue'
import { handleError } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'
import TxLine from '@/components/TxLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
export default defineComponent({
  name: 'TransactionsView',
  components: { TxLine, AppPagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()

    const ITEMS_PER_PAGE = 20
    const transactions = ref()
    const page = ref<number>(1)
    const totalPages = ref<number>(0)
    const totalTransactions = ref<number>(0)
    const getTransactions = async () => {
      lockLoading()
      try {
        const { data, total_count } = await callers
          .getTxSearchFromTelemetry(page.value - 1, ITEMS_PER_PAGE, 'desc')
          .then((resp) => resp.json())

        transactions.value = await prepareTransaction(data)
        totalTransactions.value = total_count
        totalPages.value = Math.ceil(totalTransactions.value / ITEMS_PER_PAGE)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const updateHandler = async () => {
      await getTransactions()
    }

    onMounted(async () => {
      await getTransactions()
    })

    return {
      transactions,
      page,
      totalPages,
      totalTransactions,
      updateHandler,
      isLoading,
      ITEMS_PER_PAGE,
    }
  },
})
</script>
