<template>
  <div class="search">
    <div class="search__row">
      <VuePicker
        class="app-form__field-input app-filter app-filter--rounding-left"
        name="filter"
        v-model="activeFilter"
      >
        <template #dropdownInner>
          <div class="app-filter__dropdown-inner">
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
      <div class="search__input-wrapper">
        <input
          type="search"
          class="filter-search"
          placeholder="Searching by account address, block, Tx hash"
          v-model="searchedText"
        />

        <template v-if="searchResult">
          <div class="search__dropdown">
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
                <div class="search__dropdown-empty-msg">
                  <span>Does not match any result!</span>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
      <button @click.prevent="searchBy" class="search-btn">
        <img src="~@/assets/icons/search.svg" alt="search" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import { TxResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'
import { Router, useRouter } from 'vue-router'
import { fromHex } from '@cosmjs/encoding'
import BlockResultItem from '@/components/SearchBar/BlockResultItem.vue'
import TransactionItem from '@/components/SearchBar/TransactionItem.vue'
import AccountItem from '@/components/SearchBar/AccountItem.vue'
import {
  SearchResultType,
  TempSearchAccountInfoType,
  TransformedBlocks,
} from '@/helpers/Types'
import {
  makeTransactionListFormatted,
  TransactionListFormatted,
} from '@/helpers/makeTransactionListFormatted'
import { handleError } from '@/helpers/errors'
import { prepareBlocks } from '@/helpers/blocksHelper'

export default defineComponent({
  name: 'SearchBar',
  components: { BlockResultItem, TransactionItem, AccountItem },
  setup: function () {
    const filters = ref<Array<string>>([
      'All Filters',
      'Block',
      'Transaction',
      'Account Address',
    ])

    const activeFilter = ref<string>(filters.value[0])
    const searchedText = ref<string | null>('')
    const searchResult = ref<Array<SearchResultType> | null>(null)
    watch(activeFilter, () => {
      searchResult.value = null
    })

    const getTransactions = async (): Promise<
      Array<TransactionListFormatted>
    > => {
      try {
        const tx = await callers.getTx({
          hash: fromHex(searchedText.value as string),
        })
        return (await makeTransactionListFormatted([
          tx,
        ] as Array<TxResponse>)) as Array<TransactionListFormatted>
      } catch {
        return []
      }
    }

    const getAccount = async (): Promise<Array<TempSearchAccountInfoType>> => {
      try {
        const geoBalance = await callers.getUnverifiedBalances(
          searchedText.value as string,
          'minigeo'
        )
        const odinBalance = await callers.getUnverifiedBalances(
          searchedText.value as string,
          'loki'
        )
        return [
          {
            address: searchedText.value as string,
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
        if (activeFilter.value === 'Account Address') {
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
      } catch (e) {
        console.error((e as Error).message)
        handleError(e as Error)
        searchResult.value = null
      }
      return null
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
    }
  },
})
</script>
<style lang="scss" scoped>
.search {
  padding: 1.2rem 0 2.4rem;

  &__input-wrapper {
    width: 39.6rem;
    position: relative;
    @media (max-width: 480px) {
      position: inherit;
    }
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

.filter-search {
  height: 4.8rem;
  padding: 1.2rem 1.5rem;
  width: 100%;
  max-width: 42.6rem;
  border: 0.1rem solid var(--clr__input-border);
  border-left: none;
  border-right: none;
  &::placeholder {
    color: var(--clr__text-muted);
  }
}
.search-btn {
  width: 48px;
  height: 48px;
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
</style>
