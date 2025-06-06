<template>
  <!-- 用 el-button 作为基础 -->
  <el-button :type="type" :size="size" :plain="plain" :disabled="disabled" @click="onClick">
    <slot />
    {{ num }}
    {{ num }}
  </el-button>
</template>

<script lang="ts" setup>
import { ElButton } from 'element-plus'
import { ref } from 'vue'
defineOptions({
  name: 'HlButton',
})

defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'large' | 'default' | 'small'
  plain?: boolean
  disabled?: boolean
}>()

const num = ref(0)
const onClick = (event: MouseEvent) => {
  // 触发点击事件
  console.log('22222222')
  num.value++
}
</script>

<style scoped lang="scss">
// 可以覆盖 Element Plus 默认样式
.el-button {
  font-weight: bold;
}
</style>
