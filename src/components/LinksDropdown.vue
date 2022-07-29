<template>
  <div
    class="link-dropdown"
    @click="dropdownOpen"
    :class="{ ['link-dropdown--active']: isDropdownOpen }"
  >
    <span class="link-dropdown__title-wrapper">
      <span class="link-dropdown__title">{{ list.name }}</span>
      <ArrowIcon class="link-dropdown__arrow" />
    </span>
    <transition name="fade">
      <div class="link-dropdown__modal" ref="dropdownEl">
        <template v-for="link in list.links" :key="link.to">
          <router-link
            class="link-dropdown__modal-link"
            @click="isRedirect()"
            :data-text="link.text"
            :to="{ path: link.to }"
          >
            <span>{{ link.text }}</span>
          </router-link>
        </template>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { LinkList } from '@/helpers/Types'
import ArrowIcon from '@/components/icons/ArrowIcon.vue'

enum EVENTS {
  redirect = 'redirect',
}

defineProps<{
  list: LinkList
  isDropdownOpen: boolean
}>()

const emit = defineEmits<{
  (e: EVENTS.redirect): void
}>()
const isRedirect = () => {
  emit(EVENTS.redirect)
}
</script>

<style scoped lang="scss">
.link-dropdown {
  position: relative;
  white-space: nowrap;

  @media screen and (min-width: 768px) {
    &:hover {
      .link-dropdown__title {
        color: var(--clr__action);
      }

      .link-dropdown__arrow {
        fill: var(--clr__action);
        transform: rotate(180deg);
      }

      .link-dropdown__modal {
        display: flex;
      }
    }
  }
}
.link-dropdown__title-wrapper {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.link-dropdown__title {
  margin-right: 0.4rem;
}

.link-dropdown__arrow {
  fill: var(--clr__text);
}

.link-dropdown__modal {
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

.link-dropdown__modal-link {
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

@include respond-to(tablet) {
  .link-dropdown {
    width: 100%;
    border-bottom: 0.1rem solid var(--clr__input-border);
    padding: 0.8rem 0;
    &--active {
      .link-dropdown__title {
        color: var(--clr__action);
      }
      .link-dropdown__arrow {
        fill: var(--clr__action);
        transform: rotate(180deg);
      }
      .link-dropdown__modal {
        display: flex;
      }
    }
  }
  .link-dropdown__title-wrapper {
    padding: 1.6rem 1.2rem;
    justify-content: space-between;
  }

  .link-dropdown__title {
    font-weight: 600;
  }

  .link-dropdown__modal {
    position: relative;
    box-shadow: none;
    top: initial;
    padding: 0;
    gap: 0;
  }

  .link-dropdown__modal-link {
    padding: 1.2rem 2.8rem;

    &:last-child {
      border-radius: 0;
    }

    &:hover {
      background: inherit;
    }
  }
}
</style>
