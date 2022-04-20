<template>
  <div class="error">
    <div class="error-icon">
      <GearIcon class="gear" />
      <div class="screwdriver-wrapper">
        <ScrewdriverIcon class="screwdriver" />
      </div>
      <div class="wrench-wrapper">
        <WrenchIcon class="wrench" />
      </div>
      <div class="screw screw-1">
        <ScrewIcon />
      </div>
      <div class="screw screw-2">
        <ScrewIcon />
      </div>
      <div class="screw screw-3">
        <ScrewIcon />
      </div>
      <BoltIcon class="bolt" />
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
    .gear,
    .screwdriver-wrapper,
    .wrench-wrapper {
      position: absolute;
      top: 6rem;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    .gear {
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
    .bolt {
      position: absolute;
      bottom: 1rem;
      right: 0;
    }
    .screw {
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
    margin-bottom: 1rem;
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
    top: 15%;
    &__title {
      font-size: 2.6rem;
      line-height: 3.2rem;
    }
    &__msg {
      font-size: 2rem;
      line-height: 2.6rem;
    }
    &-icon {
      width: 26rem;
      height: 24rem;
      .wrench {
        height: 24rem;
      }
      .screwdriver {
        height: 24rem;
      }
      .gear {
        width: 20rem;
        height: 18rem;
      }
      .bolt {
        bottom: 1rem;
        right: -2rem;
      }
      .screw {
        &-1 {
          top: -1.5rem;
        }
        &-2 {
          left: -1rem;
        }
        &-3 {
          right: -1.5rem;
        }
      }
    }
  }
}
</style>
