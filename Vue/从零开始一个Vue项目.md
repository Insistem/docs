vue-cli 3.0 配置

vue.config.js



webpack 配置



Vue项目中使用JSX需要注意的问题：

> JSX语句只有写在.vue的文件中才能被解析，通过mixins引入的文件也可以，但是通过import引入的文件不可以，特此记录



### Vue cli3.0 使用过程中问题汇总

**[vue-cli 3** 跑项目时卡在 **‘98%’ after emitting CopyPlugin** 无法运行](https://blog.csdn.net/qq_41619796/article/details/102834087)，因为项目中 `import demo from ''` 这里没写导致的

