<template>
  <h5>自定义button,基于element-plus</h5>
  <HlButton type="primary">点击</HlButton>
  <HlButton type="success">点击</HlButton>
  <HlButton type="warning">点击</HlButton>
</template>
<script setup lang="ts">
import HlButton from '../../../../packages/components/src/hl-button/index.ts'
</script>

<style scoped lang="scss">
.container {
  padding: 10px;
  font-size: 16px;
}
</style>
