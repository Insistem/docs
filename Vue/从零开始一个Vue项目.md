### vue-cli 3.0 配置

使用vue cli3.0的正确姿势 - https://juejin.im/post/6844903928753209358

vue.config.js

基本配置： https://juejin.im/post/6844903784984870919



webpack 配置



Vue项目中使用JSX需要注意的问题：

> JSX语句只有写在.vue的文件中才能被解析，通过mixins引入的文件也可以，但是通过import引入的文件不可以，特此记录



### Vue cli3.0 使用过程中问题汇总

**[vue-cli 3** 跑项目时卡在 **‘98%’ after emitting CopyPlugin** 无法运行](https://blog.csdn.net/qq_41619796/article/details/102834087)，因为项目中 `import demo from ''` 这里没写导致的

### 配置中publicPath的配置

有可能资源不是放在网站的根目录，此时需要配置publicPath， 在项目中可以通过 process.env.BASE_URL变量获取到，当前环境的publicPath

process.env.NODE_ENV 可以获取到当前的环境



#### Vue项目实战思考

参考文章：  [深入理解Vue.js实战](https://godbasin.github.io/vue-ebook/vue-ebook/5.html#_5-1-%E5%B8%B8%E7%94%A8%E6%8C%87%E4%BB%A4)

