<template>
  <template v-if="isAppReady">
    <section class="app__main-section">
      <template v-if="isLoggedIn">
        <header class="app__header" :class="{ app__header_mobile: isOpen }">
          <div class="app__container">
            <div class="app__header-inner">
              <router-link to="/" @click="closeBurger">
                <img
                  class="app__header-logo"
                  src="~@/assets/brand/odin-logo-black.png"
                  alt="Logo"
                />
              </router-link>
              <AppNav :isOpen="isOpen" @closeBurger="closeBurger" />
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
    <AppFooter />
  </template>
  <div class="app__dialogs-container" ref="dialogsContainerRef"></div>
  <notifications width="100%" position="" animation-name="v-fade-left" :max="3">
    <template v-slot:body="props">
      <button
        class="app__notification"
        @click="props.close"
        :class="notification?.typeNotification.toLowerCase()"
      >
        <div>
          <InfoNotificationIcon
            class="app__notification-icon"
            v-if="notification?.typeNotification === 'Info'"
          />
          <SuccessNotificationIcon
            class="app__notification-icon"
            v-else-if="notification?.typeNotification === 'Success'"
          />
          <FailedNotificationIcon class="app__notification-icon" v-else />
        </div>
        <div class="app__notification-content-wrapper">
          <p class="app__notification-title">
            {{ notification?.typeNotification }}
          </p>
          <p class="app__notification-content">
            {{
              notification?.error ||
              'An error has occurred. See the console for details.'
            }}
          </p>
        </div>
        <div class="app__cancel-icon-wrapper">
          <CancelIcon class="app__cancel-icon" />
        </div>
      </button>
    </template>
  </notifications>
</template>

<script lang="ts">
import '@invisiburu/vue-picker/dist/vue-picker.min.css'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import AppNav from '@/components/AppNav.vue'
import BurgerMenu from '@/components/BurgerMenu.vue'
import SearchBar from '@/components/SearchBar/SearchBar.vue'
import AppFooter from '@/components/AppFooter.vue'

import InfoNotificationIcon from '@/components/icons/InfoNotificationIcon.vue'
import SuccessNotificationIcon from '@/components/icons/SuccessNotificationIcon.vue'
import FailedNotificationIcon from '@/components/icons/FailedNotificationIcon.vue'
import CancelIcon from '@/components/icons/CancelIcon.vue'
import { notify } from '@kyvg/vue3-notification'
import emitter from '@/helpers/emmiter'
type NotificationInfo = {
  error: Error
  typeNotification?: string
}
export default defineComponent({
  name: 'App',
  components: {
    AppNav,
    SearchBar,
    AppFooter,
    BurgerMenu,
    InfoNotificationIcon,
    FailedNotificationIcon,
    SuccessNotificationIcon,
    CancelIcon,
  },
  setup() {
    const notification = ref<NotificationInfo>()
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
    const closeBurger = (): void => {
      if (isOpen.value === true) isOpen.value = false
    }
    // Notification
    const DURATION = 7000
    emitter.on('handleNotification', (e) => {
      notification.value = e as NotificationInfo
      notify({
        ignoreDuplicates: true,
        duration: DURATION,
      })
    })
    return {
      isAppReady,
      dialogsContainerRef,
      isLoggedIn: true,
      isOpen,
      burgerMenuHandler,
      closeBurger,
      notification,
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
