<template>
  <div class="delegators-table">
    <div class="app-table">
      <div class="app-table__head delegators-table__table-head">
        <span>Delegator</span>
        <span>Stake</span>
        <!-- <span>Stake</span> -->
      </div>
      <div class="app-table__body">
        <template v-if="delegators.length">
          <div
            v-for="item in filteredDelegators"
            :key="item.delegation.delegatorAddress"
            class="app-table__row delegators-table__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Delegator</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="String(item.delegation.delegatorAddress)"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Stake</span>
              <span class="app-table__cell-txt">
                {{
                  $convertLokiToOdin(item.balance.amount, { withDenom: true })
                }}
              </span>
            </div>
            <!-- <div class="app-table__cell">
              <span class="app-table__title">Stake</span>
              <span class="app-table__cell-txt">
                {{
                  $convertLokiToOdin(item.delegation.shares, {
                    withDenom: true,
                    withPrecise: true,
                  })
                }}
              </span>
            </div> -->
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="delegatorsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRef } from 'vue'
import TitledLink from '@/components/TitledLink.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'

export default defineComponent({
  components: { TitledLink, AppPagination },
  props: {
    delegators: { type: Array, required: true },
  },
  setup: function (props) {
    const ITEMS_PER_PAGE = 5
    const currentPage = ref(1)
    const delegatorsCount = ref()
    const filteredDelegators = ref()
    const totalPages = computed(() =>
      Math.ceil(delegatorsCount.value / ITEMS_PER_PAGE)
    )

    const _delegators = toRef(props, 'delegators')

    const filterDelegators = (newPage: number) => {
      let tempArr = _delegators.value

      if (newPage === 1) {
        filteredDelegators.value = tempArr.slice(0, newPage * ITEMS_PER_PAGE)
      } else {
        filteredDelegators.value = tempArr.slice(
          (newPage - 1) * ITEMS_PER_PAGE,
          (newPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        )
      }
      currentPage.value = newPage
    }

    const paginationHandler = (num: number) => {
      filterDelegators(num)
    }

    onMounted(() => {
      filterDelegators(currentPage.value)
      delegatorsCount.value = _delegators.value.length
    })

    return {
      ITEMS_PER_PAGE,
      delegatorsCount,
      currentPage,
      totalPages,
      filteredDelegators,
      paginationHandler,
    }
  },
})
</script>

<style lang="scss" scoped>
.delegators-table {
  &__table-head,
  &__table-row {
    grid:
      auto /
      minmax(8rem, 4fr)
      minmax(8rem, 2fr);
  }
}

@include respond-to(tablet) {
  .delegators-table {
    &__table-row {
      grid: none;
    }
  }
}
</style>
