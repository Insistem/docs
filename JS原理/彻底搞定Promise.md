掘金： https://juejin.im/post/5e5f52fce51d4526ea7efdec

简书：https://segmentfault.com/a/1190000018428848?utm_source=tag-newest

知乎：https://zhuanlan.zhihu.com/p/42377418

[史上最详细的手写Promise教程](https://juejin.im/post/5b2f02cd5188252b937548ab)



规范在哪里找

源码在哪里看

# 【promise的前世今生系列】

- 面试必问的几个问题

  - promise是什么，怎么理解
  - 自己写一个
  - promise的执行顺序

- 社区解决方案 - Q、when、jQuery-Deffered

- 官方化 - Promise/A+

- Generator、async/await

- 实战篇 - 人人能搞懂的promise执行顺序

  - 透过原理看执行顺序

  - https://juejin.im/post/5dabf847e51d4524d674881c

  - https://juejin.im/post/5dad3405f265da5bb252ff32

  - ```js
    new Promise((resolve, reject) => {
      console.log("log: 外部promise");
      resolve();
    })
      .then(() => {
        console.log("log: 外部第一个then");
        new Promise((resolve, reject) => {
          console.log("log: 内部promise");
          resolve();
        })
          .then(() => {
            console.log("log: 内部第一个then");
          })
          .then(() => {
            console.log("log: 内部第二个then");
          });
      })
      .then(() => {
        console.log("log: 外部第二个then");
      });
    // 答案
    log: 外部promise
    log: 外部第一个then
    log: 内部promise
    log: 内部第一个then
    log: 外部第二个then
    log: 内部第二个then
    ```

  - 

  - 执行顺序的辨别方式

本文将采用追溯法，带你追根溯源的了解前端是如何从异步编程的噩梦中逃脱出来，如今可以使用同步的方式来编写异步的代码



### 人人都能懂的Promise原理剖析

#### 前言

js无法避开异步编程，业务复杂起来，就会出现回调地狱。问题有两个：1.异步编程不顺应正常人的习惯，不直观，不容易理解；2.维护困难



### 追溯法看Promise发展的心路历程



### 概念

> `promise`是异步编程的一种解决方案。所谓Promise，简单来说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上来说，`promise`是一个对象，从它可以获取异步操作的消息

##### 特点 

- 对象的状态不受外界影响
- 一旦状态改变就不会再变，任何时候都可以得到这个结果

##### 基础用法

这里只是简单介绍用法，详细使用请移步阮一峰老师的[es6入门](https://es6.ruanyifeng.com/)，

API：

- `Promise.prototype.then()`
- `Promise.prototype.catch()`
- `Promise.all()`
- `Promise.race()`
- `Promise.resolve()`
- `Promise.reject()`

### 各种不同的实现

-  jQuery中的 deffered
- Q
-  when 
- Iterator Generator
  - 由于生成器支持在函数中暂停代码执行,因而可以深入挖掘异步处理的更多用法。如果需要嵌套回调化序列化一系列的异步操作,事情会变得非常复杂。此时,生成器和yield语句就派上用场了。

### 链式调用原理

参考： [promise的链式调用原理](https://juejin.im/post/5e34ec75e51d4557e86e9dff)

[图解promise调用过程](https://juejin.im/post/5ecbdfe6e51d45784960ab2b)

[promise链式调用](https://juejin.im/post/5e9948636fb9a03c8122cbad)

