<template>
  <div ref="containerRef" class="pdf-container">
    <canvas ref="canvasRef"></canvas>
    <div ref="textLayerRef" class="textLayer"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as pdfjsLib from 'pdfjs-dist'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url'
import 'pdfjs-dist/web/pdf_viewer.css'

// 配置 worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker

const props = defineProps<{
  url: string
  scale?: number
}>()

const downloadFile = async () => {
  const res = await fetch('https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf')
  const arrayBuffer = await res.arrayBuffer()
  return arrayBuffer
}

const containerRef = ref<HTMLDivElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const textLayerRef = ref<HTMLDivElement | null>(null)

const renderPdf = async () => {
  const url = await downloadFile()
  const loadingTask = pdfjsLib.getDocument({ data: url })
  const pdf = await loadingTask.promise
  const page = await pdf.getPage(1) // 可支持分页渲染
  const scale = props.scale || 1.5
  const viewport = page.getViewport({ scale })

  // 设置 canvas 尺寸
  const canvas = canvasRef.value!
  const context = canvas.getContext('2d')!
  canvas.width = viewport.width
  canvas.height = viewport.height

  // 渲染 PDF 页
  await page.render({ canvasContext: context, viewport }).promise

  // 渲染文本层（支持复制）
  const textContent = await page.getTextContent()
  const textLayerDiv = textLayerRef.value!
  textLayerDiv.innerHTML = '' // 清空旧内容

  // ✨ 设置 transform 保证缩放一致
  textLayerDiv.style.transformOrigin = '0 0'
  textLayerDiv.style.transform = `scale(${scale})`
  textLayerDiv.style.width = `${viewport.width / scale}px`
  textLayerDiv.style.height = `${viewport.height / scale}px`

  console.log('scale', scale)
  console.log('viewport', viewport)
  console.log('textLayerDiv', textLayerDiv)
  console.log('textLayerDiv', textContent)

  const { TextLayer } = await import('pdfjs-dist/legacy/build/pdf.mjs')

  const render_task = new TextLayer({
    container: textLayerDiv,
    textContentSource: textContent,
    viewport,
  })
  await render_task.render()
}

onMounted(() => {
  renderPdf()
})

watch(
  () => props.url,
  () => {
    renderPdf()
  }
)
</script>

<style scoped>
.pdf-container {
  position: relative;
  user-select: text;
}

canvas {
  display: block;
}

.textLayer {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: auto;
}
.textLayer span {
  mix-blend-mode: multiply;
  user-select: text;
}
</style>
