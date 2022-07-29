<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <div class="latest-list-item__label">Bk</div>
      <div class="latest-list-item__name">
        <TitledLink
          :to="`/blocks/${block.header.height}`"
          class="app-table__cell-txt"
          :text="block.header.height"
        />
      </div>
      <div class="latest-list-item__time">
        <div class="info-value">
          {{ diffDays(toDay, getDay(block.header.time)) }}
        </div>
      </div>
    </div>
    <div class="latest-list-item__center">
      <div class="latest-list-item__validator">
        <span>Validator:</span>
        <TitledLink
          :to="`/validators/${block.validator}`"
          class="app-table__cell-txt app-table__link"
          :text="`${block.validator}`"
        />
      </div>
      <div class="latest-list-item__transactions">
        <span>{{ block.txs }} transactions</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { diffDays, getDay } from '@/helpers/formatters'
import { TransformedBlocks } from '@/helpers/Types'
import TitledLink from '@/components/TitledLink.vue'

defineProps<{
  block: TransformedBlocks
}>()
const toDay = new Date()
</script>

<style scoped lang="scss">
.latest-list-item {
  display: grid;
  grid:
    auto/ minmax(12rem, 0.5fr)
    minmax(7rem, 1fr);
  padding-bottom: 2.4rem;
  border-bottom: 0.1px solid var(--clr__input-border);
  gap: 2.4rem;
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
}
.latest-list-item__name {
  grid-row-start: 1;
  grid-row-end: 2;
  max-width: 9rem;
  min-width: 2rem;
  a {
    text-decoration: none;
    color: var(--clr__action);
  }
}
.latest-list-item__time {
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
.latest-list-item__transactions {
  color: var(--clr__text-muted);
}
.latest-list-item__right {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--clr__text);
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
