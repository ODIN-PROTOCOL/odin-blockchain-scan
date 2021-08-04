<template>
  <div class="latest">
    <div class="latest__wrapper">
      <LatestList :header="latestBlocksHeader">
        <template v-if="LatestBlocks">
          <LatestListItem v-for="item in LatestBlocks" :key="item.blockId.hash">
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
        </template>
      </LatestList>
      <LatestList :header="latestTransactionsHeader">
        <!-- TODO: Real data  -->
        <LatestListItem v-for="(i, index) in [1, 2, 3, 4, 5]" :key="index">
          <template #label> Tx </template>
          <template #name>
            <TitledLink
              :link="String(i)"
              class="app-table__cell-txt"
              :text="`${cropText('0x8b5a0393b5b')}`"
            />
          </template>
          <template #time> 24 secs ago </template>
          <template #from>
            <span>From:</span>
            <TitledLink
              :link="String(i)"
              class="app-table__cell-txt"
              :text="`${cropText('0x8b5a0393b5b')}`"
            />
          </template>
          <template #to>
            <span> To: </span>
            <TitledLink
              :link="String(i)"
              class="app-table__cell-txt"
              :text="`${cropText('0x8b5a0393b5b')}`"
            />
          </template>
          <template #currency> 454,565 ODIN </template>
        </LatestListItem>
      </LatestList>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { toHex } from '@cosmjs/encoding'
import { diffDays, cropText } from '@/helpers/formatters'

import LatestList from '@/components/LatestList/LatestList.vue'
import LatestListItem from '@/components/LatestList/LatestListItem.vue'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  name: 'Latest',
  components: { LatestList, LatestListItem, TitledLink },
  setup() {
    const toDay = ref<Date>(new Date())
    const getDay = (time: string): Date => new Date(time)

    onMounted(
      async (): Promise<void> => {
        await getLatestBlocks()
        await getLatestTransactions()
      }
    )

    let LatestBlocks = ref({})
    let LatestTransactions = ref({})
    let LastHeight = ref()
    let TotalCount = ref()

    const getLatestBlocks = async (): Promise<void> => {
      const { blockMetas, lastHeight } = await callers.getBlockchain(100, 500)
      LatestBlocks.value = [...blockMetas].slice(0, 5)
      LastHeight.value = lastHeight
    }

    const getLatestTransactions = async (): Promise<void> => {
      const { totalCount, txs } = await callers.getTxSearch({
        query: `tx.height >= ${LastHeight.value - 10}`,
      })
      LatestTransactions.value = [...txs].slice(0, 5)
      TotalCount.value = totalCount
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
      LatestBlocks,
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
