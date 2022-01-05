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
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { toHexFunc } from '@/helpers/helpers'
import TitledLink from '@/components/TitledLink.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'
import { convertToTime, convertToDate } from '@/helpers/dates'

export default defineComponent({
  name: 'Blocks',
  components: { TitledLink, VPagination },
  setup() {
    const blocks = ref()
    const filteredBlocks = ref()
    const blocksPerPage = 5
    const page = ref<number>(1)
    const totalPages = ref<number>()

    const getBLocks = async (): Promise<void> => {
      const { blockMetas } = await callers.getBlockchain()
      blocks.value = [...blockMetas]
      totalPages.value = Math.ceil(blocks.value.length / blocksPerPage)
      filterBlocks(page.value)
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
      page.value = newPage
    }

    const updateHandler = (num: number): void => {
      filterBlocks(num)
    }

    onMounted(async (): Promise<void> => {
      await getBLocks()
    })

    return {
      blocks,
      page,
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

<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 0.1rem solid var(--clr__action);
    border-radius: 0.4rem;
    margin: 0 0.4rem;
    min-width: 2.6rem;
    height: 3.6rem;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 1rem;
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
