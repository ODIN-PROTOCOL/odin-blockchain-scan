<template>
  <div class="app__main-view top-accounts">
    <div class="app__main-view-table-header">
      <div class="app__main-view-table-header-prefix">
        <span>Ta</span>
      </div>
      <div class="app__main-view-table-header-info">
        <h3 class="app__main-view-table-header-info-title">Top accounts</h3>
        <skeleton-loader
          v-if="isLoading"
          width="100"
          height="24"
          pill
          shimmer
        />
        <span v-else class="app__main-view-table-header-info-count">
          {{ accounts.length.toLocaleString() }} accounts found
        </span>
      </div>
    </div>
    <div class="app-table top-accounts__table">
      <div class="app-table__head top-accounts__table-head">
        <span>Rank</span>
        <span>Address</span>
        <span>ODIN balance</span>
        <span>ODIN token percentage</span>
        <span>Transaction count</span>
      </div>
      <template v-if="accounts?.length">
        <AccountsLine
          v-for="(item, index) in filteredAccounts"
          :key="index"
          :account="item"
          :rank="(+currentPage - 1) * +ITEMS_PER_PAGE + (index + 1)"
        />
      </template>
      <template v-else>
        <SkeletonTable
          v-if="isLoading"
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
      v-if="accounts.length > ITEMS_PER_PAGE"
      class="mg-t32"
      v-model="currentPage"
      :pages="totalPages"
      @update:modelValue="filterAccounts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { callers } from '@/api/callers'
import { TempBalanceType } from '@/helpers/Types'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import AccountsLine from '@/components/AccountsLine.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 20
const accounts = ref<Array<TempBalanceType>>([])
const filteredAccounts = ref<Array<TempBalanceType>>([])
const currentPage = ref<number>(1)
const totalPages = ref<number>(0)
const headerTitles = [
  { title: 'Rank' },
  { title: 'Address' },
  { title: 'ODIN balance' },
  { title: 'ODIN token percentage' },
  { title: 'Transaction count' },
]

const getAccounts = async (): Promise<void> => {
  lockLoading()
  try {
    accounts.value = await callers.getTopAccounts().then(resp => resp.json())
    totalPages.value = Math.ceil(accounts.value.length / ITEMS_PER_PAGE)
    await filterAccounts(currentPage.value)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const filterAccounts = async (newPage: number): Promise<void> => {
  let tempArr = accounts.value
  if (newPage === 1) {
    filteredAccounts.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
  } else {
    filteredAccounts.value = tempArr?.slice(
      (newPage - 1) * ITEMS_PER_PAGE,
      (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE,
    )
  }
  currentPage.value = newPage
}

onMounted(async (): Promise<void> => {
  await getAccounts()
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
