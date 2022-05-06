<template>
  <div class="app__main-view top-accounts">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Top accounts</h2>
    </div>
    <div class="top-accounts__sort-wrapper">
      <p class="top-accounts__sort-info" v-if="accounts?.length">
        {{ accounts.length }} accounts found
      </p>
    </div>
    <template v-if="filteredAccounts?.length">
      <div class="app-table top-accounts__table">
        <div class="app-table__head top-accounts__table-head">
          <span> Rank </span>
          <span> Address </span>
          <span> ODIN balance </span>
          <span> ODIN token percentage </span>
          <span> Transaction count </span>
        </div>
        <AccountsLine
          v-for="(item, index) in filteredAccounts"
          :key="index"
          :account="item"
          :totalOdin="totalOdin"
          :rank="(+currentPage - 1) * +ITEMS_PER_PAGE + (index + 1)"
        />
      </div>
      <AppPagination
        v-if="accounts.length > ITEMS_PER_PAGE"
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="filterAccounts"
      />
    </template>
    <template v-else>
      <div class="empty">Waiting to receive data</div>
    </template>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import AccountsLine from '@/components/AccountsLine.vue'
import { defineComponent, ref, onMounted } from 'vue'
import { Pagination } from '@/api/query-ext/telemetryExtension'
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin'
import { TempBalanceType } from '@/helpers/Types'
import { getTopAccountList } from '@/helpers/Accounts'

import AppPagination from '@/components/AppPagination/AppPagination.vue'

export default defineComponent({
  name: 'top-accounts',
  components: { AppPagination, AccountsLine },
  setup() {
    const ITEMS_PER_PAGE = 20
    const pagination: Pagination = new Pagination(0, 100, true, true)
    const accounts = ref<Array<TempBalanceType>>()
    const filteredAccounts = ref<Array<TempBalanceType>>()
    const currentPage = ref<number>(1)
    const totalPages = ref<number>()
    const totalOdin = ref<number>(0)
    const totalCurrency = ref<Array<Coin> | null>(null)
    const getAccounts = async (): Promise<void> => {
      totalCurrency.value =
        (await callers.getUnverifiedTotalSupply()) as Array<Coin>
      totalOdin.value = Number(
        totalCurrency.value.find((el) => el.denom === 'loki')?.amount
      )
      accounts.value = await getTopAccountList(pagination)
      accounts.value.sort((a, b) => b.odinBalance - a.odinBalance)
      for (const a of accounts.value) {
        const { txs } = await callers.getTxSearch({
          query: `message.sender='${a.address}'`,
        })
        a.total_tx = txs?.length || 0
      }
      totalPages.value = Math.ceil(accounts.value.length / ITEMS_PER_PAGE)
      try {
        await filterAccounts(currentPage.value)
      } catch (err) {
        console.error(err)
      }
    }

    const filterAccounts = async (newPage: number): Promise<void> => {
      let tempArr = accounts.value

      if (newPage === 1) {
        filteredAccounts.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredAccounts.value = tempArr?.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    onMounted(async (): Promise<void> => {
      await getAccounts()
    })

    return {
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      filteredAccounts,
      filterAccounts,
      accounts,
      totalOdin,
    }
  },
})
</script>

<style scoped lang="scss">
.top-accounts__sort-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3.2rem;
}
.top-accounts__sort-field {
  display: flex;
  align-items: center;
}
.top-accounts__table-head {
  grid:
    auto /
    minmax(2rem, 0.5fr)
    minmax(8rem, 5fr)
    minmax(8rem, 2fr)
    minmax(8rem, 2fr)
    minmax(8rem, 1.5fr);
}
@include respond-to(tablet) {
  .top-accounts__table-head {
    grid: none;
  }
}
@include respond-to(small) {
  .top-accounts__sort-wrapper {
    flex-direction: column;
    align-items: flex-start;
    & > p {
      margin-bottom: 3.2rem;
    }
  }
}
</style>
