<template>
  <div class="search">
    <div class="search__row">
      <VuePicker
        class="app-form__field-input app-filter"
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
          placeholder="searching by account address , block"
          v-model="searchedText"
        />
        <transition-group name="fade" mode="out-in">
          <div
            class="search__drop-dawn"
            :key="searchResult?.block?.header?.height"
            v-if="searchResult"
          >
            <router-link
              class="search__drop-dawn--item"
              :to="`/blocks/${searchResult?.block?.header?.height}`"
            >
              <div class="search__drop-dawn--item-left">
                <div class="search__drop-dawn--item-label">Bk</div>
                <div class="search__drop-dawn--item-height">
                  <TitledLink
                    class="app-table__cell-txt"
                    :text="searchResult?.block?.header?.height"
                  />
                </div>
                <div class="search__drop-dawn--item-time">
                  {{
                    diffDays(toDay, getDay(searchResult?.block?.header?.time))
                  }}
                </div>
              </div>
              <div class="search__drop-dawn--item-right">
                <div class="search__drop-dawn--item-validator">
                  Validator:
                  <TitledLink
                    :link="`/transactions/${searchResult?.block?.header?.height}`"
                    class="app-table__cell-txt"
                    :text="`${cropText(
                      '0x' +
                        toHexFunc(
                          searchResult?.block?.header?.validatorsHash
                        ).toUpperCase()
                    )}`"
                  />
                </div>
                <div class="search__drop-dawn--item-transactions">
                  548 transactions
                </div>
              </div>
            </router-link>
          </div>
        </transition-group>
      </div>
      <button @click.prevent="searchText" class="search-btn">
        <img src="~@/assets/icons/search.svg" alt="search" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { toHex } from '@cosmjs/encoding'
import { defineComponent, ref } from 'vue'
import { callers } from '@/api/callers'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import { BlockResponse } from '@cosmjs/tendermint-rpc/build/tendermint34/responses'

import TitledLink from '@/components/TitledLink.vue'
import { Router, useRouter } from 'vue-router'

export default defineComponent({
  name: 'SearchBar',
  components: { TitledLink },
  setup() {
    const toDay = ref<Date>(new Date())
    const filters = ref<Array<string>>([
      'All filters',
      'Blocks',
      'Account Address',
    ])

    const activeFilter = ref<string>('')
    activeFilter.value = filters.value[0]
    const searchedText = ref<string | null>('')
    const searchResult = ref<BlockResponse | null>()

    const searchText = async (): Promise<void | null> => {
      if (searchedText.value === '') return (searchResult.value = null)
      try {
        searchResult.value = (await callers.getBlock(
          Number(searchedText.value)
        )) as BlockResponse
      } catch {
        searchResult.value = null
      }
    }

    const router: Router = useRouter()

    router.beforeEach(() => {
      searchResult.value = null
    })

    const toHexFunc = toHex
    return {
      filters,
      activeFilter,
      searchedText,
      searchText,
      searchResult,
      toDay,
      diffDays,
      cropText,
      getDay,
      toHexFunc,
    }
  },
})
</script>
<style lang="scss" scoped>
.search {
  margin: 0 10.3rem 2.5rem 10.3rem;
  &__row {
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    @media screen and (max-width: 600px) {
      padding: 0 1.6rem;
    }
  }
  @media (max-width: 768px) {
    margin: 0;
    padding: 0 1rem 2.5rem 1rem;
    &__row {
      padding: 0;
    }
  }
}
.app-filter {
  display: flex;
  max-width: 12.6rem;
  height: 4.8rem;
  border-radius: 0.8rem 0 0 0.8rem;
  position: relative;
  &:focus {
    border: 0.1rem solid var(--clr__input-border);
  }
  &__dropdown-inner {
    .vue-picker-option_cur,
    .vue-picker-option:hover {
      color: var(--clr__action);
      background: rgba(204, 228, 255, 0.4);
    }
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
.search {
  &__input-wrapper {
    width: 39.6rem;
    position: relative;
    @media (max-width: 480px) {
      position: inherit;
    }
  }
  &__drop-dawn {
    position: absolute;
    background: white;
    border: 0.1rem solid var(--clr__input-border);
    border-radius: 0 0 0.8rem 0.8rem;
    width: 100%;
    &--item {
      text-decoration: none;
      color: var(--clr__text);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      &-left {
        display: grid;
        grid-template-columns: 4.2rem 1fr;
        gap: 0 1rem;
        align-items: center;
      }
      &-right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;
        gap: 1rem;
      }
      &-validator {
        display: flex;
        align-items: center;
        gap: 0 1rem;

        @media (max-width: 480px) {
          flex-direction: column;
          align-items: flex-start;
        }
      }
      &-label {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 4.2rem;
        height: 4.2rem;
        background: var(--clr__input-border);
        border-radius: 4px;
        font-size: 2rem;
        line-height: 2.3rem;
        grid-row-start: 1;
        grid-row-end: 3;
      }
      &-time {
        grid-row-start: 2;
        grid-row-end: 3;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      &-transactions,
      &-time {
        font-size: 1.4rem;
        color: var(--clr__text-muted);
      }
      &:hover {
        background: rgba(#ced4da, 0.3);
      }
    }
    @media (max-width: 480px) {
      width: calc(100% - 19px);
      left: 50%;
      transform: translate(-50%);
    }
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
