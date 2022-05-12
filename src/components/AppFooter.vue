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
          <div class="app-footer__nav-text">
            <a class="app-footer__nav-text-item" :href="START_VALUE.infoOdin"
              >About us</a
            >
            <a class="app-footer__nav-text-item" :href="START_VALUE.docs"
              >Docs</a
            >
            <a class="app-footer__nav-text-item" :href="START_VALUE.mainnetWeb"
              >Mainnet</a
            >
            <a class="app-footer__nav-text-item" :href="START_VALUE.mainnetScan"
              >ODIN Explorer</a
            >
          </div>
          <div class="app-footer__nav-img">
            <a class="app-footer__nav-img-item" :href="START_VALUE.gitHub">
              <img src="@/assets/icons/gitHub.svg" alt="gitHub" />
            </a>
            <a class="app-footer__nav-img-item" :href="START_VALUE.twitter">
              <img src="@/assets/icons/twitter.svg" alt="twitter" />
            </a>
            <a class="app-footer__nav-img-item" :href="START_VALUE.discord">
              <img src="@/assets/icons/discord.svg" alt="discord" />
            </a>
            <a class="app-footer__nav-img-item" :href="START_VALUE.reddit">
              <img src="@/assets/icons/reddit.svg" alt="reddit" />
            </a>
            <a class="app-footer__nav-img-item" :href="START_VALUE.medium">
              <img src="@/assets/icons/medium.svg" alt="medium" />
            </a>
          </div>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script>
import { defineComponent } from 'vue'
import { START_VALUE } from '@/api/api-config'

export default defineComponent({
  name: 'AppFooter',
  setup() {
    return { START_VALUE }
  },
})
</script>

<style scoped lang="scss">
.app-footer {
  background: var(--clr__tooltip-bg);
  margin-top: 6.4rem;
}
.app-footer__inner {
  display: flex;
  align-items: center;
  padding: 3.1rem 0;
}
.app-footer__logo {
  margin-right: 12.8rem;
  width: 9rem;
}
.app-footer__nav {
  display: grid;
  grid:
    auto /
    minmax(3rem, 0.7fr)
    minmax(8rem, 0.3fr);
  width: 100%;
}
.app-footer__nav-text,
.app-footer__nav-img {
  display: flex;
}
.app-footer__nav-img {
  align-items: center;
}
.app-footer__nav-img-item {
  margin-right: 2.4rem;
  &:last-child {
    margin-left: 0;
  }
}
.app-footer__nav-text-item {
  color: var(--clr__text-on-action);
  text-decoration: none;
  margin-right: 4.8rem;
  &:last-child {
    margin-right: 0;
  }
}
@include respond-to(992px) {
  .app-footer__inner {
    flex-direction: column;
    align-items: flex-start;
  }
  .app-footer__nav {
    display: flex;
    flex-direction: column;
  }
  .app-footer__logo {
    margin: 0 0 2.4rem 0;
  }
  .app-footer__nav-text {
    flex-direction: column;
    width: 100%;
    margin-bottom: 4rem;
  }
  .app-footer__nav-text-item {
    align-items: flex-start;
    padding: 1.2rem 0;
    margin-right: 0;
    border-top: 0.1rem solid var(--clr__footer-border);
    &:last-child {
      border-bottom: 0.1rem solid var(--clr__footer-border);
    }
  }
  .app-footer__nav-img-item {
    margin-right: 3.2rem;
  }
}
@include respond-to(small) {
  .app-footer {
    margin-top: 4rem;
  }
  .app-footer__inner {
    padding: 2.4rem 0;
  }
}
</style>
