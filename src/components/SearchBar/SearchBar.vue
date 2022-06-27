<template>
  <div class="search-bar">
    <div class="search-bar__row">
      <VuePicker
        class="app-form__field-input app-filter app-filter--rounding-left _vue-picker"
        name="filter"
        v-model="activeFilter"
      >
        <template #dropdownInner>
          <div class="_vue-picker__dropdown-custom">
            <VuePickerOption
              v-for="(filter, index) in filters"
              :key="index"
              :value="filter"
              :text="filter"
            >
              {{ filter }}
            </VuePickerOption>
          </div>
        </template>
      </VuePicker>
      <div class="search-bar__input-wrapper">
        <input
          class="search-bar__input"
          :placeholder="inputPlaceholder"
          v-model="searchedText"
          @keydown.enter="searchBy()"
        />
        <template v-if="searchedText">
          <button @click="clearText" class="search-bar__clear">
            <img src="~@/assets/icons/close.svg" alt="reset" />
          </button>
        </template>
        <template v-if="searchResult">
          <div class="search-bar__dropdown">
            <template v-for="(result, idx) in searchResult" :key="idx">
              <template v-if="result.blocks?.length !== 0">
                <BlockResultItem
                  v-for="block in result.blocks"
                  :result="block"
                  :key="block.header.height"
                />
              </template>
              <template v-if="result.transactions?.length !== 0">
                <TransactionItem
                  v-for="transaction in result.transactions"
                  :result="transaction"
                  :key="transaction.height"
                />
              </template>
              <template v-if="result.accounts?.length !== 0">
                <AccountItem
                  v-for="accounts in result.accounts"
                  :result="accounts"
                  :key="accounts"
                />
              </template>
              <template
                v-if="
                  !result.transactions?.length &&
                  !result.blocks?.length &&
                  !result.accounts?.length
                "
              >
                <div class="search-bar__dropdown-empty-msg">
                  <span>Does not match any result!</span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
      <button @click.prevent="searchBy" class="search-bar__btn">
        <img src="~@/assets/icons/search.svg" alt="search" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import { isMobile, prepareTransaction } from '@/helpers/helpers'
import { Router, useRouter } from 'vue-router'
import BlockResultItem from '@/components/SearchBar/BlockResultItem.vue'
import TransactionItem from '@/components/SearchBar/TransactionItem.vue'
import AccountItem from '@/components/SearchBar/AccountItem.vue'
import {
  DecodedTxData,
  SearchResultType,
  TempSearchAccountInfoType,
  TransformedBlocks,
} from '@/helpers/Types'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { prepareBlocks } from '@/helpers/blocksHelper'

