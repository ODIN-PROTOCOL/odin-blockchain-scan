<template>
  <div class="link-dropdown">
    <span class="link-dropdown__title-wrapper">
      <span class="link-dropdown__title">{{ list.name }}</span>
      <ArrowIcon class="link-dropdown__arrow" />
    </span>
    <transition name="fade">
      <div class="link-dropdown__modal" ref="dropdownEl">
        <template v-for="link in list.links">
          <router-link
            v-if="link.to"
            class="link-dropdown__modal-link"
            @click="isRedirect"
            :key="link.to"
            :data-text="link.text"
            :to="{ name: link.to }"
          >
            <span>{{ link.text }}</span>
          </router-link>
          <router-link
            v-else
            class="link-dropdown__modal-link"
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
.link-dropdown {
  position: relative;
  white-space: nowrap;

  &__title-wrapper {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  &__title {
    margin-right: 0.4rem;
  }

  &__arrow {
    fill: #212529;
  }

  &__modal {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 16.7rem;
    background: var(--clr__main-bg);
    box-shadow: 0 0.4rem 2.4rem rgba(8, 87, 172, 0.12);
    border-radius: 0 0 0.8rem 0.8rem;
    z-index: 99;
  }

  &__modal-link {
    padding: 0.8rem 1.2rem;
    text-decoration: none;
    color: inherit;

    &:last-child {
      border-end-start-radius: 0.8rem;
      border-end-end-radius: 0.8rem;
    }

    &:hover {
      background: rgba(204, 228, 255, 0.4);
      color: var(--clr__action);
      font-weight: 600;
    }
  }

  &:hover {
    .link-dropdown {
      &__title {
        color: var(--clr__action);
      }

      &__arrow {
        fill: var(--clr__action);
        transform: rotate(180deg);
      }

      &__modal {
        display: flex;
      }
    }
  }
}

@include respond-to(tablet) {
  .link-dropdown {
    width: 100%;
    border-bottom: 0.1rem solid var(--clr__input-border);
    padding: 0.8rem 0;

    &__title-wrapper {
      padding: 1.6rem 1.2rem;
      justify-content: space-between;
    }

    &__title {
      font-weight: 600;
    }

    &__modal {
      position: relative;
      box-shadow: none;
      top: initial;
      padding: 0;
      gap: 0;
    }

    &__modal-link {
      padding: 1.2rem 2.8rem;

      &:last-child {
        border-radius: 0;
      }

      &:hover {
        background: inherit;
      }
    }
  }
}
</style>
