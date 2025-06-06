<template>
  <button class="my-button" :class="`my-button--${type}`" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export type ButtonType = 'default' | 'primary' | 'success' | 'warning' | 'danger'
export default defineComponent({
  name: 'HlBaseButton',
  props: {
    type: {
      type: String as () => ButtonType,
      default: 'default',
      // validator: (val: string) => {
      //   return ["default", "primary", "success", "warning", "danger"].includes(val)
      // },
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const handleClick = (e: Event) => {
      emit('click', e)
    }

    return {
      handleClick,
    }
  },
})
</script>
