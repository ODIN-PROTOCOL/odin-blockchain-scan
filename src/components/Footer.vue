<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__logo">
          <a href="/">
            <img
              class="logo"
              src="~@/assets/brand/odin-logo-white.png"
              alt="Logo"
              width="80"
            />
          </a>
        </div>
        <nav class="footer__nav">
          <a class="footer__nav-item" href="">About us</a>
          <a class="footer__nav-item" href="">Contact us</a>
          <a class="footer__nav-item" href="">Terms of service</a>
          <a class="footer__nav-item" href="">Developer APIs</a>
          <a class="footer__nav-item" href="">Knowledge base</a>
          <a class="footer__nav-item" href="">Network status</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Footer',
})
</script>

<style scoped lang="scss">
.footer {
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
  .footer {
    margin-top: 4rem;

    &__inner {
      padding: 2.4rem 0;
    }
  }
}

@include respond-to(992px) {
  .footer {
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
