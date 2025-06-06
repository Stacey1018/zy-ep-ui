<template>
  <h5>预览pdf</h5>
  <el-button @click="preview">点击预览pdf</el-button>
  <HlPdfViewer :pdf="pdf" page="1"></HlPdfViewer>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import HlPdfViewer from '../../components/hl-pdf-viewerhtml.vue'

const pdf = ref()

const downloadFile = async () => {
  const res = await fetch('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
  const arrayBuffer = await res.arrayBuffer()
  return arrayBuffer
}

const preview = async () => {
  pdf.value = await downloadFile()
}
</script>

<style scoped lang="scss">
.container {
  padding: 10px;
  font-size: 16px;
}
</style>
