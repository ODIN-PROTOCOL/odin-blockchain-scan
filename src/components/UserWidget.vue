<template>
  <div class="user-widget fx-row">
    <button
      class="app__btn user-widget__btn"
      type="button"
      @click="logInAndLeave()"
    >
      <span>Sign in</span>
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import router from '@/router'

export default defineComponent({
  name: 'UserWidget',
  setup() {
    const logInAndLeave = () => {
      // auth.logOut()
      router.push('/')
    }

    return { logInAndLeave }
  },
})
</script>

<style scoped lang="scss">
@include respond-to(tablet) {
  .user-widget {
    width: 100%;

    &__btn {
      width: 100%;
    }
  }
}
</style>
