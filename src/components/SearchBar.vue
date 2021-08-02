<template>
  <div class="container mg-b24">
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
        placeholder="searching by account address , thx hash, block"
        v-model="searchedText"
      />
      <button @click.prevent="searchText" class="search-btn">
        <img src="~@/assets/icons/search.svg" alt="search" />
      </button>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
export default {
  components: {
    VuePicker,
    VuePickerOption,
  },
  setup() {
    const filters = ref([])
    filters.value = ['All filters', 'Blocks', 'Tx hash']

    const activeFilter = ref('')
    activeFilter.value = filters.value[0]

    const searchedText = ref('')

    const searchText = () => {
      console.log(searchedText.value)
    }

    return {
      filters,
      activeFilter,
      searchedText,
      searchText,
    }
  },
}
</script>
<style lang="scss" scoped>
.search__row {
  margin: 0 auto;
  padding: 0 3.2rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @media screen and (max-width: 600px) {
    padding: 0 1.6rem;
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
      color: #007bff;
      background: rgba(204, 228, 255, 0.4);
    }
  }
}

.filter-search {
  height: 48px;
  padding: 12px 15px;
  width: 100%;
  max-width: 426px;
  border: 1px solid #ced4da;
  border-left: none;
  border-right: none;
  &::placeholder {
    color: #6c757d;
  }
}

.search-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--clr__action);
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;

  img {
    width: 18px;
    height: 18px;
    display: block;
  }
}
</style>
