<template>
  <div class="app__container">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Blocks</h2>
    </div>
    <div class="mg-b16 mg-t16">
      <skeleton-loader
        v-if="isLoading"
        :height="24"
        rounded
        animation="wave"
        color="rgb(225, 229, 233)"
      />
      <p v-else>{{ blocksCount }} blocks found</p>
    </div>
    <div class="app-table blocks-list__table">
      <div class="app-table__head blocks-list__table-head">
        <span>Block</span>
        <span>Date and time</span>
        <span>Transactions</span>
        <span>Validator</span>
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
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            table-size="10"
            class-string="blocks-list__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
      <AppPagination
        v-if="blocksCount > ITEMS_PER_PAGE"
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
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { START_VALUE } from '@/api/api-config'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import SkeletonTable from '@/components/SkeletonTable.vue'
import { Router, useRouter } from 'vue-router'
import { setPage } from '@/router'

export default defineComponent({
  name: 'BlocksList',
  components: { TitledLink, AppPagination, SkeletonTable },
  setup() {
    const router: Router = useRouter()
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

    const headerTitles = [
      { title: 'Block' },
      { title: 'Date and time' },
      { title: 'Transactions' },
      { title: 'Validator' },
    ]
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
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const getBLocks = async (): Promise<void> => {
      lockLoading()
      try {
        blocks.value = []
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
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const updateHandler = async (num: number) => {
      setPage(num)
      minHeight.value = lastBlockHeight.value - num * ITEMS_PER_PAGE
      maxHeight.value = minHeight.value + ITEMS_PER_PAGE
      if (minHeight.value < MIN_POSSIBLE_BLOCK_HEIGHT) {
        minHeight.value = MIN_POSSIBLE_BLOCK_HEIGHT
      }
      await getBLocks()
    }

    onMounted(async (): Promise<void> => {
      if (router.currentRoute.value.query.page) {
        currentPage.value = Number(router.currentRoute.value.query.page)
      } else {
        setPage(currentPage.value)
      }
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
      headerTitles,
    }
  },
})
</script>
<style lang="scss" scoped></style>
