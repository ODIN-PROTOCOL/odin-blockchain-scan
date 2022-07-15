<template>
  <div class="app__main-view top-accounts">
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Top accounts</h2>
    </div>
    <div class="top-accounts__sort-wrapper">
      <skeleton-loader
        v-if="isLoading"
        :height="24"
        rounded
        animation="wave"
        color="rgb(225, 229, 233)"
      />
      <p v-else class="top-accounts__sort-info">
        {{ accounts.length }} accounts found
      </p>
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

<script lang="ts">
import { callers } from '@/api/callers'
import AccountsLine from '@/components/AccountsLine.vue'
import { defineComponent, ref, onMounted } from 'vue'
import { TempBalanceType } from '@/helpers/Types'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import SkeletonTable from '@/components/SkeletonTable.vue'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { Router, useRouter } from 'vue-router'
import { setPage } from '@/router'

export default defineComponent({
  name: 'TopAccounts',
  components: { AppPagination, AccountsLine, SkeletonTable },
  setup() {
    const router: Router = useRouter()
    const { page } = router.currentRoute.value.query
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 50
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
        accounts.value = await callers
          .getTopAccounts()
          .then((resp) => resp.json())
        totalPages.value = Math.ceil(accounts.value.length / ITEMS_PER_PAGE)
        await filterAccounts(currentPage.value)
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
      }
      releaseLoading()
    }

    const filterAccounts = async (newPage: number): Promise<void> => {
      if (totalPages.value < newPage) {
        newPage = 1
      }
      currentPage.value = newPage
      setPage(currentPage.value)
      let tempArr = accounts.value
      if (newPage === 1) {
        filteredAccounts.value = tempArr?.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredAccounts.value = tempArr?.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
    }

    onMounted(async (): Promise<void> => {
      if (page && Number(page) > 1) {
        currentPage.value = Number(page)
      } else {
        setPage(currentPage.value)
      }
      await getAccounts()
    })

    return {
      ITEMS_PER_PAGE,
      totalPages,
      currentPage,
      filteredAccounts,
      accounts,
      isLoading,
      headerTitles,
      filterAccounts,
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
