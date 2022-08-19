<template>
  <div
    class="link-dropdown"
    :class="{ ['link-dropdown--active']: isDropdownOpen }"
    @click="dropdownOpen"
  >
    <span class="link-dropdown__title-wrapper">
      <span class="link-dropdown__title">{{ list.name }}</span>
      <ArrowIcon class="link-dropdown__arrow" />
    </span>
    <transition name="fade">
      <div class="link-dropdown__modal" ref="dropdownEl">
        <template v-for="link in list.links" :key="link.name">
          <router-link
            class="link-dropdown__modal-link"
            :data-text="link.text"
            :to="{ name: link.name }"
            @click="isRedirect()"
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
import { ArrowIcon } from '@/components/icons'

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
  fill: var(--clr__header-text);
}

.link-dropdown__modal {
  min-width: 16.7rem;
  display: none;
  flex-direction: column;
  position: absolute;
  top: 100%;
  left: 0;
  background: var(--clr__main-bg);
  border-radius: 0 0 0.8rem 0.8rem;
  box-shadow: 0 0.4rem 2.4rem rgba(8, 87, 172, 0.12);
  z-index: 99;

  .link-dropdown__modal-link {
    padding: 0.8rem 1.2rem;
    color: var(--clr__nested-nav-text);
    text-decoration: none;

    &:last-child {
      border-end-start-radius: 0.8rem;
      border-end-end-radius: 0.8rem;
    }

    &.router-link-exact-active,
    &:hover {
      background: rgba($clr-secondary, 0.4);
      color: var(--clr__nav-active-text);
      font-weight: bold;
    }
  }
}

@include respond-to(tablet) {
  .link-dropdown {
    width: 100%;
    padding: 0.8rem 0;
    border-bottom: 0.1rem solid var(--clr__input-border);
  }

  .link-dropdown__title-wrapper {
    justify-content: space-between;
    padding: 1.6rem 1.2rem;
  }

  .link-dropdown__title {
    font-weight: 600;
  }

  .link-dropdown__modal {
    padding: 0;
    position: relative;
    top: initial;
    gap: 0;
    box-shadow: none;
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

  .link-dropdown--active {
    .link-dropdown--active__title {
      color: var(--clr__action);
    }

    .link-dropdown--active__arrow {
      fill: var(--clr__action);
      transform: rotate(180deg);
    }

    .link-dropdown--active__modal {
      display: flex;
    }
  }
}

@media screen and (min-width: 768px) {
  .link-dropdown:hover {
    .link-dropdown__title {
      color: var(--clr__secondary);
    }

    .link-dropdown__arrow {
      fill: var(--clr__secondary);
      transform: rotate(180deg);
    }

    .link-dropdown__modal {
      display: flex;
    }
  }
}
</style>
