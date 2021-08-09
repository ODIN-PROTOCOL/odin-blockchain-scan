<template>
  <div class="latest">
    <div class="latest__wrapper">
      <LatestList :header="latestBlocksHeader">
        <div v-if="latestBlocks.length">
          <LatestListItem v-for="item in latestBlocks" :key="item.blockId.hash">
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
            <!-- TODO: currency-->
            <template #currency>
              <span>
                {{ item.block_size }}
              </span>
              <span class="currency">
                454,565 {{ item.header.chainId.toUpperCase() }}
              </span>
            </template>
          </LatestListItem>
        </div>
        <div class="latest-list-item" v-else>
          <span class="latest-list-item__empty"> no item </span>
        </div>
      </LatestList>
      <template v-if="latestTransactions">
        <LatestList :header="latestTransactionsHeader">
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
              <template #currency> {{ item.transAmount }} ODIN </template>
            </LatestListItem>
          </div>
          <div class="latest-list-item" v-else>
            <span class="latest-list-item__empty"> no item </span>
          </div>
        </LatestList>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { toHex } from '@cosmjs/encoding'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import { makeTransactionListFormatted } from '@/helpers/makeTransactionListFormatted'

import LatestList from '@/components/LatestList/LatestList.vue'
import LatestListItem from '@/components/LatestList/LatestListItem.vue'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  name: 'Latest',
  components: { LatestList, LatestListItem, TitledLink },
  setup: function () {
    const toDay = ref<Date>(new Date())

    onMounted(
      async (): Promise<void> => {
        // TODO: Promise.allSettled? Promise.all? And how to handle the error if it was caught?
        await getLatestBlocks()
        await getLatestTransactions()
        await getLatestTelemetry()
        // await getAbciInfo()
      }
    )

    let latestBlocks = ref({})
    let latestTransactions = ref({})
    let lastHeight = ref()
    let totalCount = ref()

    const getLatestTelemetry = async (): Promise<void> => {
      // TODO: Error: Query failed with (18): failed to get tx volume: failed to get the blocks by date: failed to find the blocks: page should be within [1, 9] range, given 10: invalid request
      let temp = new Date()
      temp.setDate(temp.getDate() - 2)
      const res = await callers.getTelemetry({
        startDate: temp,
        endDate: new Date(),
      })
      console.log(res)
    }

    const getLatestBlocks = async (): Promise<void> => {
      const {
        blockMetas,
        lastHeight: reqLastHeight,
      } = await callers.getBlockchain(100, 500)
      latestBlocks.value = [...blockMetas].slice(0, 5)
      console.log('latestBlocks', latestBlocks.value)
      lastHeight.value = reqLastHeight
    }
    const getAbciInfo = async (): Promise<void> => {
      const res = await callers.getAbciInfo()
      console.log('getAbciInfo', res)
    }

    const getLatestTransactions = async (): Promise<void> => {
      const { totalCount: reqTotalCount, txs } = await callers.getTxSearch({
        // query: `tx.height >= ${lastHeight.value - 10}`,
        // TODO: return LastHeight.value from getLatestBlocks()
        query: `tx.height >= ${500 - 10}`,
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
      grid-column-start: 2;
      grid-column-end: 3;
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
