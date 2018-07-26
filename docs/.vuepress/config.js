module.exports = {
  base: '/advanced_front_end/docs/.vuepress/dist',
  title: '前端进阶小书',
  description: '小皮咖前端经验整理而写成的一本书',
  markdown: {
    lineNumbers: true,
    anchor: { permalink: true, permalinkBefore: true, permalinkSymbol: '#' }
  },
  displayAllHeaders: true,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Github', link: 'https://github.com/zxpsuper/advanced_front_end'}
    ],
    sidebar: [
      {
        title: 'CSS 大全',
        collapsable: false,
        children: [
          '/css/cssTips'
        ]
      },
    ]
  }
}