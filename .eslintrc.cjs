const path = require('path')
const fs = require('fs')
const autoImportConfigPath = path.resolve(__dirname, './.eslintrc-auto-import.json') // 使用绝对路径
const extendsConfig = [
  // 'eslint:recommended', // ESLint 推荐规则
  'plugin:vue/vue3-recommended', // Vue3 推荐规则，已包含 eslint:recommended
  'plugin:@typescript-eslint/recommended', // TypeScript 推荐规则
  'plugin:prettier/recommended', // Prettier 推荐规则，需要放在最后
  ...(fs.existsSync(autoImportConfigPath) ? [autoImportConfigPath] : []), // 动态加载
]

module.exports = {
  // 标记为根级配置文件，ESLint 不会继续向上查找配置
  root: true,
  // 指定环境
  env: {
    browser: true, // 浏览器环境
    es2021: true, // 启用 ES2021 特性
    node: true, // Node.js 环境
    'vue/setup-compiler-macros': true,
  },
  // 继承的规则集
  extends: extendsConfig,
  // 指定解析器
  parser: 'vue-eslint-parser', // 用于解析 .vue 文件
  parserOptions: {
    ecmaVersion: 'latest', // 使用最新的 ECMAScript 版本
    parser: '@typescript-eslint/parser', // TypeScript 解析器
    sourceType: 'module', // 使用 ES 模块
    ecmaFeatures: {
      jsx: true, // 启用 JSX
    },
    extraFileExtensions: ['.vue'], // 额外的文件扩展名
  },
  // 插件
  plugins: [
    'vue', // Vue.js 插件
    '@typescript-eslint', // TypeScript 插件
    'prettier', // Prettier 插件
  ],
  // 具体规则配置
  rules: {
    // Vue 相关规则
    'no-undef': 'warn', // 检查未定义变量
    'vue/multi-word-component-names': 'off', // 关闭组件名必须多单词的限制
    'vue/no-v-html': 'off', // 关闭禁止使用 v-html 的限制
    'vue/require-default-prop': 'off', // 关闭 props 必须有默认值的限制
    'vue/max-attributes-per-line': [
      'error',
      {
        // 每行最大属性数量
        singleline: 3, // 单行最多 3 个
        multiline: 1, // 多行每行 1 个
      },
    ],

    // JavaScript 相关规则
    'no-console': 'off', // console 语句警告
    'no-debugger': 'warn', // debugger 语句警告
    'no-unused-vars': 'off', // 关闭未使用变量检查，使用 TypeScript 的检查
    'no-useless-escape': 'off', // 关闭不必要的转义字符检查
  },
  // 特定文件的特定规则
  overrides: [
    {
      files: ['*.ts', '*.tsx'], // TypeScript 文件
      rules: {
        '@typescript-eslint/no-explicit-any': 'off', // 允许使用 any 类型
        '@typescript-eslint/no-unused-vars': 'warn', // 未使用变量警告
        '@typescript-eslint/no-empty-function': 'warn', // 空函数警告
        '@typescript-eslint/ban-ts-comment': 'off', // 允许使用 @ts-ignore 等注释
        '@typescript-eslint/no-non-null-assertion': 'off', // 允许使用非空断言
        '@typescript-eslint/explicit-module-boundary-types': 'off', // 关闭导出函数和类的类型必须明确声明的限制
        '@typescript-eslint/explicit-function-return-type': 'off', // 关闭函数返回类型必须明确声明的限制
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-ignore': 'off', // 允许使用 @ts-ignore 注释
      },
    },
    {
      files: ['*.js', '*.jsx'], // JavaScript 文件
      rules: {
        '@typescript-eslint/no-var-requires': 'off', // 允许使用 require 语句
      },
    },
    {
      files: ['*.vue'], // Vue 文件
      rules: {
        // Vue 文件特定规则
        'vue/max-attributes-per-line': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': 'off', // 未使用变量警告
      },
    },
  ],
}
