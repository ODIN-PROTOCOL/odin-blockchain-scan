<template>
  <div class="latest-list-item">
    <div class="latest-list-item__left">
      <skeleton-loader
        :height="42"
        :width="42"
        pill
        shimmer
        class="latest-list-item__label"
      />
      <skeleton-loader
        :height="16"
        pill
        shimmer
        width="100%"
        class="latest-list-item__name w-full"
      />
      <skeleton-loader
        :height="16"
        pill
        shimmer
        width="100%"
        class="latest-list-item__time w-full"
      />
    </div>
    <div class="latest-list-item__center">
      <skeleton-loader
        :height="16"
        pill
        shimmer
        width="100%"
        class="latest-list-item__validator"
      />
      <skeleton-loader
        :height="16"
        pill
        shimmer
        width="100%"
        class="latest-list-item__to"
      />
    </div>
    <div class="latest-list-item__right">
      <skeleton-loader
        :height="42"
        pill
        shimmer
        width="100%"
        class="latest-list-item__amount"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.latest-list-item {
  display: grid;
  grid:
    auto/
    minmax(7rem, 0.5fr)
    minmax(7rem, 1fr)
    minmax(10rem, 0.5fr);
  padding-bottom: 2.4rem;
  border-bottom: 0.1px solid var(--clr__input-border);
  gap: 1.5rem;
  align-items: center;
  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }
}
.latest-list-item__left {
  display: grid;
  grid-template-columns: 4.2rem auto;
  gap: 0 0.8rem;
  align-items: center;
  max-width: 14rem;
  min-width: 8rem;
  width: 100%;
  @include ellipsis();
}
.latest-list-item__name {
  grid-row-start: 1;
  grid-row-end: 2;
  max-width: 9rem;
  min-width: 2rem;
  margin-bottom: 1.2rem;
  a {
    text-decoration: none;
    color: var(--clr__action);
  }
}
.latest-list-item__time {
  grid-row-start: 2;
  grid-row-end: 3;
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  color: var(--clr__text-muted);
  max-width: 9rem;
  min-width: 2rem;
}
.latest-list-item__label {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.2rem;
  height: 4.2rem;
  background: var(--clr__input-border);
  border-radius: 0.4rem;
  font-size: 2rem;
  line-height: 2.3rem;
  grid-row-start: 1;
  grid-row-end: 3;
}
.latest-list-item__center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.2rem;
}
.latest-list-item__validator,
.latest-list-item__to {
  display: flex;
  gap: 0.8rem;
  width: 100%;
}

.latest-list-item__right {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--clr__text);
  @include ellipsis();
}
.latest-list-item__amount {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 0.8rem;
  padding-left: 0;
  max-width: 13.6rem;
  min-width: 10rem;
  width: 100%;
  height: 3.6rem;
  background: var(--clr__modal-field-bg);
  border-radius: 0.4rem;
}
@media (max-width: 768px) {
  .latest-list-item {
    grid:
      auto/ minmax(9.5rem, 0.5fr)
      minmax(8rem, 1fr);
    align-items: flex-start;
  }
  .latest-list-item__left {
    grid-template-columns: 1fr;
  }
  .latest-list-item__label {
    display: none;
  }
  .latest-list-item__right {
    justify-content: left;
  }
}
</style>
