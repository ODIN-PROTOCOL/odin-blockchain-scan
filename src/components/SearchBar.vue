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
      <input
        type="search"
        class="filter-search"
        placeholder="searching by account address , block"
        v-model="searchedText"
      />
      <button @click.prevent="searchText" class="search-btn">
        <img src="~@/assets/icons/search.svg" alt="search" />
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  setup() {
    const filters = ref<Array<string>>([
      'All filters',
      'Blocks',
      'Account Address',
    ])

    const activeFilter = ref<string>('')
    activeFilter.value = filters.value[0]

    const searchedText = ref<string>('')

    const searchText = (): void => {
      console.log(searchedText.value)
    }

    return {
      filters,
      activeFilter,
      searchedText,
      searchText,
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
