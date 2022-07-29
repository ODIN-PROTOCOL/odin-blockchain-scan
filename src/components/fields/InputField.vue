<template>
  <input
    class="input-field"
    :class="classString"
    :type="type"
    :min="min"
    :max="max"
    :maxlength="maxlength"
    :step="step"
    :name="name"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :readonly="readonly"
    :required="required"
    :disabled="disabled"
    @input="inputChange($event)"
  />
</template>

<script setup lang="ts">
enum EVENTS {
  updateModelValue = 'update:model-value',
  input = 'input',
}
const emit = defineEmits<{
  (e: EVENTS.updateModelValue, modelValue: string): void
}>()

withDefaults(
  defineProps<{
    modelValue?: string
    type?: string
    classString?: string
    max?: number | string
    min?: number | string
    maxlength?: number
    step?: number
    name?: string
    placeholder?: string
    autocomplete?: string
    readonly?: boolean
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    type: 'text',
    autocomplete: 'off',
    readonly: false,
    required: false,
    disabled: false,
  },
)

const inputChange = (event: { target: { value: string } }) => {
  emit(EVENTS.updateModelValue, event.target.value)
}
</script>

<style scoped lang="scss">
.input-field {
  width: 22.8rem;
  height: 4.8rem;
  border: 0.1rem solid var(--clr__input-border);
  border-radius: 0.8rem 0 0 0.8rem;
  text-indent: 1.5rem;
  &:hover,
  &:focus {
    border: 0.1rem solid var(--clr__action);
  }
  &::placeholder {
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 400;
    color: var(--clr__text-muted);
  }
}
</style>
