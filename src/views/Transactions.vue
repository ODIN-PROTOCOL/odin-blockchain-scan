<template>
  <div class="blocks-container">
    <div class="data-sources view-main">
      <div class="mg-b16 mg-t32">
        <h2 class="view-title">Transactions</h2>
      </div>
      <div class="mg-b16 mg-t16">
        <p>{{ totalTransactions }} transactions found</p>
      </div>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transaction hash </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Type </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Block </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Date and time </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Sender </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Receiver </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Amount </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transaction Fee </span>
          </div>
        </div>
        <template v-if="filteredTransactions?.length">
          <div
            v-for="(item, index) in filteredTransactions"
            :key="index"
            class="data-sources__table-row app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__header">Transaction hash</span>
              <router-link
                :to="`/transactions/${item.height}/${toHexFunc(
                  item.hash
                ).toUpperCase()}`"
              >
                <TitledLink
                  class="app-table__cell-txt"
                  :text="'Ox' + toHexFunc(item.hash).toUpperCase()"
                />
              </router-link>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Type</span>
              <TitledSpan class="app-table__cell-txt" :text="'test'" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Block</span>
              <router-link :to="`/blocks/${item.height}`">
                <TitledLink class="app-table__cell-txt" :text="item.height" />
              </router-link>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Date and time</span>
              <TitledSpan class="app-table__cell-txt" :text="'test'" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Sender</span>
              <TitledSpan class="app-table__cell-txt" :text="'test'" />
              <!-- {{ item.header.chain_id }} -->
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Receiver</span>
              <TitledSpan class="app-table__cell-txt" :text="'test'" />
              <!-- {{ item.header.chain_id }} -->
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Amount</span>
              <TitledSpan class="app-table__cell-txt" :text="'test'" />
              <!-- {{ item.header.chain_id }} -->
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Transaction Fee</span>
              <TitledSpan class="app-table__cell-txt" :text="'test'" />
              <!-- {{ item.header.chain_id }} -->
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__row">
            <p class="app-table__empty-stub">No items yet</p>
          </div>
        </template>
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
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import TitledSpan from '@/components/TitledSpan.vue'
import TitledLink from '@/components/TitledLink.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { useRoute } from 'vue-router'
import { toHex } from '@cosmjs/encoding'

export default defineComponent({
  components: { TitledSpan, TitledLink, VPagination },
  setup() {
    const transactions = ref()
    const filteredTransactions = ref()
    const transactionsPerPage = 5
    const page = ref(1)
    const totalPages = ref()
    const route = useRoute()
    const totalTransactions = ref()
    const toHexFunc = toHex
    let lastHeight = 0

    const getTransactions = async () => {
      const client = await callers.getClient()

      if (!route.params.height) {
        await client.abciInfo().then((res) => {
          if (res && res.lastBlockHeight) {
            lastHeight = +res.lastBlockHeight
          }
        })
      } else {
        lastHeight = +route.params.height
      }

      await client
        .txSearch({ query: `tx.height >= ${lastHeight - 10}` })
        .then((res) => {
          totalTransactions.value = res.totalCount
          transactions.value = res.txs
          totalPages.value = Math.ceil(
            transactions.value.length / transactionsPerPage
          )
        })
        .then(() => filterTransactions(page.value))      
    }

    const filterTransactions = async (newPage: number) => {
      let tempArr = transactions.value

      if (newPage === 1) {
        filteredTransactions.value = tempArr.slice(
          0,
          newPage * transactionsPerPage
        )
      } else {
        filteredTransactions.value = tempArr.slice(
          (newPage - 1) * transactionsPerPage,
          (newPage - 1) * transactionsPerPage + transactionsPerPage
        )
      }
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
      toHexFunc,
    }
  },
})
</script>

<style scoped lang="scss">
* {
  font-family: 'SF Display';
}
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    repeat(8, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(8, minmax(4rem, 1fr)) / auto;
  }
}

.blocks-container {
  border-top: 1px solid var(--clr__table-border);
}

.app-table__row {
  padding: 3.2rem 0 2rem;

  @media screen and (max-width: 992px) {
    padding: 1.6rem 0 0 0;
  }
}

.app-table__cell-txt {
  max-width: 150px;
}

.view-title {
  font-weight: 400;
  font-size: 32px;

  @media screen and (max-width: 600px) {
    font-size: 28px;
  }
}

.app-table__head {
  @media screen and (max-width: 992px) {
    display: none;
  }
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 200px;
  }
}
</style>
<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 1px solid var(--clr__action);
    border-radius: 4px;
    margin: 0 4px;
    min-width: 26px;
    height: 36px;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 10px;
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