export default defineComponent({
  name: 'SearchBar',
  components: { BlockResultItem, TransactionItem, AccountItem },
  setup: function () {
    const filters = ref<Array<string>>([
      'All Filters',
      'Block',
      'Tx hash',
      'Account',
    ])
    const inputPlaceholder = computed(() =>
      isMobile() ? 'Search' : 'Searching by account address, block, Tx hash'
    )
    const activeFilter = ref<string>(filters.value[0])
    const searchedText = ref<string | null>('')
    const searchResult = ref<Array<SearchResultType> | null>(null)
    watch(activeFilter, () => {
      searchResult.value = null
    })

    const getTransactions = async (): Promise<Array<DecodedTxData>> => {
      const TRANSACTION_HASH_LENGTH = 64
      const transactionToSearch = String(searchedText.value)
      if (
        !transactionToSearch ||
        transactionToSearch.length < TRANSACTION_HASH_LENGTH
      ) {
        return []
      }

      try {
        const res = await callers.getTxForTxDetailsPage(
          String(transactionToSearch)
        )
        return await prepareTransaction([res.data.result])
      } catch {
        return []
      }
    }

    const getAccount = async (): Promise<Array<TempSearchAccountInfoType>> => {
      const ACCOUNT_LENGTH = 43
      const accountToSearch = String(searchedText.value)
      if (
        !accountToSearch ||
        !accountToSearch.startsWith('odin') ||
        accountToSearch.length < ACCOUNT_LENGTH
      ) {
        return []
      }
      try {
        const geoBalance = await callers.getUnverifiedBalances(
          accountToSearch,
          'minigeo'
        )
        const odinBalance = await callers.getUnverifiedBalances(
          accountToSearch,
          'loki'
        )
        return [
          {
            address: accountToSearch,
            geoBalance: { ...geoBalance },
            odinBalance: { ...odinBalance },
          },
        ]
      } catch {
        return []
      }
    }

    const getBlock = async (): Promise<Array<TransformedBlocks>> => {
      try {
        const { blockMetas } = await callers.getBlockchain(
          Number(searchedText.value),
          Number(searchedText.value)
        )
        return await prepareBlocks(blockMetas)
      } catch {
        return []
      }
    }

    const searchBy = async (): Promise<Array<SearchResultType> | null> => {
      if (searchedText.value === '') return (searchResult.value = null)
      try {
        if (activeFilter.value === 'Blocks') {
          return (searchResult.value = [
            {
              blocks: await getBlock(),
            },
          ])
        }
        if (activeFilter.value === 'Transaction') {
          return (searchResult.value = [
            {
              transactions: await getTransactions(),
            },
          ])
        }
        if (activeFilter.value === 'Account') {
          return (searchResult.value = [
            {
              accounts: await getAccount(),
            },
          ])
        }
        searchResult.value = [
          {
            blocks: await getBlock(),
            transactions: await getTransactions(),
            accounts: await getAccount(),
          },
        ]
      } catch (error) {
        handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
        searchResult.value = null
      }
      return null
    }

    const clearText = (): void => {
      searchedText.value = ''
    }

    const router: Router = useRouter()
    router.beforeEach(() => {
      searchResult.value = null
    })

    return {
      filters,
      activeFilter,
      searchedText,
      searchBy,
      searchResult,
      diffDays,
      cropText,
      getDay,
      inputPlaceholder,
      clearText,
    }
  },
})
</script>
<style lang="scss" scoped>
.search-bar {
  padding: 1.2rem 0 2.4rem;

  &__input-wrapper {
    width: 39.6rem;
    position: relative;
    border-radius: none;
  }
  &__dropdown {
    position: absolute;
    background: white;
    border: 0.1rem solid var(--clr__input-border);
    border-radius: 0 0 0.8rem 0.8rem;
    width: 100%;
    z-index: 2;
    @media (max-width: 48rem) {
      left: 0;
    }
  }
  &__dropdown-empty-msg {
    display: flex;
    justify-content: center;
    padding: 1rem;
    color: var(--clr__text-muted);
  }
  &__row {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}

.search-bar__input {
  height: 4.8rem;
  padding: 1.2rem 1.5rem;
  width: 100%;
  max-width: 42.6rem;
  border: 0.1rem solid var(--clr__input-border);
  border-left: transparent;
  border-right: transparent;
  border-radius: 0;
  &::placeholder {
    color: var(--clr__text-muted);
  }
  &::-webkit-search-cancel-button {
    display: none;
  }
}
.search-bar__btn {
  width: 4.8rem;
  height: 4.8rem;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  background: var(--clr__action);
  border-top-right-radius: 0.4rem;
  border-bottom-right-radius: 0.4rem;

  img {
    width: 1.8rem;
    height: 1.8rem;
    display: block;
  }
}

.search-bar__clear {
  overflow: visible;
  position: absolute;
  right: 1rem;
  top: 1.2rem;
}
@include respond-to(tablet) {
  .search-bar__input {
    &::placeholder {
      font-size: 1.4rem;
    }
  }
}
</style>
odinvaloper1cgfdwtrqfdrzh4z8rkcyx8g4jv22v8wgav3rjx
