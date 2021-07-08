<template>
  <div class="blocks-container">
    <div class="data-sources view-main">
      <div class="mg-b16 mg-t32">
        <h2 class="view-title" title="some blocks">Blocks</h2>
      </div>
      <div class="mg-b16 mg-t16">
        <p>{{ blocks?.length }} blocks found</p>
      </div>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell" data-tooltip="">
            <span class="app-table__cell-txt"> Block </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Date and time </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transactions </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Validator </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Reward </span>
          </div>
        </div>
        <template v-if="filteredBlocks?.length">
          <div
            v-for="item in filteredBlocks"
            :key="item.id"
            class="data-sources__table-row app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__header">Block</span>
              <router-link :to="`/blocks/${item.header.height}`">
                <TitledLink
                  class="app-table__cell-txt"
                  :text="item.header.height"
                />
              </router-link>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Date and time</span>
              <div>
                <div class="info-value">
                  {{ convertToTime(item.header.time) }}
                </div>
                <div class="info-value">
                  {{ convertToDate(item.header.time) }}
                </div>
              </div>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Transactions</span>
              <TitledSpan class="app-table__cell-txt" :text="item.num_txs" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Validator</span>
              <TitledLink
                class="app-table__cell-txt"
                :text="
                  '0x' + toHexFunc(item.header.validatorsHash).toUpperCase()
                "
              />
              <div class="tooltip">
                {{ '0x' + toHexFunc(item.header.validatorsHash).toUpperCase() }}
              </div>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Reward</span>
              <div>
                <TitledSpan
                  class="app-table__cell-txt"
                  :text="item.block_size"
                />
                <span class="currency">{{ item.header.chainId }}</span>
              </div>
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
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { toHex } from '@cosmjs/encoding'
import TitledSpan from '@/components/TitledSpan.vue'
import TitledLink from '@/components/TitledLink.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

export default defineComponent({
  components: { TitledSpan, TitledLink, VPagination },
  setup() {
    const blocks = ref()
    const filteredBlocks = ref()
    const blocksPerPage = 5
    const page = ref(1)
    const totalPages = ref()
    const toHexFunc = toHex

    const getBLocks = async () => {
      const response = await callers.getClient()

      response
        .blockchain(100, 500)
        .then((res) => {
          blocks.value = [...res.blockMetas]
          totalPages.value = Math.ceil(blocks.value.length / blocksPerPage)
        })
        .then(() => filterBlocks(page.value))

      response.blockResults(911).then((res) => console.log(res))

      response.block(911).then((res) => console.log(res))
    }

    const filterBlocks = async (newPage: number) => {
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

    const updateHandler = (num: number) => {
      filterBlocks(num)
    }

    const convertToTime = (time: string) => {
      const someTime = new Date(time)

      const minutes =
        someTime.getMinutes() > 9
          ? someTime.getMinutes()
          : '0' + someTime.getMinutes()
      const hours =
        someTime.getHours() > 9
          ? someTime.getHours()
          : '0' + someTime.getHours()

      return `${hours}:${minutes}`
    }

    const convertToDate = (time: string) => {
      const someTime = new Date(time)

      const day =
        someTime.getDay() > 9 ? someTime.getDay() : '0' + someTime.getDay()
      const month =
        1 + someTime.getMonth() > 9
          ? 1 + someTime.getMonth()
          : '0' + (1 + someTime.getMonth())
      const year =
        someTime.getFullYear() > 9
          ? someTime.getFullYear()
          : '0' + someTime.getFullYear()

      return `${day}:${month}:${year}`
    }

    onMounted(() => {
      getBLocks()
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

<style scoped lang="scss">
* {
  font-family: 'SF Display';
}
.data-sources__table-head,
.data-sources__table-row {
  grid:
    auto /
    repeat(5, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(5, minmax(4rem, 1fr)) / auto;
  }
}

.blocks-container {
  border-top: 1px solid var(--clr__table-border);
}

.app-table__row {
  padding: 3.2rem 0 2rem;

  @media screen and (max-width: 992px) {
    padding: 1.6rem 0 0 0;
  }
}

.app-table__cell {
  position: relative;
}

.app-table__cell-txt {
  max-width: 200px;

  @media screen and (max-width: 600px) {
    max-width: 150px;
  }
}

.view-title {
  font-weight: 400;
  font-size: 32px;

  @media screen and (max-width: 600px) {
    font-size: 28px;
  }
}

.app-table__cell-txt:hover + .tooltip {
  opacity: 1;
}

.tooltip {
  opacity: 0;
  position: absolute;
  left: 0;
  bottom: 100%;
  transform: translateY(-50%);
  transition: all 0.15s ease;
  border-radius: 10px;
  white-space: nowrap;
  background: var(--clr__tooltip-new);
  padding: 12px 24px;
  color: #fff;
  z-index: 1;
  pointer-events: none;

  &:before {
    content: '';
    border-top: 10px solid var(--clr__tooltip-new);
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    position: absolute;
    left: 20px;
    top: 100%;
    transform: translateY(-50%);
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
}

.currency {
  text-transform: uppercase;
}

.app-table__head {
  @media screen and (max-width: 992px) {
    display: none;
  }
}

.app-table__header {
  display: none;

  @media screen and (max-width: 992px) {
    display: inline-block;
    width: 200px;
  }
}
</style>
<style lang="scss">
.pagination-wrapper {
  display: flex;
  justify-content: center;

  li {
    background: #fff;
    border: 1px solid var(--clr__action);
    border-radius: 4px;
    margin: 0 4px;
    min-width: 26px;
    height: 36px;
  }

  button {
    height: 100%;
    width: 100%;
    border: none;
    margin: 0;
    padding: 10px;
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
