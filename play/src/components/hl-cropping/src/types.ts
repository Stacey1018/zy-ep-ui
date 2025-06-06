import type { Coordinates as CropperCoordinates, Size, CropperResult } from 'vue-advanced-cropper'
/**
 * 裁剪坐标类型
 */
export type Coordinates = CropperCoordinates

/**
 * 裁剪组件如何摄影裁剪容器的边界
 * fill-area:图片会缩放以完全填充裁剪区域，保持宽高比，但可能超出边界被裁剪。
 *  * fit-area:图片会缩放以完全适应裁剪区域，保持宽高比，可能留有空白区域。
 * stencil:图片会拉伸以完全匹配裁剪区域的尺寸，可能变形。
 * none:图片不受限制，可以自由调整大小和位置，可能超出裁剪区域。
 */
export type VueCropperImageRestriction = 'fill-area' | 'fit-area' | 'stencil' | 'none'

/**
 * 裁剪类型：rectangle：矩形，circle：圆形
 * @default 'rectangle'
 */
export type VueCropperType = 'rectangle' | 'circle'

/**
 * 裁剪组件的基础属性
 */
export interface VueCropperProps {
  /**
   * 图片地址，可以是本地或远程URL
   */
  src?: string

  /**
   * 默认裁剪区域，基于图片比例 (0-1)
   */
  defaultCoordinates?: Coordinates

  /**
   * 裁剪区域的宽高比，如 1/1 表示正方形，16/9 表示宽屏
   */
  aspectRatio?: number

  /**
   * 图像移动选项
   * @default 'true'
   */
  moveImage?: boolean

  /**
   * 图像位置限制模式
   * @default 'fill-area'
   */
  imageRestriction?: VueCropperImageRestriction

  /**
   * 裁剪器的最小宽度（像素）
   * @default 100
   */
  minWidth?: number

  /**
   * 裁剪器的最小高度（像素）
   * @default 100
   */
  minHeight?: number

  /**
   * 裁剪器的最大宽度（像素）
   */
  maxWidth?: number

  /**
   * 裁剪器的最大高度（像素）
   */
  maxHeight?: number

  /**
   * 是否禁用移动
   * @default false
   */
  disableMove?: boolean

  /**
   * 是否禁用缩放
   * @default false
   */
  disableZoom?: boolean

  /**
   * 是否禁用旋转
   * @default false
   */
  disableRotation?: boolean

  /**
   * 裁剪器类名
   */
  cropperClass?: string

  /**
   * 是否自动缩放以适应容器
   * @default true
   */
  autoZoom?: boolean

  /**
   * 是否启用过渡动画效果
   * @default true
   */
  transitions?: boolean

  /**
   * 变更事件触发前的防抖时间(毫秒)
   * @default 300
   */
  debounce?: string | number

  /**
   * 图片质量 (0-1)
   * @default 0.9
   */
  quality?: number

  /**
   * 输出图片类型
   * @default 'image/jpeg'
   */
  outputType?: 'image/jpeg' | 'image/png' | 'image/webp'

  /**
   * 裁剪类型：rectangle：矩形，circle：圆形
   * @default 'rectangle'
   */
  shape?: VueCropperType
}

/**
 * 裁剪组件的事件定义
 */
export interface VueCropperEmits {
  (e: 'change', coordinates: Coordinates): void
  (e: 'error', error: Error): void
  (e: 'ready'): void
  (e: 'loading', isLoading: boolean): void
}

/**
 * 裁剪结果
 */
export interface CropResult {
  /**
   * 裁剪后的图片Blob对象
   */
  blob: Blob | null

  /**
   * 裁剪后的图片DataURL
   */
  dataUrl: string | null

  /**
   * 裁剪区域坐标
   */
  coordinates: Coordinates

  /**
   * 图片尺寸
   */
  size?: Size
}

/**
 * 增强的裁剪结果类型
 */
export interface EnhancedCropperResult extends CropperResult {
  canvas: HTMLCanvasElement
  coordinates: Coordinates
  size: Size
}

/**
 * 裁剪组件实例类型
 */
export interface VueCropperExpose {
  getResult: () => Promise<CropResult>
  reset: () => void
  getState: () => EnhancedCropperResult | null
}
