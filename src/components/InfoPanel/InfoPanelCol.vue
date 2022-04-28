<template>
  <div class="info-panel__col">
    <div
      class="info-panel__row"
      v-for="({ title, text }, index) in infoPanelRows"
      :key="index"
    >
      <div class="info-panel__title">{{ title }}</div>
      <span class="info-panel__text">{{ text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'InfoPanelTransaction',
  props: {
    infoPanelRows: {
      type: Array,
      required: true,
    },
  },
})
</script>
<style lang="scss" scoped>
.info-panel {
  &__col {
    display: grid;
    grid: auto/ repeat(4, 1fr);
    gap: 2rem;
  }
  &__row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: 3.2rem 2.4rem;
    max-height: 14rem;
    background: linear-gradient(
      180deg,
      var(--clr__panel-main-background) 0%,
      var(--clr__panel-second-background) 100%
    );
    box-shadow: 0 0.4rem 0.8rem var(--clr__panel-box-shadow);
    border-radius: 0.8rem;
  }
}

@include respond-to(tablet) {
  .info-panel {
    &__col {
      grid: auto/ repeat(2, 1fr);
    }
    &__row {
      padding: 2rem 1.6rem;
      height: 10rem;
    }
  }
}
@include respond-to(small) {
  .info-panel {
    &__col {
      gap: 1.5rem;
    }
    &__row {
      padding: 2rem 1.6rem;
      height: 10rem;
    }
  }
}
</style>
