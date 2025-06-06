<template>
  <iframe style="width: 100%; height: 100vh" :src="src"></iframe>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  pdf: { type: [string, ArrayBuffer] }
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'large' | 'default' | 'small'
  plain?: boolean
  disabled?: boolean
}>()
const src = ref()
console.log('props.pdf', props.pdf)

// src.value = `/pdfjs/web/viewer.html?file=${props.pdf}`

watch(
  () => props.pdf,
  async (val) => {
    if (val) {
      if (typeof val === 'string') {
        // 如果是 URL 字符串
        src.value = `/pdfjs/web/viewer.html?file=${encodeURIComponent(val)}`
      } else if (val instanceof ArrayBuffer) {
        // 如果是二进制数据，创建 Blob URL
        const blob = new Blob([val], { type: 'application/pdf' })
        const blobUrl = URL.createObjectURL(blob)
        src.value = `/pdfjs/web/viewer.html?file=${encodeURIComponent(blobUrl)}`
      }
    }
  },
  { immediate: true }
)
</script>
<style scoped>
.read-the-docs {
  color: #888;
}
</style>
