<template>
  <div class="latest">
    <div class="latest__wrapper">
      <transition name="fade" mode="out-in">
        <LatestList v-if="latestBlocks" :header="latestBlocksHeader">
          <template v-if="latestBlocks.length">
            <LatestListItem
              v-for="item in latestBlocks"
              :key="item.blockId.hash"
            >
              <template #label> Bk </template>
              <template #name>
                <TitledLink
                  :link="`/blocks/${item.header.height}`"
                  class="app-table__cell-txt"
                  :text="item.header.height"
                />
              </template>
              <template #time>
                <div class="info-value">
                  {{ diffDays(toDay, getDay(item.header.time)) }}
                </div>
              </template>
              <template #validator>
                <span>Validator:</span>
                <TitledLink
                  :link="`/transactions/${item.header.height}`"
                  class="app-table__cell-txt"
                  :text="`${cropText(
                    '0x' + toHexFunc(item.header.validatorsHash).toUpperCase()
                  )}`"
                />
              </template>
              <!-- TODO: transactions count -->
              <template #transactions>
                <span>548 transactions</span>
              </template>
              <!-- TODO: what is block_size  -->
            </LatestListItem>
          </template>
          <div class="latest-list-item" v-else>
            <span class="latest-list-item__empty"> no item </span>
          </div>
        </LatestList>
      </transition>
      <transition name="fade" mode="out-in">
        <LatestList
          v-if="latestTransactions"
          :header="latestTransactionsHeader"
        >
          <div v-if="latestTransactions.length">
            <LatestListItem
              v-for="item in latestTransactions"
              :key="item.transHash"
            >
              <template #label> Tx </template>
              <template #name>
                <TitledLink
                  class="app-table__cell-txt"
                  :link="`/blocks/${item.transHeight}`"
                  :text="
                    item.transHash
                      ? cropText(`0x${item.transSender}`)
                      : 'No info'
                  "
                />
              </template>
              <template #time>
                {{ diffDays(toDay, getDay(item.transTime)) }}
              </template>
              <template #from>
                <span>From:</span>
                <TitledLink
                  class="app-table__cell-txt"
                  :text="
                    item.transSender
                      ? cropText(`0x${item.transSender}`)
                      : 'No info'
                  "
                />
              </template>
              <template #to>
                <span> To: </span>
                <TitledLink
                  class="app-table__cell-txt"
                  :text="
                    item.transReceiver
                      ? cropText(`0x${item.transReceiver}`)
                      : 'No info'
                  "
                />
              </template>
            </LatestListItem>
          </div>
          <div class="latest-list-item" v-else>
            <span class="latest-list-item__empty"> no item </span>
          </div>
        </LatestList>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { toHex } from '@cosmjs/encoding'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import {
  makeTransactionListFormatted,
  TransactionListFormatted,
} from '@/helpers/makeTransactionListFormatted'

import LatestList from '@/components/LatestList/LatestList.vue'
import LatestListItem from '@/components/LatestList/LatestListItem.vue'
import TitledLink from '@/components/TitledLink.vue'
import { BlockMeta } from '@cosmjs/tendermint-rpc'

export default defineComponent({
  name: 'Latest',
  components: { LatestList, LatestListItem, TitledLink },
  setup: function () {
    const toDay = ref<Date>(new Date())

    onMounted(async (): Promise<void> => {
      // TODO: Promise.allSettled? Promise.all? And how to handle the error if it was caught?
      await getLatestBlocks()
      await getLatestTransactions()
    })

    let latestBlocks = ref<Array<BlockMeta> | null>(null)
    let latestTransactions = ref<Array<TransactionListFormatted> | null>(null)
    let lastHeight = ref<number>(0)
    let totalCount = ref<number>()

    const getLatestBlocks = async (): Promise<void> => {
      const { blockMetas, lastHeight: reqLastHeight } =
        await callers.getBlockchain(100, 500)
      latestBlocks.value = [...blockMetas].slice(0, 5)
      console.log('latestBlocks', latestBlocks.value)
      lastHeight.value = reqLastHeight
    }
    const getLatestTransactions = async (): Promise<void> => {
      const { totalCount: reqTotalCount, txs } = await callers.getTxSearch({
        // query: `tx.height >= ${500 - 10}`,
        query: `tx.height >= ${lastHeight.value - 10}`,
      })
      latestTransactions.value = await makeTransactionListFormatted(
        [...txs].slice(0, 5)
      )
      console.log('latestTransactions', latestTransactions.value)
      totalCount.value = reqTotalCount
    }

    let latestBlocksHeader = {
      title: 'Latest Blocks',
      link: 'View all Blocks',
      linkDataText: 'Blocks',
    }
    let latestTransactionsHeader = {
      title: 'Latest Transactions',
      link: 'View all Transactions',
      linkDataText: 'Transactions',
    }

    const toHexFunc = toHex
    return {
      latestBlocksHeader,
      latestBlocks,
      latestTransactions,
      latestTransactionsHeader,
      diffDays,
      cropText,
      toHexFunc,
      toDay,
      getDay,
    }
  },
})
</script>

<style lang="scss" scoped>
.latest {
  &-list-item {
    &__empty {
      grid-column-start: 1;
      grid-column-end: -1;
      color: var(--clr__input-border);
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 3.2rem;
      font-weight: 600;
      text-transform: uppercase;
    }
  }
  &__wrapper {
    display: grid;
    align-items: flex-start;
    gap: 2.4rem;
    grid-template-columns: 1fr 1fr;
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
