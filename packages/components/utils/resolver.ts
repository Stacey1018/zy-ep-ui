function toKebabCase(str: string): string {
  // 移除 Hl 前缀
  const rawName = str.replace(/^Hl/, '')
  // 将驼峰转为中划线，并拼接前缀 hl-
  return (
    'hl-' +
    rawName
      .replace(/([A-Z])/g, '-$1')
      .toLowerCase()
      .replace(/^-/, '')
  )
}

export function HlElementResolver() {
  return {
    type: 'component' as const,
    resolve: (componentName: string) => {
      // where `componentName` is always CapitalCase
      if (componentName.startsWith('Hl')) {
        const kebabName = toKebabCase(componentName)
        return {
          name: componentName, // 组件名
          from: 'zy-ep-ui', // 组件库名称
          sideEffects: [`zy-ep-ui/dist/es/${kebabName}/style/index`], // 组件样式文件
        }
      }
    },
  }
}
