<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <div class="latest-list-item__label">Tx</div>
      <div class="latest-list-item__name">
        <TitledLink
          v-if="tx?.hash"
          class="app-table__cell-txt"
          :to="`/transactions/${tx.hash}`"
          :text="cropText(`0x${tx.hash}`)"
        />
        <span v-else>No info</span>
      </div>
      <div class="latest-list-item__time app-table__cell-txt">
        {{ diffDays(toDay, getDay(tx.time)) }}
      </div>
    </div>
    <div class="latest-list-item__center">
      <div class="latest-list-item__validator">
        <span>From:</span>
        <TitledLink
          v-if="tx?.sender"
          :to="`/account/${tx.sender}`"
          class="app-table__cell-txt app-table__link"
          :text="tx.sender"
        />
        <span v-else>No info</span>
      </div>
      <div class="latest-list-item__to">
        <span>To:</span>
        <TitledLink
          v-if="tx?.receiver"
          class="app-table__cell-txt app-table__link"
          :to="`/account/${tx.receiver}`"
          :text="tx.receiver"
        />
        <span v-else>No info</span>
      </div>
    </div>
    <div class="latest-list-item__right">
      <div class="latest-list-item__amount">
        <span>{{ tx.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import { DecodedTxData } from '@/helpers/Types'
import { diffDays, cropText, getDay } from '@/helpers/formatters'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  name: 'LatestListItemTx',
  components: { TitledLink },
  props: { tx: { type: Object as PropType<DecodedTxData>, required: true } },
  setup() {
    const toDay = ref<Date>(new Date())

    return {
      diffDays,
      cropText,
      getDay,
      toDay,
    }
  },
})
</script>

<style scoped lang="scss">
.latest-list-item {
  display: grid;
  grid:
    auto/
    minmax(4rem, 0.6fr)
    minmax(5rem, 0.9fr)
    minmax(10rem, 0.5fr);
  padding-bottom: 2.4rem;
  border-bottom: 0.1px solid var(--clr__input-border);
  gap: 1.5rem;
  align-items: center;
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}
.latest-list-item__left {
  display: grid;
  grid-template-columns: 4.2rem auto;
  gap: 0 0.8rem;
  align-items: center;
  max-width: 16rem;
  min-width: 7rem;
  width: 100%;
  @include ellipsis();
}
.latest-list-item__name {
  width: 100%;
  max-width: 10rem;
  min-width: 2rem;
  grid-row-start: 1;
  grid-row-end: 2;
  a {
    text-decoration: none;
    color: var(--clr__action);
  }
}
.latest-list-item__time {
  width: 100%;
  grid-row-start: 2;
  grid-row-end: 3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  color: var(--clr__text-muted);
  max-width: 9rem;
  min-width: 2rem;
}
.latest-list-item__label {
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
.latest-list-item__center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.8rem;
}
.latest-list-item__validator,
.latest-list-item__to {
  display: flex;
  gap: 0.8rem;
  width: 100%;
}

.latest-list-item__right {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--clr__text);
  @include ellipsis();
}
.latest-list-item__amount {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.8rem;
  padding-left: 0;
  max-width: 13.6rem;
  min-width: 10rem;
  width: 100%;
  height: 3.6rem;
  background: var(--clr__modal-field-bg);
  border-radius: 0.4rem;
}
@media (max-width: 768px) {
  .latest-list-item {
    grid:
      auto/ minmax(9.5rem, 0.5fr)
      minmax(8rem, 1fr);
    align-items: flex-start;
  }
  .latest-list-item__left {
    grid-template-columns: 1fr;
  }
  .latest-list-item__label {
    display: none;
  }
  .latest-list-item__right {
    justify-content: left;
  }
}
</style>
