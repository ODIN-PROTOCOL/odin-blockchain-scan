<template>
  <div class="blocks-container">
    <div class="data-sources view-main">
      <div class="mg-b16 mg-t32">
        <h2 class="view-title" title="some blocks">Top accounts</h2>
      </div>
      <div class="mg-b16 mg-t16 accounts-header__wrapper">
        <p>{{ accounts?.length }} accounts found</p>
        <div class="sort-wrapper">
          <span>Sort By</span>
          <select
            name=""
            id="sort_account"
            class="sort-select"
            v-model="sortingValue"
            @change="sortAccounts"
          >
            <option value="geo" >Geo balance</option>
            <option value="odin">ODIN balance</option>
          </select>
        </div>
      </div>
      <div class="app-table">
        <div class="data-sources__table-head app-table__head">
          <div class="app-table__cell" data-tooltip="">
            <span class="app-table__cell-txt"> Rank </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Address </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> GEO balance </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> GEO token percentage </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> ODIN balance </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> ODIN token percentage </span>
          </div>
          <div class="app-table__cell">
            <span class="app-table__cell-txt"> Transaction count </span>
          </div>
        </div>
        <template v-if="filteredAccounts?.length">
          <AccountsLine
            v-for="(item, index) in filteredAccounts"
            :key="index"
            :account="item"
            :geo="totalGeo"
            :odin="totalOdin"
            :rank="((+page - 1) * +itemsPerPage) + ( index + 1 )"
          />
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
import AccountsLine from '@/components/AccountsLine.vue'
import { defineComponent, ref, onMounted } from 'vue'
import VPagination from '@hennge/vue3-pagination'
import '@hennge/vue3-pagination/dist/vue3-pagination.css'

import { QueryClient, setupBankExtension }  from '@cosmjs/stargate'
import { Tendermint34Client } from '@cosmjs/tendermint-rpc'
import { API_CONFIG } from '../api/api-config'
import {Pagination, setupTelemetryExtension } from '@/helpers/telemetryExtension'
// import {setupTelemetryExtension} from '@/helpers/telemetryExtension'

export default defineComponent({
  components: { VPagination, AccountsLine },
  setup() {
    const accounts = ref()
    const filteredAccounts = ref()
    const itemsPerPage = 5
    const page = ref(1)
    const totalPages = ref()
    const toHexFunc = toHex
    const sortingValue = ref()
    const totalOdin = ref(0)
    const totalGeo = ref(0)


    const getAccounts = async () => {

      const client = QueryClient.withExtensions(
        await Tendermint34Client.connect(API_CONFIG.rpc),
        setupTelemetryExtension,
        setupBankExtension
      );

      const pagination = new Pagination(0, 100, true);
      
      const totalCurrency = await client['bank'].unverified.totalSupply()

      totalCurrency.forEach(el => {
        if (el.denom === 'loki'){
          totalOdin.value = +el.amount
        } else if (el.denom === 'minigeo') {
          totalGeo.value = +el.amount
        }
      });
      
      
      const balances =  await client['telemetry'].unverified.topBalances('odin', pagination);

      const tempBalances:{ address: string, geoBalance: number, odinBalance: number  }[] = []
      balances.balances.forEach(el => {
        const tempBalanceItem = {
          address: '',
          geoBalance: 0,
          odinBalance: 0
        }
        tempBalanceItem.address = el.address

        if(el.coins.length) {
          el.coins.forEach(curr => {
            if (curr.denom === 'loki'){
              tempBalanceItem.odinBalance = +curr.amount
            } else if (curr.denom === 'minigeo') {
              tempBalanceItem.geoBalance = +curr.amount
            }
          });
        }

        tempBalances.push(tempBalanceItem)
        
      
      });

      accounts.value = tempBalances
      totalPages.value = Math.ceil(accounts.value.length / itemsPerPage)

      sortingValue.value = 'geo'
      try {
        await sortAccounts()
      } catch (err) {
        console.log(err)
      }

      try {
        await filterAccounts(page.value)
      } catch (err) {
        console.log(err)
      }
    }

    const filterAccounts = async (newPage: number) => {
      let tempArr = accounts.value

      if (newPage === 1) {
        filteredAccounts.value = tempArr.slice(0, newPage * itemsPerPage)
      } else {
        filteredAccounts.value = tempArr.slice(
          (newPage - 1) * itemsPerPage,
          (newPage - 1) * itemsPerPage + itemsPerPage
        )
      }

      page.value = newPage
    }

    const updateHandler = (num: number) => {
      filterAccounts(num)
    }

    const sortAccounts = async () => {
      filteredAccounts.value = []
      let tempAcc = []

      if (sortingValue.value === 'geo') {
        tempAcc = accounts.value.sort(
          (a: any, b: any) => b.geoBalance - a.geoBalance
        )
      } else if (sortingValue.value === 'odin') {
        tempAcc = accounts.value.sort(
          (a: any, b: any) => b.odinBalance - a.odinBalance
        )
      }

      accounts.value = tempAcc
      filterAccounts(1)
    }

    onMounted(() => {
      getAccounts()
    })

    return {
      accounts,
      page,
      totalPages,
      filteredAccounts,
      updateHandler,
      toHexFunc,
      sortAccounts,
      sortingValue,
      totalGeo,
      totalOdin,
      itemsPerPage
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
    repeat(7, minmax(4rem, 1fr));

  @media screen and (max-width: 992px) {
    grid: repeat(7, minmax(4rem, 1fr)) / auto;
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
    width: 170px;
  }
}

.accounts {
  &-header {
    &__wrapper {
      display: flex;
      justify-content: space-between;

      @media screen and (max-width: 600px) {
        flex-direction: column;

        & > p {
          margin-bottom: 3.2rem;
        }
      }
    }
  }
}

.sort {
  &-select {
    border: none;
    margin-left: 16px;
    min-width: 150px;
    width: 100%;

    &:focus {
      border: none;
      outline: none;
    }

    option:checked {
      background-color: var(--clr__action);
    }

    @media screen and (max-width: 600px) {
      margin-left: 0;
    }
  }

  &-wrapper {
    display: flex;

    span {
      white-space: nowrap;
    }

    @media screen and (max-width: 600px) {
      flex-direction: column;
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
