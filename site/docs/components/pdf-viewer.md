# Pdf预览组件

预览pdf

## 基础用法

<script setup>
  import HlPdfViewer from '../hlComponents/HlPdfViewer.vue'
  
</script>
 <HlPdfViewer/>

```vue
<template>
  <el-button v-if="isPdf" @click="previewByArrayBuffer">点击切换为获取pdf文件流预览pdf</el-button>
  <el-button v-else @click="previewByPdf">点击切换为通过本地pdf文件预览pdf</el-button>
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
```

## Props 属性

| 属性名 | 说明                | 类型                  | 默认值 |
| ------ | ------------------- | --------------------- | ------ |
| `pdf`  | pdf文件路径或文件流 | string \| ArrayBuffer\|Blob | ——     |
| `showToolbar`  | 是否展示导航工具栏 | boolean | true     |
