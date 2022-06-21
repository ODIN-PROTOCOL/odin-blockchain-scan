<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <skeleton-loader
        :height="42"
        :width="42"
        :rounded="true"
        animation="wave"
        color="rgb(225, 229, 233)"
        class="latest-list-item__label"
      />
      <skeleton-loader
        :height="16"
        :width="-1"
        :rounded="true"
        animation="wave"
        color="rgb(225, 229, 233)"
        class="latest-list-item__name w-full"
      />
      <skeleton-loader
        :height="16"
        :width="-1"
        :rounded="true"
        animation="wave"
        color="rgb(225, 229, 233)"
        class="latest-list-item__time w-full"
      />
    </div>
    <div class="latest-list-item__center">
      <skeleton-loader
        :height="16"
        :width="-1"
        :rounded="true"
        animation="wave"
        color="rgb(225, 229, 233)"
        class="latest-list-item__validator w-full"
      />
      <skeleton-loader
        :height="16"
        :width="-1"
        :rounded="true"
        animation="wave"
        color="rgb(225, 229, 233)"
        class="latest-list-item__transaction w-full"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'SkeletonLatestListItemBlock',
  components: {},
  props: {},
})
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
  grid-template-rows: 1fr;
  gap: 0 0.8rem;
  align-items: center;
}
.latest-list-item__name {
  margin-bottom: 1.2rem;
  grid-row-start: 1;
  grid-row-end: 2;
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
  // gap: 1.2rem;
  font-size: 1.4rem;
  color: var(--clr__text-muted);
}
.latest-list-item__label {
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
.latest-list-item__center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
}
.latest-list-item__validator {
  display: flex;
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
