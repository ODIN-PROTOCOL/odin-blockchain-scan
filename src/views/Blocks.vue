<template>
  <div class="app__container">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Blocks</h2>
    </div>

    <p class="mg-b16 mg-t16">{{ blocksCount }} blocks found</p>

    <div class="app-table">
      <div class="app-table__head">
        <span> Block </span>
        <span> Date and time </span>
        <span> Transactions </span>
        <span> Validator </span>
      </div>
      <template v-if="blocks?.length">
        <div v-for="item in blocks" :key="item.id" class="app-table__row">
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
            <span>{{ $fDate(item.header.time) }}</span>
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
        <Pagination
          class="mg-t32"
          v-model="currentPage"
          :pages="totalPages"
          @update:modelValue="updateHandler"
        />
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
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
import Pagination from '@/components/Pagination/Pagination.vue'
import { handleError } from '@/helpers/errors'

export default defineComponent({
  name: 'blocks',
  components: { TitledLink, Pagination },
  setup() {
    const blocks = ref()
    const ITEMS_PER_PAGE = 20
    const MIN_POSSIBLE_BLOCK_HEIGHT = 2
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
      try {
        const { lastHeight, blockMetas } = await callers.getBlockchain()
        lastBlockHeight.value = lastHeight
        totalPages.value = Math.ceil(lastHeight / ITEMS_PER_PAGE)
        blocks.value = await prepareBlocks(blockMetas)

        maxHeight.value = lastHeight
        minHeight.value = lastHeight - ITEMS_PER_PAGE
      } catch (error) {
        handleError(error as Error)
      }
    }

    const getBLocks = async (): Promise<void> => {
      try {
        const { lastHeight, blockMetas } = await callers.getBlockchain(
          minHeight.value,
          maxHeight.value
        )

        lastBlockHeight.value = lastHeight
        totalPages.value = Math.ceil(lastHeight / ITEMS_PER_PAGE)
        blocks.value = await prepareBlocks(blockMetas)
      } catch (error) {
        handleError(error as Error)
      }
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
    }
  },
})
</script>
