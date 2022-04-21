<template>
  <div class="error">
    <div class="error-icon">
      <GearIcon />
      <div class="screwdriver-wrapper">
        <ScrewdriverIcon />
      </div>
      <div class="wrench-wrapper">
        <WrenchIcon />
      </div>
      <div class="screw-wrapper screw-wrapper-1">
        <ScrewIcon />
      </div>
      <div class="screw-wrapper screw-wrapper-2">
        <ScrewIcon />
      </div>
      <div class="screw-wrapper screw-wrapper-3">
        <ScrewIcon />
      </div>
      <BoltIcon />
    </div>
    <div class="error__title">Sorry! We're under maintenance</div>
    <div class="error__msg">Hang on till we get the error fixed</div>
    <div class="error__msg">You may refresh the page or try again later</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GearIcon from '@/components/icons/GearIcon.vue'
import ScrewdriverIcon from '@/components/icons/ScrewdriverIcon.vue'
import WrenchIcon from '@/components/icons/WrenchIcon.vue'
import ScrewIcon from '@/components/icons/ScrewIcon.vue'
import BoltIcon from '@/components/icons/BoltIcon.vue'
export default defineComponent({
  name: 'HomeView',
  components: { GearIcon, ScrewdriverIcon, WrenchIcon, ScrewIcon, BoltIcon },
})
</script>

<style lang="scss">
@import '~@/styles/root.scss';
@import '~@/styles/fonts.scss';
html {
  font-size: 10px;
}
#app {
  width: 100%;
  height: 90vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: space-between;
}
.error {
  font-family: 'SF Display', Helvetica, Arial, sans-serif;
  text-align: center;
  opacity: 0.9;
  position: relative;
  top: 20%;

  &-icon {
    width: 39.6rem;
    height: 33.8rem;
    position: relative;
    display: flex;
    margin: 2rem auto;
    .gear-icon,
    .screwdriver-wrapper,
    .wrench-wrapper {
      position: absolute;
      top: 6rem;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    .gear-icon {
      animation: 16s infinite rotation linear;
    }
    .screwdriver-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32rem;
      opacity: 0;
      transform: translate3d(8rem, 8rem, 0);

      animation: 0.4s forwards screwdriver-wrapper;

      & > svg {
        transform: rotateZ(-45deg);
      }
    }
    .wrench-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 32rem;
      opacity: 0;
      transform: translate3d(-8rem, 8rem, 0);

      animation: 0.4s forwards wrench-wrapper;

      & > svg {
        transform: rotateZ(45deg);
      }
    }
    .bolt-icon {
      position: absolute;
      bottom: 1rem;
      right: 0;
    }
    .screw-wrapper {
      position: absolute;
      margin: auto;
      width: 4rem;
      aspect-ratio: 1;
      animation: infinite 7s ease-in-out floating;

      & > svg {
        width: 100%;
      }

      &-1 {
        top: 0;
        left: 0;
        right: 0;
        padding-left: 4.8rem;
      }
      &-2 {
        top: 0;
        bottom: 0;
        left: 0;
        padding-top: 4.8rem;
        animation-delay: -7s;
        animation-duration: 12s;
      }
      &-3 {
        top: 0;
        bottom: 0;
        right: 0;
        padding-bottom: 4.8rem;
        animation-delay: -4s;
        animation-duration: 10s;
      }
    }
  }
  &__title {
    font-size: 3.2rem;
    font-weight: 400;
    line-height: 4.8rem;
    color: var(--clr__action);
    margin-bottom: 2rem;
  }
  &__msg {
    font-size: 2rem;
    font-weight: 400;
    line-height: 2.4rem;
    color: var(--clr__text);
  }
}

@keyframes rotation {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(360deg);
  }
}
@keyframes screwdriver-wrapper {
  from {
    opacity: 0;
    transform: translate3d(8rem, 8rem, 0);
  }
  50% {
    opacity: 0.8;
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes wrench-wrapper {
  from {
    opacity: 0;
    transform: translate3d(-8rem, 8rem, 0);
  }
  50% {
    opacity: 0.8;
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes floating {
  from {
    transform: translateY(0);
  }
  50% {
    transform: translateY(3rem);
  }
  to {
    transform: translateY(0);
  }
}
@include respond-to(small) {
  .error {
    top: 20%;
    &__title {
      font-size: 2rem;
      line-height: 3rem;
      margin-bottom: 1rem;
    }
    &__msg {
      font-size: 1.6rem;
      line-height: 2.4rem;
    }
    &-icon {
      width: 24rem;
      height: 22rem;
      margin: 2rem auto;
      .wrench-icon {
        height: 16rem;
      }
      .screwdriver-icon {
        height: 16rem;
      }
      .gear-icon {
        width: 12rem;
        height: 12rem;
      }
      .screw-icon {
        width: 2rem;
        height: 2rem;
      }
      .bolt-icon {
        right: 2rem;
        width: 2rem;
        height: 2rem;
      }
      .screw-wrapper {
        &-1 {
          top: 2.5rem;
        }
        &-2 {
          left: 2.5rem;
          top: 1rem;
        }
        &-3 {
          top: 12.5rem;
          right: 1.5rem;
        }
      }
    }
  }
}
</style>
