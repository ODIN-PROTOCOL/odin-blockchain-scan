<template>
  <div class="info-card">
    <div
      class="info-card__row"
      v-for="(infoItem, idx) in infoData"
      :key="infoItem.title + idx"
    >
      <span class="info-card__row-title">{{ infoItem.title }}:</span>
      <div class="info-card__row-values">
        <span
          class="info-card__row-values-item"
          v-for="(value, idx) in infoItem.values"
          :key="value + idx"
        >
          {{ value }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

type InfoCardPropsItem = {
  title: string
  values: string[]
}

export default defineComponent({
  props: {
    infoData: { type: Array as PropType<InfoCardPropsItem[]>, required: true },
  },
})
</script>

<style lang="scss" scoped>
.info-card {
  width: 35rem;
  padding: 3.2rem 2.4rem;
  margin: 2.4rem 0 4rem;
  border: 0.1rem solid var(--clr__action);
  border-radius: 0.8rem;

  &__row {
    display: grid;
    grid-template-columns: 10rem 1fr;
    align-items: flex-start;
    &:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__row-title {
    width: 10rem;
    display: inline-block;
  }

  &__row-values {
    display: flex;
    flex-direction: column;
    @include ellipsis();
  }

  &__row-values-item {
    font-weight: 600;
    font-size: 1.6rem;
    margin-left: 2.4rem;
    @include ellipsis();

    &:not(:last-of-type) {
      margin-bottom: 0.8rem;
    }
  }
}

@include respond-to(tablet) {
  .info-card {
    width: 100%;
  }
}
</style>
