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
          <div class="app-header__mobile-nav">
            <theme-switch
              class="theme-switch"
              :theme="currentTheme"
              :toggle-theme="toggleTheme"
            />
            <burger-menu :is-open="isOpen" @click="burgerMenuHandler" />
          </div>
        </div>
      </div>
    </div>
    <div class="app-header__search-bar">
      <div class="app__container">
        <search-bar />
        <theme-switch
          class="theme-switch"
          :theme="currentTheme"
          :toggle-theme="toggleTheme"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppNav from '@/components/AppNav.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import ThemeSwitch from '@/components/ThemeSwitch.vue'
import { Theme, ThemeMode } from '@/helpers/theme'

const isOpen = ref<boolean>(false)
const currentTheme = ref(Theme.getTheme())

const toggleTheme = (theme: ThemeMode): void => {
  Theme.setTheme(theme)
  currentTheme.value = theme
}

const burgerMenuHandler = (event: Event | MouseEvent) => {
  event.preventDefault()
  isOpen.value = !isOpen.value
}

const closeBurger = (): void => {
  isOpen.value = false
}
</script>

<style scoped lang="scss">
.app-header__container {
  min-height: 7.6rem;
  display: flex;
  align-items: center;
  padding: 1.8rem 0;
  background-color: var(--clr__dark);
}

.app-header__inner {
  display: flex;
  align-items: center;
  justify-content: flex-start;

  @include respond-to(tablet) {
    width: 100%;
    margin: 0;
    justify-content: space-between;
  }
}

.app-header__search-bar {
  @include respond-to(tablet) {
    .theme-switch {
      display: none;
    }
  }
}

.app-header__logo {
  width: 9rem;
  height: 3.4rem;
  margin-right: 5.4rem;
}

.app-header__mobile-nav {
  display: none;

  @include respond-to(tablet) {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-shrink: 0;
  }
}

.app-header__search-bar {
  height: 8.4rem;
  display: flex;
  align-items: center;
  background-color: var(--clr__search-bar-bg);

  .app__container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.app-header--mobile {
  @include respond-to(tablet) {
    width: 100%;
    position: fixed;
    background-color: var(--clr__white);
    z-index: 1;
  }
}
</style>
