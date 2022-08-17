<template>
  <header class="app-header" :class="{ 'app-header--mobile': isOpen }">
    <div class="app-header__container">
      <div class="app__container">
        <div class="app-header__inner">
          <router-link :to="{ name: $routes.app }" @click="closeBurger">
            <img
              class="app-header__logo"
              src="~@/assets/brand/odin-logo-white.png"
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
      </div>
    </div>
    <div class="app-header__search-bar">
      <div class="app__container">
        <search-bar />
      </div>
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
  &__container {
    min-height: 7.6rem;
    display: flex;
    align-items: center;
    padding: 1.8rem 0;
    background-color: var(--clr__header_bg);
  }

  &__inner {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    @include respond-to(tablet) {
      width: 100%;
      margin: 0;
      justify-content: space-between;
    }
  }

  &__logo {
    width: 9rem;
    height: 3.4rem;
    margin-right: 5.4rem;
  }

  &__burger-menu {
    display: none;

    @include respond-to(tablet) {
      display: flex;
      flex-shrink: 0;
    }
  }

  &--mobile {
    @include respond-to(tablet) {
      width: 100%;
      position: fixed;
      background-color: var(--clr__main-bg);
      z-index: 1;
    }
  }

  &__search-bar {
    height: 8.4rem;
    display: flex;
    align-items: center;
    background-color: var(--clr-white);
  }
}
</style>
