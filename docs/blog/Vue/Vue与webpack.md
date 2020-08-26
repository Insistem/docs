### Vue中不使用webpack打包工具，写出来的代码是怎样的？为啥需要使用webpack，带来哪些便捷

#### 不使用webpack，如何使用Vue？使用了webpack，加上单文件组件，应该如何编码，发生了哪些转变

#### 也算是从零开始一个单页面应用的指引吧

#### 为啥叫单页面应用？

#### 小问题

经过webpack打包之后的Vue是啥样的， 看报错提示，Vue变成了 `vue__WEBPACK_IMPORTED_MODULE_4__`，也许知道了内部原理，就能看懂这些提示了，对吧？？

```js
// 代码中错误的使用Vue构造函数上的方法，会报以下错误
Vue.directives() // 其实这个方法应该是 directive
Uncaught TypeError: vue__WEBPACK_IMPORTED_MODULE_4__.default.directives is not a function
    at eval (main.js?56d7:9)
    at Module../src/main.js (app.js:1220)
    at __webpack_require__ (app.js:849)
    at fn (app.js:151)
    at Object.1 (app.js:1317)
    at __webpack_require__ (app.js:849)
    at checkDeferredModules (app.js:46)
    at app.js:925
    at app.js:928
```

