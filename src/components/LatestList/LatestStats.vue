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
                <SkeletonLatestListItemBlock v-for="item of 5" :key="item" />
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
              <template v-if="isLoading || isTransactionLoading">
                <SkeletonLatestListItemTx v-for="item of 5" :key="item" />
              </template>
              <div v-else class="latest-stats__list-item">
                <span class="latest-stats__list-item--empty">No Item</span>
              </div>
            </template>
          </transition-group>
        </LatestList>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { prepareTransaction } from '@/helpers/transaction.helpers'
import { DecodedTxData, TransformedBlocks } from '@/helpers/Types'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareBlocks } from '@/helpers/blocksHelper'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { latestBlocksHeader, latestTransactionsHeader } from '@/const'
import { useQuery } from '@vue/apollo-composable'
import { TransactionsQuery } from '@/graphql/queries'

import LatestList from './LatestList.vue'
import LatestListItemBlock from './LatestListItemBlock.vue'
import LatestListItemTx from './LatestListItemTx.vue'
import SkeletonLatestListItemTx from '@/components/skeletonComponents/SkeletonLatestListItemTx.vue'
import SkeletonLatestListItemBlock from '@/components/skeletonComponents/SkeletonLatestListItemBlock.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
onMounted(async (): Promise<void> => {
  lockLoading()
  try {
    await getLatestBlocks()
    refetch({
      offset: 0,
      limit: 5,
    })
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
})
const {
  result,
  loading: isTransactionLoading,
  refetch,
  onResult,
} = useQuery(TransactionsQuery, {
  limit: 5,
  offset: 0,
})

const latestBlocks = ref<TransformedBlocks[]>([])
const latestTransactions = ref<DecodedTxData[]>([])
const lastHeight = ref(0)

const getLatestBlocks = async (): Promise<void> => {
  const { blockMetas, lastHeight: reqLastHeight } =
    await callers.getBlockchain()
  latestBlocks.value = await prepareBlocks(blockMetas.slice(0, 5))
  lastHeight.value = reqLastHeight
}
const getTransactions = () => {
  try {
    if (!isTransactionLoading.value) {
      latestTransactions.value = prepareTransaction(result.value.transaction)
    }
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
}

onResult(() => {
  getTransactions()
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
