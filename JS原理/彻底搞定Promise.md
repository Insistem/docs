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

promise解决的是异步编码风格的问题。



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

  - ```js
    // 写法1
    let p = new Promise((resolve, reject) => {
      console.log("log: 外部promise");
      resolve('foo');
    })
    // 写法2
    let p = Promise.resolve('foo')
    // 解释
    // 写法1等同于写法2，都是直接返回一个resolved状态的 Promise 对象
    ```

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



### 特点

1. 通过回调函数延迟绑定
2. 回调函数返回值穿透的技术，解决了循环嵌套
3. Promise 对象的错误具有“冒 泡”性质，会一直向后传递，直到被 onReject 函数处理或 catch 语句捕获为止。具备了这 样“冒泡”的特性后，就不需要在每个 Promise 对象中单独捕获异常了

### 核心

Chrome内部实现promise过程中使用了微任务来延迟绑定回调函数，所以使用了promise就会创建一个微任务

### 问题点

1. Promise 中为什么要引入微任务?
2. Promise 中是如何实现回调函数返回值穿透的?
3. Promise 出错后，是怎么通过“冒泡”传递给最后那个捕获异常的函数?



准确地说，Promise在执行resolve或者reject时，触发微任务，所以在Promise的executor函数 中调用xmlhttprequest会触发宏任务。如果xmlhttprequest请求成功了，通过resolve触发微任务



### 究极进化 - async/await的实现

**ES7 引入了 async/await，这是 JavaScript 异步编程的一个重大改进，提 供了在不阻塞主线程的情况下使用同步代码实现异步访问资源的能力，并且使得代码逻辑更 加清晰**

#### 生成器函数

可以暂停和恢复

#### 协程

**一种比线程更加轻量级 的存在**

























