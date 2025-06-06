<template>
  <el-button v-if="isPdf" type="primary" @click="previewByArrayBuffer">点击切换为获取pdf文件流预览pdf</el-button>
  <el-button v-else type="primary" @click="previewByPdf">点击切换为通过本地pdf文件预览pdf</el-button>
  <div class="container">
    <hl-pdf-viewer :pdf="pdf"></hl-pdf-viewer>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const pdf = ref<any>('/sample.pdf')
const isPdf = ref(true)

const downloadFile = async () => {
  const res = await fetch('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
  const arrayBuffer = await res.arrayBuffer()
  return arrayBuffer
}

const previewByArrayBuffer = async () => {
  pdf.value = await downloadFile()
}

const previewByPdf = () => {
  pdf.value = './sample.pdf' // 使用本地文件路径
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 600px;
  border: 1px solid #ccc;
  overflow: auto;
  margin-top: 10px;
}
</style>
