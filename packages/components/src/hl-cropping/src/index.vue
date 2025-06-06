<template>
  <div class="vue-cropper-container" :style="containerStyle">
    <!-- 加载状态 -->
    <div v-if="loading" class="cropper-loading">
      <slot name="loading">
        <div class="loading-spinner"></div>
      </slot>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="cropper-error">
      <slot name="error">
        <div class="error-message">图片加载失败</div>
      </slot>
    </div>

    <!-- 裁剪器主体 -->
    <vue-advanced-cropper
      v-show="!loading && !error"
      ref="cropperRef"
      :src="src"
      :stencil-props="stencilProps"
      :stencil-component="props.shape === 'circle' ? CircleStencil : undefined"
      :class="cropperClass"
      :auto-zoom="autoZoom"
      :transitions="transitions"
      :debounce="debounce"
      :image-restriction="imageRestriction"
      :move-image="moveImage"
      @ready="onReady"
      @change="onChange"
      @error="onError"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, type CSSProperties } from 'vue'
import { Cropper as VueAdvancedCropper, CircleStencil } from 'vue-advanced-cropper'
import type { Coordinates } from 'vue-advanced-cropper'
import 'vue-advanced-cropper/dist/style.css'
import type { VueCropperProps, VueCropperEmits, CropResult, VueCropperExpose, EnhancedCropperResult } from './types'

const props = withDefaults(defineProps<VueCropperProps>(), {
  autoZoom: true,
  transitions: true,
  debounce: 500,
  imageRestriction: 'fill-area',
  moveImage: true,
  minWidth: 100,
  minHeight: 100,
  disableMove: false,
  disableZoom: false,
  disableRotation: false,
  quality: 0.9,
  outputType: 'image/jpeg',
  shape: 'rectangle',
})

const emit = defineEmits<VueCropperEmits>()

const cropperRef = ref<InstanceType<typeof VueAdvancedCropper> | null>(null)
const loading = ref(false)
const error = ref<Error | null>(null)

// 计算裁剪器的限制条件
const stencilProps = computed(() => ({
  aspectRatio: props.aspectRatio,
  minWidth: props.minWidth,
  minHeight: props.minHeight,
  maxWidth: props.maxWidth,
  maxHeight: props.maxHeight,
  movable: !props.disableMove,
  resizable: !props.disableZoom,
  scalable: !props.disableZoom,
  rotatable: !props.disableRotation,
}))

// 容器样式
const containerStyle = computed<CSSProperties>(() => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
}))

// 监听src变化
watch(
  () => props.src,
  (newSrc) => {
    if (newSrc) {
      loadImage(newSrc)
    }
  },
  { immediate: true }
)

/**
 * 加载图片
 */
async function loadImage(src: string) {
  loading.value = true
  error.value = null
  emit('loading', true)

  try {
    // 这里可以添加图片预加载逻辑
    await new Promise((resolve) => setTimeout(resolve, 100)) // 模拟加载延迟
  } catch (err) {
    error.value = err as Error
    emit('error', error.value)
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

/**
 * 裁剪区域变化回调
 */
function onChange(coordinates: Coordinates) {
  emit('change', coordinates)
}

/**
 * 错误回调
 */
function onError(err: Error) {
  error.value = err
  emit('error', err)
}

/**
 * 裁剪器准备就绪回调
 */
function onReady() {
  emit('ready')
}

/**
 * 安全获取裁剪器状态
 */
function getState(): EnhancedCropperResult | null {
  if (!cropperRef.value) {
    return null
  }
  const result = cropperRef.value.getResult()
  if (!result?.canvas) {
    return null
  }
  return result as EnhancedCropperResult
}

/**
 * 获取裁剪结果
 */
async function getResult(): Promise<CropResult> {
  const state = getState()
  if (!state) {
    throw new Error('裁剪失败')
  }

  // 转换为Blob
  const blob = await new Promise<Blob | null>((resolve) => {
    state.canvas.toBlob((blob) => resolve(blob), props.outputType, props.quality)
  })

  // 转换为DataURL
  const dataUrl = state.canvas.toDataURL(props.outputType, props.quality)

  return {
    blob,
    dataUrl,
    coordinates: state.coordinates,
    size: state.size,
  }
}

/**
 * 重置裁剪器
 */
function reset() {
  cropperRef.value?.reset()
}

// 暴露方法给父组件
defineExpose<VueCropperExpose>({
  getResult,
  reset,
  getState,
})
</script>

<style scoped>
.vue-cropper-container {
  width: 100%;
  height: 100%;
  background-color: #f0f0f0;
}

.cropper-loading,
.cropper-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
}
</style>
