<template>
  <div
    class="app__container load-fog"
    :class="{ 'load-fog_show': isLoading && blocks?.length }"
  >
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Blocks</h2>
    </div>
    <template v-if="blocksCount">
      <p class="mg-b16 mg-t16">{{ blocksCount }} blocks found</p>
    </template>
    <div class="app-table blocks-list__table">
      <div class="app-table__head blocks-list__table-head">
        <span> Block </span>
        <span> Date and time </span>
        <span> Transactions </span>
        <span> Validator </span>
      </div>
      <div class="app-table__body">
        <template v-if="blocks?.length">
          <div
            v-for="item in blocks"
            :key="item.id"
            class="app-table__row blocks-list__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Block</span>
              <TitledLink
                :to="`/blocks/${item.header.height}`"
                class="app-table__cell-txt app-table__link"
                :text="item.header.height"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Date and time</span>
              <span>{{ $fDate(item.header.time, 'HH:mm dd.MM.yy') }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Transactions</span>
              <span class="app-table__cell-txt">{{ item.txs }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Validator</span>
              <TitledLink
                :to="`/validators/${item.validator}`"
                class="app-table__cell-txt app-table__link"
                :text="item.validator"
              />
            </div>
          </div>
        </template>
        <template v-else>
          <div>
            <p v-if="isLoading" class="empty mg-t32">Loading…</p>
            <p v-else class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
      <AppPagination
        v-if="!isLoading && blocksCount > ITEMS_PER_PAGE"
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="updateHandler"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { toHexFunc } from '@/helpers/helpers'
import TitledLink from '@/components/TitledLink.vue'
import { defineComponent, ref, onMounted, computed } from 'vue'
import { convertToTime, convertToDate } from '@/helpers/dates'
import { prepareBlocks } from '@/helpers/blocksHelper'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { handleError } from '@/helpers/errors'
import { START_VALUE } from '@/api/api-config'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'

export default defineComponent({
  name: 'BlocksList',
  components: { TitledLink, AppPagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const blocks = ref()
    const ITEMS_PER_PAGE = 20
    const MIN_POSSIBLE_BLOCK_HEIGHT = Number(START_VALUE.minHeight)
    const currentPage = ref<number>(1)
    const totalPages = ref<number>()

    const minHeight = ref()
    const maxHeight = ref()
    const lastBlockHeight = ref()

    const blocksCount = computed(() =>
      lastBlockHeight.value
        ? lastBlockHeight.value - MIN_POSSIBLE_BLOCK_HEIGHT
        : 0
    )

    const initBlocks = async () => {
      lockLoading()
      try {
        const { lastHeight, blockMetas } = await callers.getBlockchain()
        blocks.value = await prepareBlocks(blockMetas)
        lastBlockHeight.value = lastHeight
        totalPages.value = Math.ceil(
          (lastHeight - MIN_POSSIBLE_BLOCK_HEIGHT) / ITEMS_PER_PAGE
        )
        maxHeight.value = lastHeight
        minHeight.value = lastHeight - ITEMS_PER_PAGE
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const getBLocks = async (): Promise<void> => {
      lockLoading()
      try {
        const { lastHeight, blockMetas } = await callers.getBlockchain(
          minHeight.value,
          maxHeight.value
        )

        lastBlockHeight.value = lastHeight
        totalPages.value = Math.ceil(
          (lastHeight - MIN_POSSIBLE_BLOCK_HEIGHT) / ITEMS_PER_PAGE
        )
        blocks.value = await prepareBlocks(blockMetas)
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const updateHandler = async (num: number) => {
      minHeight.value = lastBlockHeight.value - num * ITEMS_PER_PAGE
      maxHeight.value = minHeight.value + ITEMS_PER_PAGE
      if (minHeight.value < MIN_POSSIBLE_BLOCK_HEIGHT)
        minHeight.value = MIN_POSSIBLE_BLOCK_HEIGHT
      await getBLocks()
    }

    onMounted(async (): Promise<void> => {
      await initBlocks()
    })

    return {
      blocks,
      currentPage,
      totalPages,
      blocksCount,
      updateHandler,
      convertToTime,
      convertToDate,
      toHexFunc,
      isLoading,
      ITEMS_PER_PAGE,
    }
  },
})
</script>
<style lang="scss" scoped>
.blocks-list__table-head,
.blocks-list__table-row {
  grid:
    auto /
    minmax(3rem, 0.5fr) minmax(10rem, 0.5fr) minmax(8rem, 0.5fr) minmax(8rem, 2fr);
}

@include respond-to(tablet) {
  .blocks-list__table-head,
  .blocks-list__table-row {
    grid: none;
  }
}
</style>
