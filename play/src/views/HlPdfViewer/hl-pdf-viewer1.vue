<template>
  <div id="pdf-viewer" ref="viewerRef" class="pdf-container"></div>
</template>
<script setup lang="ts">
import * as pdfjsLib from 'pdfjs-dist'
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url'
import 'pdfjs-dist/web/pdf_viewer.css'
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer'

import { ref, watch, nextTick } from 'vue'

pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc

const props = defineProps<{
  pdf: string | ArrayBuffer
}>()

const viewerRef = ref<HTMLDivElement | null>(null)

const renderPdf = async (pdfData: string | ArrayBuffer) => {
  if (!viewerRef.value) return
  viewerRef.value.innerHTML = ''

  try {
    const loadingTask = pdfjsLib.getDocument(typeof pdfData === 'string' ? pdfData : { data: pdfData })
    const pdfDoc = await loadingTask.promise

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum)
      const scale = 1.5
      const viewport = page.getViewport({ scale })

      // 创建页面容器
      const pageDiv = document.createElement('div')
      pageDiv.className = 'pdf-page'
      pageDiv.style.position = 'relative'
      pageDiv.style.width = `${viewport.width}px`
      pageDiv.style.height = `${viewport.height}px`

      // Canvas 层
      const canvas = document.createElement('canvas')
      canvas.width = viewport.width
      canvas.height = viewport.height
      const context = canvas.getContext('2d')
      await page.render({ canvasContext: context, viewport }).promise
      pageDiv.appendChild(canvas)

      // Text 层
      const textContent = await page.getTextContent()
      const textLayerDiv = document.createElement('div')
      textLayerDiv.className = 'textLayer'
      textLayerDiv.style.position = 'absolute'
      textLayerDiv.style.top = '0'
      textLayerDiv.style.left = '0'
      textLayerDiv.style.height = '100%'
      textLayerDiv.style.width = '100%'

      // 在渲染文本层时优化：
      for (const item of textContent.items as any[]) {
        const span = document.createElement('span')
        span.textContent = item.str

        const transform = item.transform // PDF 的变换矩阵 [a, b, c, d, e, f]
        const [a, b, c, d, e, f] = transform

        const fontSize = Math.hypot(c, d)
        span.style.position = 'absolute'
        span.style.transform = `matrix(${a}, ${b}, ${c}, ${d}, ${e}, ${f})`
        span.style.transformOrigin = '0 0'

        // ✅ 重点样式控制
        span.style.fontSize = `${fontSize}px`
        span.style.lineHeight = '1'
        span.style.whiteSpace = 'pre'
        span.style.userSelect = 'text'

        // ✅ 这句千万不要加（默认透明会导致复制图层出错）
        // span.style.color = 'transparent'

        textLayerDiv.appendChild(span)
      }

      pageDiv.appendChild(textLayerDiv)
      viewerRef.value.appendChild(pageDiv)
    }
  } catch (error) {
    console.error('Error loading PDF:', error)
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

.pdf-container {
  width: 100%;
  .pdf-page {
    margin-bottom: 16px;
  }
}
.textLayer span {
  position: absolute;
  white-space: pre;
  transform-origin: 0 0;
  color: transparent;
  user-select: text;
}
</style>
