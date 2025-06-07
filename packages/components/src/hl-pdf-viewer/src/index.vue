<template>
  <div class="hl-pdf-viewer">
    <div v-if="showToolbar" class="hl-pdf-toolbar">
      <div></div>
      <div class="hl-pdf-toolbar-zoom">
        <el-icon class="zoom-btn btn-min" :disabled="!canZoomOut || isRendering" @click="zoomOut"><Minus /></el-icon>
        <span class="zoom-text">{{ (scale * 100).toFixed(0) }}%</span>
        <el-icon class="zoom-btn btn-plus" :disabled="!canZoomIn || isRendering" @click="zoomIn"><Plus /></el-icon>
      </div>
      <div class="hl-pdf-toolbar-download">
        <el-icon class="download-btn" @click="handleDownload"><Download /></el-icon>
      </div>
    </div>
    <div id="hl-pdf-viewer" ref="viewerRef" class="hl-pdf-container"></div>
  </div>
</template>

<script setup lang="ts">
import { ElIcon } from 'element-plus'
import { Download, Plus, Minus } from '@element-plus/icons-vue'
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.js'

import { ref, watch, nextTick } from 'vue'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

console.log('pdfjsLib', pdfjsLib)

defineOptions({
  name: 'HlPdfViewer',
})

const props = withDefaults(
  defineProps<{
    pdf: string | ArrayBuffer | Blob
    showToolbar?: boolean
  }>(),
  {
    showToolbar: true,
  }
)

// 内部缓存一个副本，防止 ArrayBuffer 被 detach
const internalPdfData = ref<string | ArrayBuffer | null>(null)

const scale = ref(1.0)
const MIN_SCALE = 0.5
const MAX_SCALE = 3.0
const SCALE_STEP = 0.1

const canZoomIn = ref(true)
const canZoomOut = ref(true)

const isRendering = ref(false)

const updateZoomButtonsState = () => {
  canZoomIn.value = scale.value + SCALE_STEP <= MAX_SCALE
  canZoomOut.value = scale.value - SCALE_STEP >= MIN_SCALE
}

const viewerRef = ref<HTMLDivElement | null>(null)

const renderPdf = async (pdfData: string | ArrayBuffer) => {
  if (!viewerRef.value) return
  if (isRendering.value) return

  isRendering.value = true
  viewerRef.value.innerHTML = ''

  const loadingTask = pdfjsLib.getDocument(typeof pdfData === 'string' ? pdfData : { data: pdfData })

  try {
    const pdfDoc = await loadingTask.promise
    const container = viewerRef.value
    const totalPages = pdfDoc.numPages

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdfDoc.getPage(i)
      const viewport = page.getViewport({ scale: scale.value })

      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      canvas.style.display = 'block'
      canvas.style.margin = '0 auto'
      const context = canvas.getContext('2d')
      if (!context) continue
      const renderContext = {
        canvasContext: context,
        viewport,
      }
      await page.render(renderContext).promise

      const pageWrapper = document.createElement('div')
      pageWrapper.className = 'pdf-page-wrapper'
      pageWrapper.style.position = 'relative'
      pageWrapper.style.width = `${viewport.width}px`
      pageWrapper.style.height = `${viewport.height}px`
      pageWrapper.style.marginBottom = '16px'

      const textLayerDiv = document.createElement('div')
      textLayerDiv.className = 'textLayer'
      textLayerDiv.style.position = 'absolute'
      textLayerDiv.style.top = '0'
      textLayerDiv.style.left = '0'
      textLayerDiv.style.height = `${viewport.height}px`
      textLayerDiv.style.width = `${viewport.width}px`

      const textContent = await page.getTextContent()
      await pdfjsLib.renderTextLayer({
        textContentSource: textContent,
        container: textLayerDiv,
        viewport,
        textDivs: [],
      })

      pageWrapper.appendChild(canvas)
      pageWrapper.appendChild(textLayerDiv)
      container.appendChild(pageWrapper)
    }
  } catch (error) {
    console.error('Error rendering PDF:', error)
  } finally {
    isRendering.value = false
  }
  updateZoomButtonsState()
}

const clonePdf = async (pdf: string | ArrayBuffer | Blob): Promise<string | ArrayBuffer> => {
  if (typeof pdf === 'string') {
    return pdf
  } else if (pdf instanceof Blob) {
    return await pdf.arrayBuffer()
  } else {
    return pdf.slice(0) // 这里是为了放大缩小的时候防止arrayBuffer被detach
  }
}

const zoomIn = async () => {
  if (canZoomIn.value) {
    scale.value += SCALE_STEP
    const normalizedPdf = await clonePdf(props.pdf)
    await renderPdf(normalizedPdf)
  }
}

const zoomOut = async () => {
  if (canZoomOut.value) {
    scale.value -= SCALE_STEP
    const normalizedPdf = await clonePdf(props.pdf)
    await renderPdf(normalizedPdf)
  }
}

const handleDownload = () => {
  if (!props.pdf) return

  let blob: Blob
  let fileName = 'document.pdf'

  if (typeof props.pdf === 'string') {
    // 如果是 URL，则尝试 fetch 内容再下载
    fetch(props.pdf)
      .then((res) => res.blob())
      .then((fetchedBlob) => {
        downloadBlob(fetchedBlob, fileName)
      })
      .catch((err) => {
        console.error('下载失败：', err)
      })
  } else {
    // 如果是 ArrayBuffer，直接转成 Blob 下载
    blob = new Blob([props.pdf], { type: 'application/pdf' })
    downloadBlob(blob, fileName)
  }
}

const downloadBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

watch(
  () => props.pdf,
  async (val) => {
    if (!val) return
    await nextTick()
    const normalizedPdf = await clonePdf(props.pdf)
    await renderPdf(normalizedPdf)
  },
  { immediate: true }
)

watch(
  scale,
  () => {
    updateZoomButtonsState()
  },
  { immediate: true }
)
</script>
