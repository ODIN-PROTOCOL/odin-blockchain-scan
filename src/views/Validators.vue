<template>
  <div class="blocks-container">
    <div class="data-sources view-main">
      <div>
        <div class="mg-b16 mg-t32 validators-nav">
          <h2
            class="view-title"
            @click="changeTab(true)"
            :class="showValidators ? 'active' : ''"
          >
            Validators
          </h2>
          <h2
            class="view-title"
            @click="changeTab(false)"
            :class="!showValidators ? 'active' : ''"
          >
            Delegates
          </h2>
        </div>
        <div class="mg-b16 mg-t16" v-if="showValidators">
          <p>{{ blocks?.length }} validators found</p>
        </div>
        <div class="mg-b16 mg-t16" v-if="!showValidators">
          <p>{{ blocks?.length }} delegates found</p>
        </div>
      </div>

      <div class="app-table" v-if="showValidators">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell" data-tooltip="">
            <span class="app-table__cell-txt"> Validator </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Balance </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Stake </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Delegation share </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Amount of created blocks </span>
          </div>
        </div>
        <template v-if="filteredValidators?.length">
          <div
            v-for="item in filteredValidators"
            :key="item.id"
            class="data-sources__table-row app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__header">Validator</span>
              <router-link :to="`/validators/${item.header}`">
                <TitledLink
                  class="app-table__cell-txt"
                  :text="item.operatorAddress"
                />
              </router-link>
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Balance</span>
              <!-- <div>
                <div class="info-value"> -->
              <!-- {{ convertToTime(item.header.time) }} -->
              <!-- </div>
                <div class="info-value"> -->
              <!-- {{ convertToDate(item.header.time) }} -->
              <!-- </div>
              </div> -->
              <TitledSpan class="app-table__cell-txt" :text="item.tokens" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Stake</span>
              <TitledSpan class="app-table__cell-txt" :text="item.num_txs" />
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Delegation share</span>
              <!-- <TitledLink
                class="app-table__cell-txt"
                :text="
                  '0x' + toHexFunc(item.header.validatorsHash).toUpperCase()
                "
              />
              <div class="tooltip">
                {{ '0x' + toHexFunc(item.header.validatorsHash).toUpperCase() }}
              </div> -->
              <TitledSpan
                class="app-table__cell-txt"
                :text="item.delegatorShares"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__header">Amount of created blocks</span>
              <div>
                <TitledSpan
                  class="app-table__cell-txt"
                  :text="item.block_size"
                />
                <span class="currency">{{ item.header }}</span>
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
      <div class="app-table" v-if="!showValidators">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell" data-tooltip="">
            <span class="app-table__cell-txt"> Delegate </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Balance </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Stake </span>
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
              <!-- <TitledLink
                class="app-table__cell-txt"
                :text="
                  '0x' + toHexFunc(item.header.validatorsHash).toUpperCase()
                "
              />
              <div class="tooltip">
                {{ '0x' + toHexFunc(item.header.validatorsHash).toUpperCase() }}
              </div> -->
              <!-- <TitledSpan class="app-table__cell-txt" :text="item.delegatorShares" /> -->
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

import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'

export default defineComponent({
  components: { TitledSpan, TitledLink, VPagination },
  setup() {
    const validators = ref()
    const filteredValidators = ref()
    const validatorsPerPage = 5
    const page = ref(1)
    const totalPages = ref()
    const toHexFunc = toHex
    const showValidators = ref(true)

    const getValidators = async () => {
      // const client = await callers.getClient()
      const response = await callers.getValidators('BOND_STATUS_BONDED')
      console.log(response)

      if (response && response.pagination) {
        
        validators.value = response.validators

        totalPages.value = Math.ceil(
          validators.value.length / validatorsPerPage
        )

        filterValidators(page.value)
      }
      
      const response_2 = await callers.getDelegations(
        // 'odinvaloper1plgvd70drhnd3tzm3a27pzkde7luh9hy6x7q7a'
        'odin1kcnegzq5lr7nta9r2cvv77nps9v8rkk8mdpxnh'
      )


      // console.log(validators.value)
      // console.log(totalPages.value)



      // client
      //   .blockchain(100, 500)
      //   .then((res) => {
      //     validators.value = [...res.blockMetas]
      //     totalPages.value = Math.ceil(validators.value.length / blocksPerPage)
      //   })
      //   .then(() => filterValidators(page.value))
    }

    const filterValidators = async (newPage: number) => {
      let tempArr = validators.value

      if (newPage === 1) {
        filteredValidators.value = tempArr.slice(0, newPage * validatorsPerPage)
      } else {
        filteredValidators.value = tempArr.slice(
          (newPage - 1) * validatorsPerPage,
          (newPage - 1) * validatorsPerPage + validatorsPerPage
        )
      }
      page.value = newPage
    }

    const changeTab = (state: boolean) => (showValidators.value = state)

    const updateHandler = (num: number) => {
      filterValidators(num)
    }

    // const convertToTime = (time: string) => {
    //   const someTime = new Date(time)

    //   const minutes =
    //     someTime.getMinutes() > 9
    //       ? someTime.getMinutes()
    //       : '0' + someTime.getMinutes()
    //   const hours =
    //     someTime.getHours() > 9
    //       ? someTime.getHours()
    //       : '0' + someTime.getHours()

    //   return `${hours}:${minutes}`
    // }

    // const convertToDate = (time: string) => {
    //   const someTime = new Date(time)

    //   const day =
    //     someTime.getDay() > 9 ? someTime.getDay() : '0' + someTime.getDay()
    //   const month =
    //     1 + someTime.getMonth() > 9
    //       ? 1 + someTime.getMonth()
    //       : '0' + (1 + someTime.getMonth())
    //   const year =
    //     someTime.getFullYear() > 9
    //       ? someTime.getFullYear()
    //       : '0' + someTime.getFullYear()

    //   return `${day}:${month}:${year}`
    // }

    onMounted(() => {
      getValidators()
    })

    return {
      validators,
      page,
      totalPages,
      filteredValidators,
      showValidators,
      filterValidators,
      updateHandler,
      // convertToTime,
      // convertToDate,
      toHexFunc,
      changeTab,
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
  padding-right: 20px;

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

.validators-nav {
  display: flex;

  h2 {
    width: 137px;
    // border: 1px solid #000;
    color: var(--clr__text);
    border-bottom: 2px solid rgba(0, 123, 255, 0.16);
    font-size: 2rem;
    cursor: pointer;

    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      border-bottom: 2px solid var(--clr__action);
      font-weight: 600;
    }
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
