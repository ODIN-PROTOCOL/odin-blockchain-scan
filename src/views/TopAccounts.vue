<template>
  <div
    class="app__main-view top-accounts"
    :class="{ 'load-fog_show': isLoading && transactions?.length }"
  >
    <div class="app__main-view-title-wrapper">
      <h2 class="app__main-view-title">Top accounts</h2>
    </div>
    <div class="top-accounts__sort-wrapper">
      <p class="top-accounts__sort-info" v-if="accounts?.length">
        {{ accounts.length }} accounts found
      </p>
    </div>
    <div class="app-table top-accounts__table">
      <div class="app-table__head top-accounts__table-head">
        <span> Rank </span>
        <span> Address </span>
        <span> ODIN balance </span>
        <span> ODIN token percentage </span>
        <span> Transaction count </span>
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
        <div>
          <p v-if="isLoading" class="empty mg-t32">Waiting to receive data</p>
          <p v-else class="empty mg-t32">No items yet</p>
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

export default defineComponent({
  name: 'TopAccounts',
  components: { AppPagination, AccountsLine },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 20
    const accounts = ref<Array<TempBalanceType>>([])
    const filteredAccounts = ref<Array<TempBalanceType>>([])
    const currentPage = ref<number>(1)
    const totalPages = ref<number>(0)
    const getAccounts = async (): Promise<void> => {
      lockLoading
      try {
        accounts.value = await callers
          .getTopAccounts()
          .then((resp) => resp.json())
        totalPages.value = Math.ceil(accounts.value.length / ITEMS_PER_PAGE)
        await filterAccounts(currentPage.value)
      } catch (err) {
        console.error(err)
      }
      releaseLoading
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
      accounts,
      isLoading,
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
