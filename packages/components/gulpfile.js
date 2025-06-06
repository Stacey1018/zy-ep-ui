import { series, parallel } from 'gulp'
import gulp from 'gulp'
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass'
import { build } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import path from 'path'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import glob from 'fast-glob'
import rename from 'gulp-rename'
// import { rollupPluginCompileStyleEntry } from "./rollupPluginCompileStyleEntry.js"
import { promises as fs } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
// console.log("dirname", __dirname)

const files = await glob('**/*.{js,ts,vue}', {
  cwd: path.resolve(__dirname, 'src'),
  absolute: true,
  onlyFiles: true,
})

export const cleanDist = async () => {
  const distPath = path.resolve(process.cwd(), 'dist')
  try {
    await fs.rm(distPath, { recursive: true, force: true })
    console.log('✔ dist 目录已删除')
  } catch (err) {
    console.error('删除 dist 目录失败:', err)
  }
}

// console.log("files", files)

export const elpBuildModules = async (done) => {
  try {
    await build({
      cssCodeSplit: true,
      plugins: [
        // rollupPluginCompileStyleEntry(),
        vue(),
        dts({
          entryRoot: resolve(__dirname, 'src'),
          outDir: ['dist/es', 'dist/lib'],
          insertTypesEntry: true,
        }),
        // Components({
        //   resolvers: [
        //     ElementPlusResolver({
        //       importStyle: 'false', // or 'scss'
        //     }),
        //   ],
        // }),
      ],
      resolve: {
        alias: {
          '@healthlink/components': path.resolve(__dirname),
        },
      },
      build: {
        lib: {
          // entry: resolve(__dirname, "packages/index.ts"),
          entry: files,
          name: 'hl-fe-components',
          fileName: (format) => `hl-fe-components.${format}.js`,
          formats: ['es', 'cjs', 'umd'],
        },
        minify: 'false', // 默认就是 esbuild，可省略
        esbuild: {
          drop: [], // 不丢弃 console 和 debugger
          // drop: ['console', 'debugger'] 表示移除；这里留空表示不移除
        },
        rollupOptions: {
          // 确保外部化处理那些你不想打包进库的依赖
          external: [
            'vue',
            'element-plus',
            '@element-plus/icons-vue',
            'vue-advanced-cropper',
            'path',
            'fs',
            'pdfjs-dist',
            'pdfjs-dist/build/pdf.worker.js',
            // 添加样式文件匹配规则
            /element-plus[/\\]theme-chalk/, // 匹配 element-plus 样式文件
          ],
          // input: resolve(__dirname, "packages", "index.ts"), // 'components/index.ts'
          output: [
            {
              dir: 'dist/es', // 指定所有生成的 chunk 被放置在哪个目录中
              format: 'es', // 指定生成的 bundle 的格式
              entryFileNames: '[name].js', // 默认：'[name].js'，类型：string | ((chunkInfo: PreRenderedChunk) => string)
              exports: 'named', // 指定导出模式 named – 适用于使用命名导出的情况
              preserveModules: true, // 将使用原始模块名作为文件名，为所有模块创建单独的 chunk，而不是创建尽可能少的 chunk
              preserveModulesRoot: 'src', // 确保输入的模块会输出到 es 目录下，而不是在 es/components 下
            },
            {
              dir: 'dist/lib',
              format: 'cjs',
              entryFileNames: '[name].cjs',
              exports: 'named',
              preserveModules: true,
              preserveModulesRoot: 'src',
            },
          ],
        },
      },
    })
    done()
    console.log('build成功')
  } catch (error) {
    done(error)
  }
}

// export async function sassCompiler() {
//   const sass = gulpSass(dartSass)
//   return await gulp
//     .src(`./theme/*.scss`) // 入口
//     .pipe(sass.sync()) // 编译
//     .pipe(gulp.dest(`dist/theme`)) // 输出目录
// }

export async function sassCompiler() {
  const sass = gulpSass(dartSass)
  return gulp
    .src(['./theme/*.scss', '!./theme/element-theme.scss', '!./theme/variables.scss']) // 不包括 element-theme.scss
    .pipe(
      sass.sync({
        includePaths: [
          // 关键：明确指定 node_modules 的绝对路径
          path.resolve(__dirname, 'node_modules'),
          // 可选：如果组件库自身依赖其他路径，可添加
          path.resolve(__dirname, '../../node_modules'),
          path.resolve(__dirname, 'theme'),
        ],
      })
    ) // 编译 scss 为 css
    .pipe(gulp.dest('dist/theme')) // 输出到 dist/theme
}

export async function copyScssFiles() {
  return gulp
    .src('./theme/*.scss') // 拷贝所有 scss 文件
    .pipe(gulp.dest('dist/theme'))
}

export async function copyAssets() {
  return (
    gulp
      .src('./src/**/style/index.ts') // 匹配所有的 index.ts 文件
      // .pipe(replace(/\.scss/g, '.css')) // 替换文件内容中的 .scss 为 .css
      .pipe(
        rename((path) => {
          if (path.extname === '.ts') {
            path.extname = '.js' // 重命名扩展名为 .js
          }
        })
      )
      .pipe(gulp.dest('dist/es')) // 拷贝到 dist/es 目录
      .pipe(gulp.dest('dist/lib'))
  ) // 拷贝到 dist/lib 目录
}
export default series(cleanDist, parallel(elpBuildModules), copyScssFiles, copyAssets)
