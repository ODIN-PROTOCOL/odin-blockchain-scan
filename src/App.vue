<template>
  <template v-if="isAppReady">
    <section class="app__main-section">
      <template v-if="isLoggedIn">
        <header class="app__header" :class="{ app__header_mobile: isOpen }">
          <div class="app__container">
            <div class="app__header-inner">
              <router-link to="/">
                <img
                  class="app__header-logo"
                  src="~@/assets/brand/odin-logo-black.png"
                  alt="Logo"
                />
              </router-link>
              <Nav :isOpen="isOpen" @changeRoute="changeRoute($event)" />
              <BurgerMenu
                class="app__header-burger-menu"
                :isOpen="isOpen"
                @click="burgerMenuHandler($event)"
              />
            </div>
            <SearchBar />
          </div>
        </header>
      </template>

      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :key="Component" :is="Component" />
        </transition>
      </router-view>
    </section>
    <Footer />
  </template>
  <div class="app__dialogs-container" ref="dialogsContainerRef"></div>
  <notifications width="100%" />
</template>

<script lang="ts">
import '@invisiburu/vue-picker/dist/vue-picker.min.css'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import Nav from '@/components/Nav.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  name: 'App',
  components: { Nav, SearchBar, Footer, BurgerMenu },
  setup() {
    const _readyStates = ref({
      dialogs: false,
    })
    const isAppReady = computed(() => {
      return Object.values(_readyStates.value).every((v) => v === true)
    })

    // Dialogs
    const dialogsContainerRef = ref<HTMLElement>()
    onMounted(() => {
      if (dialogsContainerRef.value instanceof HTMLElement) {
        dialogs.init(dialogsContainerRef.value)
        _readyStates.value.dialogs = true
      }
    })

    // Burger Menu
    const isOpen = ref<boolean>(false)
    const burgerMenuHandler = (event: Event | MouseEvent) => {
      event.preventDefault()
      isOpen.value = isOpen.value !== true
    }
    const changeRoute = (): void => {
      if (isOpen.value === true) isOpen.value = false
    }
    return {
      isAppReady,
      dialogsContainerRef,
      isLoggedIn: true,
      isOpen,
      burgerMenuHandler,
      changeRoute,
    }
  },
})
</script>

<style lang="scss">
@import '~@/styles/reset.scss';
@import '~@/styles/root.scss';
@import '~@/styles/buttons.scss';
@import '~@/styles/tables.scss';
@import '~@/styles/views.scss';
@import '~@/styles/load-fog.scss';
@import '~@/styles/forms.scss';
@import '~@/styles/vue-notification.scss';
@import '~@/styles/shortcuts.scss';
@import '~@/styles/fonts.scss';
@import '~@/styles/custom.scss';

#app {
  width: 100%;
  @include flex-container;
  justify-content: space-between;
}
</style>
