<template>
  <div class="app__main-view top-accounts">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Top accounts</h2>
    </div>
    <div class="top-accounts__sort-wrapper">
      <skeleton-loader
        v-if="isLoading || isSupplyLoading"
        pill
        shimmer
        :height="24"
        width="100"
      />
      <p v-else class="top-accounts__sort-info">
        {{ totalAccounts }} accounts found
      </p>
    </div>
    <div class="app-table top-accounts__table">
      <div class="app-table__head top-accounts__table-head">
        <span>Rank</span>
        <span>Address</span>
        <span>ODIN balance</span>
        <span>Delegated Amount</span>
        <span>Total Amount</span>
        <span>ODIN token percentage</span>
        <span>Transaction count</span>
      </div>
      <template v-if="accounts?.length">
        <AccountsLine
          v-for="(item, index) in accounts"
          :key="index"
          :account="item"
          :odin-supply="odinSupply"
          :rank="(+currentPage - 1) * +ITEMS_PER_PAGE + (index + 1)"
        />
      </template>
      <template v-else>
        <SkeletonTable
          v-if="isLoading || isSupplyLoading"
          :header-titles="headerTitles"
          table-size="10"
          class-string="accounts-line"
        />
        <div v-else class="app-table__empty-stub">
          <p class="empty mg-t32">No items yet</p>
        </div>
      </template>
    </div>
    <AppPagination
      v-if="totalAccounts > ITEMS_PER_PAGE"
      class="mg-t32"
      v-model="currentPage"
      :pages="totalPages"
      @update:modelValue="updateHandler"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { TempBalanceType, Coin } from '@/helpers/Types'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { useQuery } from '@vue/apollo-composable'
import { SupplyQuery } from '@/graphql/queries'
import { SupplyResponse } from '@/graphql/types'
import AccountsLine from '@/components/AccountsLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 50
const accounts = ref<TempBalanceType[]>([])
const totalSupply = ref<Coin[]>([])
const odinSupply = ref<Coin>({ denom: 'loki', amount: '0' })
const totalPages = ref(1)
const totalAccounts = ref(0)
const currentPage = ref(1)

const headerTitles = [
  { title: 'Rank' },
  { title: 'Address' },
  { title: 'ODIN balance' },
  { title: 'Delegated Amount' },
  { title: 'Total Amount' },
  { title: 'ODIN token percentage' },
  { title: 'Transaction count' },
]
const {
  result,
  loading: isSupplyLoading,
  onResult,
  refetch,
} = useQuery<SupplyResponse>(SupplyQuery)

const getAccounts = async (): Promise<void> => {
  lockLoading()
  try {
    const data = await callers
      .getTopAccounts(ITEMS_PER_PAGE, (currentPage.value - 1) * ITEMS_PER_PAGE)
      .then(res => res.data)
    accounts.value = data.accounts
    totalAccounts.value = data.total_count
    totalPages.value = Math.ceil(totalAccounts.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getAccountOdinPercentage = () => {
  odinSupply.value = totalSupply.value.find(
    (item: Coin) => item.denom === 'loki',
  ) || { denom: 'loki', amount: '0' }
}

const updateHandler = async () => {
  accounts.value = []
  await refetch()
}

onResult(async (): Promise<void> => {
  if (result.value?.supply.length) {
    totalSupply.value = result.value?.supply[0].coins
    getAccountOdinPercentage()
  }
  await getAccounts()
})

onMounted(async (): Promise<void> => {
  await refetch()
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
