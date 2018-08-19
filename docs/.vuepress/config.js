module.exports = {
  base: '/Demo/advanced_front_end/',
  title: '前端进阶小书',
  description: '小皮咖前端经验整理而写成的一本书',
  markdown: {
    lineNumbers: true,
    anchor: { permalink: true, permalinkBefore: true, permalinkSymbol: '#' }
  },
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
          '/css/cssTips',
          '/css/flex',
          '/css/css3'
        ]
      },
      {
        title: '算法系列',
        collapsable: false,
        children: [
          '/suanfa/binarySearch',
        ]
      },
      {
        title: '浏览器相关',
        collapsable: false,
        children: [
          '/browser/https',
        ]
      },
    ]
  }
}