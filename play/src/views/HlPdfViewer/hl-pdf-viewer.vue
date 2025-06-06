<template>
  <div id="pdf-viewer" ref="viewerRef" class="pdf-container"></div>
</template>
<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'
import { ref, watch, nextTick } from 'vue'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const props = defineProps<{
  pdf: { type: [string, ArrayBuffer] }
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text'
  size?: 'large' | 'default' | 'small'
  plain?: boolean
  disabled?: boolean
}>()

const viewerRef = ref<HTMLDivElement | null>(null)

const renderPdf = async (pdfData: string | ArrayBuffer) => {
  if (!viewerRef.value) return
  viewerRef.value.innerHTML = '' // 清空上一次渲染内容
  const loadingTask = pdfjsLib.getDocument(typeof pdfData === 'string' ? pdfData : { data: pdfData })

  try {
    const pdfDoc = await loadingTask.promise
    const canvasContainer = viewerRef.value
    const totalPages = pdfDoc.numPages

    for (let i = 1; i <= totalPages; i++) {
      pdfDoc.getPage(i).then((page) => {
        const initialViewport = page.getViewport({ scale: 1 })
        const containerWidth = canvasContainer.clientWidth
        const scale = containerWidth / initialViewport.width // 动态缩放比例
        const viewport = page.getViewport({ scale })

        const canvas = document.createElement('canvas')
        canvas.height = viewport.height
        canvas.width = viewport.width

        const context = canvas.getContext('2d')
        if (!context) return
        const renderContext = {
          canvasContext: context,
          viewport,
        }

        page.render(renderContext)
        canvasContainer.appendChild(canvas)
      })
    }
  } catch (error) {
    console.error('Error loading PDF:', error)
    return
  }
}

watch(
  () => props.pdf,
  async (val) => {
    if (val) {
      await nextTick()
      renderPdf(val)
    }
  },
  { immediate: true }
)
</script>
<style scoped lang="scss">
.pdf-container {
  width: 100%;
}
.pdf-container canvas {
  margin: 0;
  padding: 0;
  display: block; /* 防止 inline-block 默认行为导致额外间距 */
}
</style>
