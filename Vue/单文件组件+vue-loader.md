个人理解

因为线上使用的是没有编译器的Vue版本，但是我们写的是.vue的单文件形式，而Vue又无法识别，此时就需要vue-loader登场了，作用就是将.vue形式组织的各种组件，转化成如下格式

```js
Vue.extend({
  data () {
    return {
      demo: '123'
    }
  },
  render(h) {
    return h('div', {
      attrs: {class: 'box'}
    },[
      h('a',{ attrs: {href: '/about'}})
    ])
  }
})
```

其实主要工作就是将模板（.vue单文件这种写法，无非就是换了一种描述模板的形式），转化成render函数。感觉跟[vue-template-compiler](https://github.com/Insistem/vue/tree/mpy-learn/packages/vue-template-compiler)这个包的功能是差不多的

然后在程序真正启动时，直接拿到render函数来生成VNode，再进行_update操作





















































