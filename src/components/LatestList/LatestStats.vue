<template>
  <transition name="fade" mode="out-in" appear>
    <div class="latest-stats">
      <div class="latest-stats__wrapper">
        <LatestList :header="latestBlocksHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestBlocks.length">
              <LatestListItemBlock
                v-for="item in latestBlocks"
                :key="item.blockId.hash"
                :block="item"
              />
            </template>
            <template v-else>
              <template v-if="isLoading">
                <SkeletonLatestListItemBlock
                  v-for="item in latestTransactionsEmpty"
                  :key="item"
                />
              </template>
              <div v-else class="latest-stats__list-item">
                <span class="latest-stats__list-item--empty">No Item</span>
              </div>
            </template>
          </transition-group>
        </LatestList>
        <LatestList :header="latestTransactionsHeader">
          <transition-group name="fade" mode="out-in">
            <template v-if="latestTransactions.length">
              <LatestListItemTx
                v-for="item in latestTransactions"
                :key="item.hash"
                :tx="item"
              />
            </template>
            <template v-else>
              <template v-if="isLoading">
                <SkeletonLatestListItemTx
                  v-for="item in latestTransactionsEmpty"
                  :key="item"
                />
              </template>
              <div class="latest-stats__list-item" v-else>
                <span class="latest-stats__list-item--empty">No Item</span>
              </div>
            </template>
          </transition-group>
        </LatestList>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { diffDays, cropText, getDay } from '@/helpers/formatters'

import LatestList from '@/components/LatestList/LatestList.vue'
import LatestListItemBlock from '@/components/LatestList/LatestListItemBlock.vue'
import LatestListItemTx from '@/components/LatestList/LatestListItemTx.vue'
import SkeletonLatestListItemTx from '@/components/skeletonComponents/SkeletonLatestListItemTx.vue'
import SkeletonLatestListItemBlock from '@/components/skeletonComponents/SkeletonLatestListItemBlock.vue'

import { prepareTransaction, toHexFunc } from '@/helpers/helpers'
import { adjustedData, TransformedBlocks } from '@/helpers/Types'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareBlocks } from '@/helpers/blocksHelper'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

export default defineComponent({
  name: 'LatestStats',
  components: {
    LatestList,
    LatestListItemBlock,
    SkeletonLatestListItemBlock,
    LatestListItemTx,
    SkeletonLatestListItemTx,
  },
  setup: function () {
    const toDay = ref<Date>(new Date())
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const latestTransactionsEmpty = [1, 2, 3, 4, 5]
    onMounted(async (): Promise<void> => {
      lockLoading()
      try {
        await getLatestBlocks()
        await getLatestTransactions()
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    })

    let latestBlocks = ref<Array<TransformedBlocks> | null>([])
    let latestTransactions = ref<Array<adjustedData> | null>([])
    let lastHeight = ref<number>(0)

    const getLatestBlocks = async (): Promise<void> => {
      const { blockMetas, lastHeight: reqLastHeight } =
        await callers.getBlockchain()
      latestBlocks.value = await prepareBlocks(blockMetas.slice(0, 5))
      lastHeight.value = reqLastHeight
    }
    const getLatestTransactions = async (): Promise<void> => {
      const { data } = await callers
        .getTxSearchFromTelemetry(0, 5, 'desc')
        .then((resp) => resp.json())
      latestTransactions.value = await prepareTransaction(data)
    }

    let latestBlocksHeader = {
      title: 'Latest Blocks',
      link: 'View all',
      linkDataText: 'Blocks',
    }
    let latestTransactionsHeader = {
      title: 'Latest Transactions',
      link: 'View all',
      linkDataText: 'Transactions',
    }

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
      isLoading,
      latestTransactionsEmpty,
    }
  },
})
</script>

<style lang="scss" scoped>
.latest-stats__list-item--empty {
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

.latest-stats__wrapper {
  display: grid;
  align-items: flex-start;
  gap: 2.4rem;
  grid-template-columns: 1fr 1fr;
}
@media (max-width: 768px) {
  .latest-stats__wrapper {
    grid-template-columns: 1fr;
  }
}
</style>
