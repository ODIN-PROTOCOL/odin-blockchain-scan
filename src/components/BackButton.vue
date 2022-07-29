<template>
  <div class="back-btn__wrapper">
    <button class="back-btn" @click.prevent="routerBack()">
      <img src="@/assets/icons/back-arrow.svg" alt="back" />
    </button>
    <button class="back-btn__mobile" @click.prevent="routerBack()">
      <img src="@/assets/icons/back-arrow-small.svg" alt="back" />
      <span>{{ text }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Router, useRouter } from 'vue-router'

withDefaults(
  defineProps<{
    text?: string
  }>(),
  { text: '' },
)

const router: Router = useRouter()

const routerBack = (): void => {
  router.back()
}
</script>

<style lang="scss" scoped>
.back-btn {
  &__wrapper {
    display: flex;
    align-items: center;
    min-width: 1.6rem;
  }

  @include respond-to(tablet) {
    display: none;
  }

  &__mobile {
    display: none;
    color: var(--clr__action);

    @include respond-to(tablet) {
      display: flex;
      align-items: center;
    }
  }
}
</style>
