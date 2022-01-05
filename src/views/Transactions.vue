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
      <div class="pagination-wrapper mg-t32">
        <v-pagination
          v-model="page"
          :pages="totalPages"
          :range-size="1"
          active-color="#007bff"
          @update:modelValue="updateHandler"
          :hideFirstButton="true"
          :hideLastButton="true"
        >
        </v-pagination>
      </div>
    </template>
    <template v-else>
      <div class="empty">Waiting to receive data</div>
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import TransitionLine from '@/components/TransitionLine.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { handleError } from '@/helpers/errors'
import { prepareTransaction } from '@/helpers/helpers'

export default defineComponent({
  name: 'transactions',
  components: { VPagination, TransitionLine },
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

<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.4rem;
    margin: 0 0.4rem;
    min-width: 2.6rem;
    height: 3.6rem;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 1rem;
  }

  .Page {
    color: var(--clr__action);

    &:hover {
      border: none;
    }
  }
  .Page-active {
    color: #fff;
  }

  .PaginationControl .Control.Control-active {
    fill: var(--clr__action);
  }
  .PaginationControl .Control {
    fill: #cce4ff;
  }

  .DotsHolder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;

    svg,
    path {
      color: var(--clr__action);
    }
  }
}
</style>
