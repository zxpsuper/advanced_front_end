module.exports = {
    base: "/Demo/advanced_front_end/",
    title: "前端进阶小书",
    description: "小皮咖前端经验整理而写成的一本书",
    markdown: {
        lineNumbers: true,
        anchor: {
            permalink: true,
            permalinkBefore: true,
            permalinkSymbol: "#",
        },
    },
    themeConfig: {
        nav: [
            { text: "Home", link: "/" },
            {
                text: "Github",
                link: "https://github.com/zxpsuper/advanced_front_end",
            },
        ],
        sidebar: [
            {
                title: "CSS 大全",
                collapsable: false,
                children: ["/css/cssTips", "/css/flex", "/css/css3"],
            },
            {
                title: "算法与数据结构",
                collapsable: false,
                children: [
                    "/suanfa/binarySearch",
                    "/suanfa/sort",
                    "/suanfa/dataStructure",
                ],
            },
            {
                title: "浏览器相关",
                collapsable: false,
                children: [
                    "/browser/https",
                    "/browser/static",
                    "/browser/cache",
                    "/browser/cors",
                    "/browser/eventloop",
                    "/browser/urlrender",
                    "/browser/garbage",
                    "/browser/garbagerefuse",
                ],
            },
            {
                title: "Vue",
                collapsable: false,
                children: [
                    "/vue/vue",
                    "/vue/router",
                    "/vue/vueplugin",
                    "/vue/vuedate",
                    "/vue/computedvswatch",
                ],
            },
            {
                title: "Javascript",
                collapsable: false,
                children: [
                    "/js/use_strict",
                    "/js/amd_commonjs",
                    "/js/seajs",
                    "/js/design",
                    "/js/regular_expression",
                    "/js/inherit",
                ],
            },
            {
                title: "Canvas",
                collapsable: false,
                children: [
                    "/canvas/canvas1",
                    "/canvas/canvas2",
                    "/canvas/canvas3",
                ],
            },
            {
                title: "一些插件",
                collapsable: false,
                children: ["/plugin/carousal", "/plugin/underscore"],
            },
            {
                title: "其他",
                collapsable: false,
                children: ["/other/git", "/other/linux"],
            },
        ],
    },
};
