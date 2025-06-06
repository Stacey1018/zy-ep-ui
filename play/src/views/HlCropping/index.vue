<template>
  <div class="demo-container">
    <h1>Vue 图片裁剪器</h1>

    <div class="demo-content">
      <!-- 裁剪区域 -->
      <div class="cropper-wrapper">
        <hl-cropping
          ref="cropperRef"
          :src="imageSrc"
          :aspect-ratio="aspectRatio"
          :image-restriction="imageRestriction"
          :class="cropperClass"
          :quality="quality"
          :auto-zoom="autoZoom"
          :shape="shape"
          @ready="onCropperReady"
          @change="onCropperChange"
          @error="onCropperError"
        />
      </div>

      <!-- 控制面板 -->
      <div class="control-panel">
        <div class="form-group">
          <label>选择图片：</label>
          <input type="file" accept="image/*" class="file-input" @change="onFileChange" />
        </div>

        <div class="form-group">
          <label>选择裁剪类型：</label>
          <select v-model="shape" class="form-control">
            <option value="rectangle">矩形</option>
            <option value="circle">圆形</option>
          </select>
        </div>

        <div v-if="shape != 'circle'" class="form-group">
          <label>宽高比：</label>
          <select v-model="aspectRatio" class="form-control">
            <option :value="1">1:1 (正方形)</option>
            <option :value="4 / 3">4:3 (标准)</option>
            <option :value="16 / 9">16:9 (宽屏)</option>
            <option :value="NaN">自由比例</option>
          </select>
        </div>

        <button class="action-btn primary" @click="cropImage">
          <span v-if="!isCropping">裁剪图片</span>
          <span v-else class="loading-text">裁剪中...</span>
        </button>
        <button class="action-btn secondary" @click="resetCropper">重置</button>
      </div>

      <!-- 预览区域 -->
      <div v-if="croppedImage || cropError" class="preview-area">
        <h3>裁剪结果</h3>
        <div v-if="cropError" class="error-message">
          {{ cropError }}
        </div>
        <img v-if="croppedImage" :src="croppedImage" alt="裁剪结果" class="preview-image" />
        <div v-if="croppedImage" class="action-buttons">
          <button class="download-btn" @click="downloadImage">下载图片</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import HlCropping, {
  type VueCropperExpose,
  type VueCropperImageRestriction,
  type VueCropperType,
} from '../../components/hl-cropping/src/index'
// 裁剪组件引用
const cropperRef = ref<VueCropperExpose | null>(null)

// 裁剪器类名
const cropperClass = ref<string | null>(null)
const quality = ref<number>(0.9)
// 是否自动缩放以适应容器
const autoZoom = ref<boolean>(true)
const imageRestriction = ref<VueCropperImageRestriction>('fill-area')
// 图片地址
const imageSrc = ref<string>('')
const aspectRatio = ref(1)
const croppedImage = ref<string | null>(null)
const cropError = ref<string | null>(null)
const isCropping = ref(false)
const shape = ref<VueCropperType>('rectangle')
/**
 * 文件选择处理
 */
function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    if (event.target?.result) {
      imageSrc.value = event.target.result as string
      cropError.value = null
      croppedImage.value = null
    }
  }
  reader.onerror = () => {
    cropError.value = '文件读取失败'
  }
  reader.readAsDataURL(file)
}

/**
 * 裁剪器准备就绪回调
 */
function onCropperReady() {
  console.log('裁剪器已准备就绪')
}

/**
 * 裁剪区域变化回调
 */
function onCropperChange(coordinates: any) {
  console.log('裁剪区域已更改:', coordinates)
}

/**
 * 裁剪器错误回调
 */
function onCropperError(error: Error) {
  cropError.value = `裁剪器错误: ${error.message}`
  console.error('裁剪器错误:', error)
}

/**
 * 执行裁剪操作
 */
async function cropImage() {
  if (!cropperRef.value) {
    cropError.value = '裁剪器未初始化'
    return
  }

  isCropping.value = true
  cropError.value = null

  try {
    const result = await cropperRef.value.getResult()
    croppedImage.value = result.dataUrl

    console.log('裁剪结果:', {
      size: result.size,
      coordinates: result.coordinates,
    })
  } catch (error) {
    cropError.value = `裁剪失败: ${error instanceof Error ? error.message : String(error)}`
    console.error('裁剪失败:', error)
  } finally {
    isCropping.value = false
  }
}

/**
 * 重置裁剪器
 */
function resetCropper() {
  cropperRef.value?.reset()
  croppedImage.value = null
  cropError.value = null
}

/**
 * 下载图片
 */
function downloadImage() {
  if (!croppedImage.value) return

  const link = document.createElement('a')
  link.href = croppedImage.value
  link.download = `cropped-image-${Date.now()}.jpg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped lang="scss">
.demo-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.demo-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-top: 20px;
}

.cropper-wrapper {
  flex: 1;
  min-width: 300px;
  height: 500px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f8f8f8;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.control-panel {
  width: 280px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.file-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
}

.form-control {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
}

.slider {
  width: 100%;
  margin-top: 5px;
}

.action-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn.primary {
  background-color: #4361ee;
  color: white;
}

.action-btn.primary:hover {
  background-color: #3a56d4;
}

.action-btn.secondary {
  background-color: #f8f9fa;
  color: #333;
  border: 1px solid #ddd;
}

.action-btn.secondary:hover {
  background-color: #e9ecef;
}

.loading-text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.preview-area {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.error-message {
  color: #d90429;
  padding: 10px;
  background-color: #fff5f5;
  border-radius: 4px;
  margin-bottom: 15px;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  display: block;
  margin: 15px 0;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.download-btn {
  flex: 1;
  padding: 8px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-btn:hover {
  background-color: #3a56d4;
}
</style>
