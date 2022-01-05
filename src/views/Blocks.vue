<template>
  <div class="container">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Blocks</h2>
    </div>
    <div class="mg-b16 mg-t16" v-if="filteredBlocks?.length">
      <p>{{ blocks?.length }} blocks found</p>
    </div>
    <div class="app-table">
      <div class="app-table__head">
        <span> Block </span>
        <span> Date and time </span>
        <span> Transactions </span>
        <span> Validator </span>
      </div>
      <template v-if="filteredBlocks?.length">
        <div
          v-for="item in filteredBlocks"
          :key="item.id"
          class="app-table__row"
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
            <div>
              <div>
                {{ convertToTime(item.header.time) }}
              </div>
              <div>
                {{ convertToDate(item.header.time) }}
              </div>
            </div>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Transactions</span>
            <span class="app-table__cell-txt">{{ item.num_txs }}</span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__title">Validator</span>
            <TitledLink
              class="app-table__cell-txt app-table__link"
              :text="toHexFunc(item.header.validatorsHash).toUpperCase()"
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
import { defineComponent, ref, onMounted } from 'vue'
import { convertToTime, convertToDate } from '@/helpers/dates'
import Pagination from '@/components/pagination/Pagination.vue'

export default defineComponent({
  name: 'blocks',
  components: { TitledLink, Pagination },
  setup() {
    const blocks = ref()
    const filteredBlocks = ref()
    const blocksPerPage = 5
    const currentPage = ref<number>(1)
    const totalPages = ref<number>()

    const getBLocks = async (): Promise<void> => {
      const { blockMetas } = await callers.getBlockchain()
      blocks.value = [...blockMetas]
      totalPages.value = Math.ceil(blocks.value.length / blocksPerPage)
      filterBlocks(currentPage.value)
    }

    const filterBlocks = (newPage: number): void => {
      let tempArr = blocks.value

      if (newPage === 1) {
        filteredBlocks.value = tempArr.slice(0, newPage * blocksPerPage)
      } else {
        filteredBlocks.value = tempArr.slice(
          (newPage - 1) * blocksPerPage,
          (newPage - 1) * blocksPerPage + blocksPerPage
        )
      }
      currentPage.value = newPage
    }

    const updateHandler = (num: number): void => {
      filterBlocks(num)
    }

    onMounted(async (): Promise<void> => {
      await getBLocks()
    })

    return {
      blocks,
      currentPage,
      totalPages,
      filteredBlocks,
      filterBlocks,
      updateHandler,
      convertToTime,
      convertToDate,
      toHexFunc,
    }
  },
})
</script>
