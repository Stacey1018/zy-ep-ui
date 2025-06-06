module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-empty': [2, 'never'], // 强制 subject 非空
    'subject-min-length': [2, 'always', 1], // 至少 1 个字符
    'type-enum': [
      2, //0-关闭规则，1-告警，2-错误
      'always',
      [
        'feat', // 需求名称 ex: git commit -m 'feat: [需求ID]'
        'fix', // 修改内容 ex: git commit -m 'fix: [bugID]page功能优化'
        'build', // 构建工具相关 ex: git commit -m 'build: 构建、配置、规范类等杂项相关'
        'revert', // 版本回滚 ex: git commit -m 'revert: 回滚至[XXXX]，因XXXX'
        'docs', // 文档类更新 ex: git commit -m 'docs: Readme.md更新'
        'static', // 静态资源 ex: git commit -m 'static: 图片、public等静态资源'
        'style', // 样式修改 ex: git commit -m 'style: 单纯的样式修改'
        'perf', // 优化相关 ex: git commit -m 'perf: 技术优化相关'
        'test', // 测试用例相关 ex: git commit -m 'test: 测试用例更新'，不常使用
        'refactor', // 重构，破坏性变动，对项目架构或功能的大型改动（需谨慎提交） ex: git commit -m 'refactor: vue2升级vue3'
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'], // 提交信息必须是小写
  },
}
