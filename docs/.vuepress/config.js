module.exports = {
    title: '前端知识荟萃',
    base: '/blog/',
    shouldPrefetch: () => false,
    description: '作者：前端小小灶',
    themeConfig: {
        // logo: '/assets/img/logo.png',
        // 假定是 GitHub. 同时也可以是一个完整的 GitLab URL
        repo: 'insistem/blog',
        // 自定义仓库链接文字。默认从 `themeConfig.repo` 中自动推断为
        // "GitHub"/"GitLab"/"Bitbucket" 其中之一，或是 "Source"。
        repoLabel: 'Github',

        // 以下为可选的编辑链接选项

        // 假如你的文档仓库和项目本身不在一个仓库：
        // docsRepo: 'vuejs/vuepress',
        // 假如文档不是放在仓库的根目录下：
        docsDir: 'docs',
        // 假如文档放在一个特定的分支下：
        docsBranch: 'master',
        // 默认是 false, 设置为 true 来启用
        editLinks: true,
        // 默认为 "Edit this page"
        editLinkText: '帮阿猪改善此页面！',
        nav: [
            { text: '概述', link: '/' },
            { text: '内容', link: '/blog/' },
        ],
        sidebar: {
            '/blog/': [
                {
                    title: '前言',
                    collapsable: false,
                    children: [
                        '/blog/0.md'
                    ]
                },
                {
                    title: 'JS原理',
                    collapsable: false,
                    children: [
                        '/blog/JS原理/二进制浮点数.md',
                        '/blog/JS原理/事件循环.md',
                        '/blog/JS原理/概论.md',
                        '/blog/JS原理/问题汇总+小知识点.md',
                    ]
                },
                // {
                //     title: '后记',
                //     collapsable: false,
                //     children: [
                //         '/vue-ebook/99.md',
                //     ]
                // }
            ],
        }
    },

};