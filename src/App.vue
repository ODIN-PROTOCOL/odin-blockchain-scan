<template>
  <template v-if="isAppReady">
    <section class="main-section">
      <template v-if="isLoggedIn">
        <header class="">
          <div class="view-header fx-row">
            <img
              class="logo"
              src="~@/assets/brand/odin-logo-black.png"
              alt="Logo"
              width="120"
            />
            <Nav class="mg-l16 mg-r8" />
            <!-- <UserWidget class="fx-sae" /> -->
          </div>
          <SearchBar />
        </header>
      </template>
      <router-view />
    </section>
    <Footer />
  </template>
  <!-- <div class="dialogs-container" ref="dialogsContainerRef"></div> -->
  <!-- <notifications width="100%" /> -->
</template>

<script lang="ts">
import '@invisiburu/vue-picker/dist/vue-picker.min.css'
import { computed, defineComponent, onMounted, ref } from 'vue'
// import { dialogs } from '@/helpers/dialogs'
import { useAuthorization } from '@/composables/useAuthorization'
import Nav from '@/components/Nav.vue'
// import UserWidget from '@/components/UserWidget.vue'
import SearchBar from '@/components/SearchBar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  components: { Nav, SearchBar, Footer },
  setup() {
    const _readyStates = ref({
      dialogs: true,
    })
    const isAppReady = computed(() => {
      return Object.values(_readyStates.value).every((v) => v === true)
    })

    // Dialogs
    // const dialogsContainerRef = ref<HTMLElement>()
    onMounted(() => {
      // if (dialogsContainerRef.value instanceof HTMLElement) {
      //   dialogs.init(dialogsContainerRef.value)
      //   _readyStates.value.dialogs = true
      // }
    })

    return {
      isAppReady,
      // dialogsContainerRef,
      isLoggedIn: true,
      // isLoggedIn: useAuthorization().isLoggedIn,
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

* {
  font-family: 'SF Display', serif;
}

.logo {
  width: 90px;
  height: 34px;
}

.main-section {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
