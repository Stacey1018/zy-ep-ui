export function rollupPluginCompileStyleEntry() {
  const themeEntryPrefix = `@healthlink/components`
  return {
    name: 'rollup-plugin-compile-style-entry',

    resolveId(id) {
      // 匹配是否满足 @xxx/vc-el.. 开头的字符
      if (!id.startsWith(themeEntryPrefix)) return
      return {
        // 将 scss 字符替换成 css
        id: id.replaceAll('.scss', '.css'),
        external: 'absolute',
      }
    },
  }
}
