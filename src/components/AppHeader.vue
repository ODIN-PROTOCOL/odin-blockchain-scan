<template>
  <header class="app-header" :class="{ 'app-header--mobile': isOpen }">
    <div class="app__container">
      <div class="app-header__inner">
        <router-link :to="{ name: $routes.app }" @click="closeBurger">
          <img
            class="app-header__logo"
            src="~@/assets/brand/odin-logo-black.png"
            alt="Logo"
          />
        </router-link>
        <app-nav :is-open="isOpen" @close-burger="closeBurger" />
        <burger-menu
          class="app-header__burger-menu"
          :is-open="isOpen"
          @click="burgerMenuHandler($event)"
        />
      </div>
      <search-bar />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNav from '@/components/AppNav.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'

const isOpen = ref<boolean>(false)
const burgerMenuHandler = (event: Event | MouseEvent) => {
  event.preventDefault()
  isOpen.value = !isOpen.value
}

const closeBurger = (): void => {
  isOpen.value = false
}
</script>

<style scoped lang="scss">
.app-header {
  border-bottom: 0.1rem solid var(--clr__btn-disabled);
  margin-bottom: 3rem;

  &--mobile {
    @include respond-to(tablet) {
      position: fixed;
      width: 100%;
      z-index: 1;
      background: var(--clr__main-bg);
    }
  }
}

.app-header__inner {
  padding: 2.8rem 0 1.6rem;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  @include respond-to(tablet) {
    width: 100%;
    margin: 0;
    justify-content: space-between;
  }
}

.app-header__logo {
  width: 9rem;
  height: 3.4rem;
  margin-right: 5.4rem;
}

.app-header__burger-menu {
  display: none;
  @include respond-to(tablet) {
    display: flex;
    flex-shrink: 0;
  }
}
</style>
