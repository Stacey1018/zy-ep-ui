console.log('✅ cz-customizable 配置已加载') // 确保这行能打印
module.exports = {
  types: [
    { value: 'feat', name: 'feat:     ✨ 新功能' },
    { value: 'fix', name: 'fix:      🐛 修复Bug' },
    { value: 'build', name: 'build:    🛠️  构建工具相关' },
    { value: 'revert', name: 'revert:   ⏪ 回退提交' },
    { value: 'docs', name: 'docs:     📝 文档更新' },
    { value: 'static', name: 'static:   📦 静态资源' },
    { value: 'style', name: 'style:    💄 样式修改' },
    { value: 'perf', name: 'perf:     ⚡ 性能优化' },
    { value: 'test', name: 'test:     ✅ 添加测试' },
    { value: 'refactor', name: 'refactor: ♻️  代码重构' },
  ],
  messages: {
    type: '请选择提交类型:',
    subject: '✏️  请填写简要描述（必填）:\n',
    body: '📖  填写详细描述（可选）:\n',
    footer: false,
    confirmCommit: '✅ 确认提交以上内容？',
  },
  subjectLimit: 100,
  skipQuestions: ['footer', 'scope'],
}
