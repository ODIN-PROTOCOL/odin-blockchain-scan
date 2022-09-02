<template>
  <template v-if="isAppReady">
    <app-header />
    <section class="app__main-section">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :key="Component" :is="Component" />
        </transition>
      </router-view>
    </section>
    <app-footer />
  </template>
  <div class="app__dialogs-container" ref="dialogsContainerRef"></div>
  <notifications-group />
</template>

<script setup lang="ts">
import '@invisiburu/vue-picker/dist/vue-picker.min.css'
import { computed, onMounted, ref } from 'vue'
import { dialogs } from '@/helpers/dialogs'
import { Theme } from '@/helpers/theme'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
import NotificationsGroup from '@/components/NotificationsGroup.vue'

const _readyStates = ref({
  dialogs: false,
})
const isAppReady = computed(() => {
  return Object.values(_readyStates.value).every((v: boolean) => v === true)
})

// Dialogs
const dialogsContainerRef = ref<HTMLElement>()
onMounted(() => {
  const userTheme = Theme.getTheme() || Theme.getMediaPreference()
  Theme.setTheme(userTheme)

  if (dialogsContainerRef.value instanceof HTMLElement) {
    dialogs.init(dialogsContainerRef.value)
    _readyStates.value.dialogs = true
  }
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
@import '~@/styles/shortcuts.scss';
@import '~@/styles/fonts.scss';
@import '~@/styles/custom.scss';
@import '~@/styles/vue-skeletor.scss';

#app {
  width: 100%;
  @include flex-container;
  justify-content: space-between;
}
</style>
