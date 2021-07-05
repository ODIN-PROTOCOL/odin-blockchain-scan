<template>
  <div class="blocks-container">
    <div class="data-sources view-main">
      <div class="mg-b16 mg-t32">
        <h2 class="view-title">Pending Transactions</h2>
      </div>
      <div class="mg-b16 mg-t16">
        <p>{{ totalTransactions }} pending transactions found</p>
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
                :to="`/pending_transactions/${item.height}/${toHexFunc(
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
// import { Tx } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'
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

    const testPendingTrans = {
      jsonrpc: '2.0',
      id: 823647832518,
      result: {
        txs: [
          {
            hash:
              'B8FABEE9430640B84DC12421CC1A78D5BD4EC50CAF2B891744355E82BFD093EE',
            height: '906',
            index: 0,
            tx_result: {
              code: 0,
              data: 'ChIKEGNyZWF0ZV92YWxpZGF0b3I=',
              log:
                '[{"events":[{"type":"create_validator","attributes":[{"key":"validator","value":"odinvaloper1pl07tk6hcpp2an3rug75as4dfgd743qp2juycu"},{"key":"amount","value":"10000000"}]},{"type":"message","attributes":[{"key":"action","value":"create_validator"},{"key":"module","value":"staking"},{"key":"sender","value":"odin1pl07tk6hcpp2an3rug75as4dfgd743qp80g63g"}]}]}]',
              info: '',
              gas_wanted: '2000000',
              gas_used: '138334',
              events: [
                {
                  type: 'message',
                  attributes: [
                    {
                      key: 'YWN0aW9u',
                      value: 'Y3JlYXRlX3ZhbGlkYXRvcg==',
                      index: true,
                    },
                  ],
                },
                {
                  type: 'create_validator',
                  attributes: [
                    {
                      key: 'dmFsaWRhdG9y',
                      value:
                        'b2RpbnZhbG9wZXIxcGwwN3RrNmhjcHAyYW4zcnVnNzVhczRkZmdkNzQzcXAyanV5Y3U=',
                      index: true,
                    },
                    {
                      key: 'YW1vdW50',
                      value: 'MTAwMDAwMDA=',
                      index: true,
                    },
                  ],
                },
                {
                  type: 'message',
                  attributes: [
                    {
                      key: 'bW9kdWxl',
                      value: 'c3Rha2luZw==',
                      index: true,
                    },
                    {
                      key: 'c2VuZGVy',
                      value:
                        'b2RpbjFwbDA3dGs2aGNwcDJhbjNydWc3NWFzNGRmZ2Q3NDNxcDgwZzYzZw==',
                      index: true,
                    },
                  ],
                },
              ],
              codespace: '',
            },
            tx:
              'CrwCCrkCCiovY29zbW9zLnN0YWtpbmcudjFiZXRhMS5Nc2dDcmVhdGVWYWxpZGF0b3ISigIKDwoNdmFsaWRhdG9yLWVzdBI8ChIxMDAwMDAwMDAwMDAwMDAwMDASEjIwMDAwMDAwMDAwMDAwMDAwMBoSMTAwMDAwMDAwMDAwMDAwMDAwGgExIitvZGluMXBsMDd0azZoY3BwMmFuM3J1Zzc1YXM0ZGZnZDc0M3FwODBnNjNnKjJvZGludmFsb3BlcjFwbDA3dGs2aGNwcDJhbjNydWc3NWFzNGRmZ2Q3NDNxcDJqdXljdTJDCh0vY29zbW9zLmNyeXB0by5lZDI1NTE5LlB1YktleRIiCiBhWjlPOUIrljkL7uWc4oyUdkqgZ8usQqGalyLfE2zkcDoQCgRsb2tpEggxMDAwMDAwMBJhCk4KRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECtkC6EtOcGb4zbWG/i43FMsyF5K4o8xNeatrYaAtCDQQSBAoCCAESDwoJCgRsb2tpEgEwEICJehpAeabu6NUvFhCFLaRenVTaw8aZC9GuZqN00SLLxmfebBEbf5l23BvXDupX3FefoOSSxD3JPURolWXyHAcMzN6Z/g==',
          },
        ],
      },
      total_count: '22',
    }

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

      totalTransactions.value = 1
      transactions.value = testPendingTrans.result.txs
      totalPages.value = 1
      filterTransactions(page.value)

      // TODO: should be request to
      // await fetch('http://localhost:26657/unconfirmed_txs?limit=500'

      await callers
        .getPendingTransactions(500)
        .then((res) => res.json())
        .then((data) => console.log(data))

      // await client
      //   .txSearch({ query: `tx.height >= ${lastHeight - 10}` })
      //   .then((res) => {
      //     totalTransactions.value = res.totalCount
      //     transactions.value = res.txs
      //     totalPages.value = Math.ceil(
      //       transactions.value.length / transactionsPerPage
      //     )
      //   })
      //   .then(() => filterTransactions(page.value))
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
