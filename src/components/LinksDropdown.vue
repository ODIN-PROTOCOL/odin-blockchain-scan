<template>
  <div class="nav__dropdown">
    <span class="nav__dropdown-wrapper">
      <span class="nav__dropdown-wrapper-name">{{ list.name }}</span>
      <ArrowIcon />
    </span>
    <transition name="fade">
      <div class="nav__dropdown-modal" ref="dropdownEl">
        <template v-for="link in list.links">
          <router-link
            v-if="link.to"
            class="nav__dropdown-link"
            @click="isRedirect"
            :key="link.to"
            :data-text="link.text"
            :to="{ name: link.to }"
          >
            <span>{{ link.text }}</span>
          </router-link>
          <router-link
            v-else
            class="nav__dropdown-link"
            @click="isRedirect"
            :key="link.url"
            :data-text="link.text"
            :to="link.url"
          >
            <span>{{ link.text }}</span>
          </router-link>
        </template>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import ArrowIcon from '@/components/icons/ArrowIcon.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'linksDropdown',
  emits: ['redirect'],
  components: { ArrowIcon },
  props: {
    list: { type: Object, required: true },
  },
  setup(_, { emit }) {
    const isRedirect = () => {
      emit('redirect')
    }
    return { isRedirect }
  },
})
</script>

<style scoped lang="scss">
.nav__dropdown {
  &:hover {
    .nav__dropdown-modal {
      display: flex;
    }
  }
}
</style>
