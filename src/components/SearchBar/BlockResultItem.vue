<template>
  <template v-if="block">
    <router-link
      class="search__dropdown--item"
      :to="`/blocks/${block?.header?.height}`"
    >
      <div class="search__dropdown--item-left">
        <div class="search__dropdown--item-label">Bk</div>
        <div class="search__dropdown--item-height">
          <TitledLink
            class="app-table__cell-txt"
            :text="block?.header?.height"
            :to="`/blocks/${block?.header?.height}`"
          />
        </div>
        <div class="search__dropdown--item-time">
          {{ diffDays(today, getDay(block?.header?.time)) }}
        </div>
      </div>
      <div class="search__dropdown--item-right">
        <div class="search__dropdown--item-validator">
          Validator:

          <TitledLink
            :to="`/validators/${block.validator}`"
            class="app-table__cell-txt"
            :text="cropText(block.validator)"
          />
        </div>
        <div class="search__dropdown--item-transactions">
          {{ block.txs }} transactions
        </div>
      </div>
    </router-link>
  </template>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  name: 'BlockResultItem',
  components: { TitledLink },
  props: { result: { type: Object, required: true } },
  setup(props) {
    const block = computed(() => {
      return props?.result
    })
    const today = new Date()

    return {
      block,
      today,
      diffDays,
      cropText,
      getDay,
    }
  },
})
</script>

<style lang="scss" scoped>
.search {
  &__dropdown {
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
        border-radius: 0.4rem;
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
</style>
