<template>
  <header class="app__header" :class="{ app__header_mobile: isOpen }">
    <div class="app__container">
      <div class="app__header-inner">
        <router-link :to="{ name: $routes.app }" @click="closeBurger">
          <img
            class="app__header-logo"
            src="~@/assets/brand/odin-logo-black.png"
            alt="Logo"
          />
        </router-link>
        <app-nav :isOpen="isOpen" @close-burger="closeBurger" />
        <burger-menu
          class="app__header-burger-menu"
          :isOpen="isOpen"
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
