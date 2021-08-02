<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <!-- TODO: what is Bk  -->
      <div class="latest-list-item__label">Bk</div>
      <div class="latest-list-item__name">
        <router-link :to="`/blocks/${item.header.height}`">
          {{ item.header.height }}
        </router-link>
      </div>
      <div class="latest-list-item__time">
        <div class="info-value">
          {{ convertToTime(item.header.time) }}
        </div>
        <div class="info-value">
          {{ convertToDate(item.header.time) }}
        </div>
      </div>
    </div>
    <div class="latest-list-item__center">
      <div class="latest-list-item__validator">
        Validator:
        <TitledLink
          :link="`/transactions/${item.header.height}`"
          class="app-table__cell-txt"
          :text="'0x' + toHexFunc(item.header.validatorsHash).toUpperCase()"
        />
      </div>
      <div class="latest-list-item__transactions">
        <!-- TODO: transactions count -->
        548 transactions
      </div>
    </div>
    <div class="latest-list-item__right">
      <!-- TODO: what is block_size  -->
      <span>
        {{ item.block_size }}
      </span>
      <!-- TODO: currency-->
      <span class="currency">
        454,565 {{ item.header.chainId.toUpperCase() }}
      </span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { convertToTime, convertToDate } from '@/helpers/dates'
import { toHex } from '@cosmjs/encoding'
import TitledLink from '@/components/TitledLink.vue'

export default defineComponent({
  components: { TitledLink },
  name: 'LatestListItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const toHexFunc = toHex
    return {
      convertToTime,
      convertToDate,
      toHexFunc,
    }
  },
})
</script>

<style lang="scss" scoped>
.latest-list-item {
  display: grid;
  grid: auto/ repeat(3, minmax(9.3rem, 1fr));
  padding-bottom: 2.4rem;
  border-bottom: 0.1px solid #ced4da;
  gap: 2.4rem;
  align-items: center;
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
  &__left {
    display: grid;
    grid-template-columns: 4.2rem auto;
    grid-template-rows: 1fr;
    gap: 0.8rem;
    align-items: center;
  }
  &__name {
    grid-row-start: 1;
    grid-row-end: 2;
    a {
      text-decoration: none;
      color: var(--clr__action);
    }
  }
  &__time {
    grid-row-start: 2;
    grid-row-end: 3;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.4rem;
    color: #6c757d;
  }
  &__label {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 4.2rem;
    height: 4.2rem;
    background: #ced4da;
    border-radius: 4px;
    font-size: 2rem;
    line-height: 2.3rem;
    grid-row-start: 1;
    grid-row-end: 3;
  }
  &__center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 0.8rem;
  }
  &__validator {
    display: flex;
    gap: 0.4rem;
    width: 100%;
  }
  &__transactions {
    color: #6c757d;
  }
  &__right {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.4rem;
    font-weight: 600;
    color: #212529;
  }
}
</style>
