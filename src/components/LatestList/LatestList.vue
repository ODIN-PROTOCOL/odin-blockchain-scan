<template>
  <div class="latest-list">
    <div class="latest-list__header">
      <div class="latest-list__header-title">{{ header.title }}</div>
      <div class="latest-list__header-link">
        <router-link
          :data-text="header.linkDataText"
          :to="{ name: header.linkDataText }"
        >
          <span>{{ header.link }}</span>
        </router-link>
      </div>
    </div>
    <div class="latest-list__body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'LatestList',
  props: {
    header: {
      type: Object,
      required: true,
    },
  },
})
</script>

<style lang="scss" scoped>
.latest-list {
  padding: 3.2rem 2.4rem 5.6rem 2.4rem;
  border-radius: 0.8rem;
  border: 0.1rem solid var(--clr__action);
  width: 100%;
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4rem;
    &-title {
      font-size: 2.4rem;
      line-height: 3.2rem;
      font-style: normal;
      font-weight: normal;
    }
    &-link {
      color: var(--clr__action);
      font-size: 1.6rem;
      line-height: 2.4rem;
      a {
        color: inherit;
        text-decoration: none;
        border-bottom: 0.1rem solid var(--clr__action);
      }
    }
  }
  &__body {
    display: flex;
    flex-direction: column;
    gap: 2.4rem;
  }

  @media (max-width: 768px) {
  }
}
</style>
