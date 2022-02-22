<template>
  <footer class="app-footer">
    <div class="app__container">
      <div class="app-footer__inner">
        <div class="app-footer__logo">
          <a href="/">
            <img
              class="logo"
              src="~@/assets/brand/odin-logo-white.png"
              alt="Logo"
              width="80"
            />
          </a>
        </div>
        <nav class="app-footer__nav">
          <a class="app-footer__nav-item" href="">About us</a>
          <a class="app-footer__nav-item" href="">Contact us</a>
          <a class="app-footer__nav-item" href="">Terms of service</a>
          <a class="app-footer__nav-item" href="">Developer APIs</a>
          <a class="app-footer__nav-item" href="">Knowledge base</a>
          <a class="app-footer__nav-item" href="">Network status</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppFooter',
})
</script>

<style scoped lang="scss">
.app-footer {
  background: var(--clr__tooltip-bg);
  margin-top: 6.4rem;

  &__inner {
    display: flex;
    align-items: center;
    padding: 3.1rem 0;
  }

  &__logo {
    margin-right: 12.8rem;
    width: 9rem;
  }

  &__nav {
    flex: 1;
    display: flex;
    justify-content: space-between;
  }

  &__nav-item {
    color: var(--clr__text-on-action);
    text-decoration: none;
  }
}

@include respond-to(small) {
  .app-footer {
    margin-top: 4rem;

    &__inner {
      padding: 2.4rem 0;
    }
  }
}

@include respond-to(992px) {
  .app-footer {
    &__inner {
      flex-direction: column;
      align-items: flex-start;
    }

    &__logo {
      margin: 0 0 2.4rem 0;
    }

    &__nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      column-gap: 2.4rem;
      row-gap: 2.4rem;
      width: 100%;
    }
  }
}
</style>
