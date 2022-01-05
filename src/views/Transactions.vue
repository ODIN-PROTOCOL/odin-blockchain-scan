<template>
  <div class="container">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Transactions</h2>
    </div>
    <div class="mg-b16 mg-t16" v-if="filteredTransactions?.length">
      <p>{{ totalTransactions }} transactions found</p>
    </div>
    <template v-if="filteredTransactions?.length">
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
        <TransitionLine
          v-for="(item, index) in filteredTransactions"
          :key="index"
          :transition="item"
        />
      </div>
      <Pagination
        class="mg-t32"
        v-model="page"
        :pages="totalPages"
        @update:modelValue="updateHandler"
      />
    </template>
    <template v-else>
      <div class="empty">Waiting to receive data</div>
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { defineComponent, ref, onMounted } from 'vue'
import { handleError } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'
import TransitionLine from '@/components/TransitionLine.vue'
import Pagination from '@/components/pagination/Pagination.vue'

export default defineComponent({
  name: 'transactions',
  components: { TransitionLine, Pagination },
  setup() {
    const ITEMS_PER_PAGE = 5
    const transactions = ref()
    const filteredTransactions = ref()
    const page = ref<number>(1)
    const totalPages = ref<number>()
    const totalTransactions = ref<number>()
    let lastHeight = 500

    const getTransactions = async () => {
      try {
        const { txs } = await callers.getTxSearch({
          query: `tx.height >= ${lastHeight - 10}`,
          per_page: 100,
        })

        transactions.value = await prepareTransaction(txs)

        totalTransactions.value = transactions.value.length
        totalPages.value = Math.ceil(transactions.value.length / ITEMS_PER_PAGE)

        await filterTransactions(page.value)
      } catch (e) {
        handleError(e as Error)
      }
    }

    const filterTransactions = async (newPage: number): Promise<void> => {
      let tempArr = transactions.value
      if (newPage === 1) {
        filteredTransactions.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredTransactions.value = tempArr?.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }

      console.debug('filteredTransactions.value', filteredTransactions.value)
      page.value = newPage
    }

    const updateHandler = (num: number) => {
      filterTransactions(num)
    }

    onMounted(() => {
      getTransactions()
    })

    return {
      transactions,
      page,
      totalPages,
      totalTransactions,
      filteredTransactions,
      filterTransactions,
      updateHandler,
    }
  },
})
</script>
