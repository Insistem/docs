### **BFF**应用

参考：https://www.jianshu.com/p/eb1875c62ad3 Backend for Frontent

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200512224622827.png" alt="image-20200512224622827" style="zoom:30%;" />

- 为什么ssr 更利于 SEO？

## commonjs的理解

借此理解下 module.exports 与 exports 有什么区别

可以借助运行shell命令`webpack --devtool none --mode development --target node index.js`，webpack打包出的文件来看，为什么是这样的

## npm 包管理

- 什么是包
  - 别人写的nodejs模块
- 常用的命令
  - npm init
  - npm install
  - npm uninstall 删除某个包
  - npm config set registry https://registry.npm.taobao.org
  - npm config get registry

### 模块介绍

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200507000925267.png" alt="image-20200507000925267" style="zoom:50%;" />

#### 内置模块

EventEmitter

- **观察者模式**
  - 调用 vs 抛事件
    - 关键在于”不知道被通知者存在“
    - 以及”没有人听还能继续下去“

#### 异步

##### 13|异步： Node.js的非阻塞I/O

- 阻塞与非阻塞的区别在于系统接受输入再到输出期间，能不能接收其他输入
- 生活中的例子类比：
  - 系统=食堂阿姨/服务生，输入=点菜，输出=端菜
  - 在你点菜到拿到菜这个过程中:
  - 饭堂阿姨只能一分一分的给你打菜 -> 阻塞I/O
  - 服务生给你点完菜之后还可以服务其他客人 -> 非阻塞I/O
- 理解非阻塞I/O的要点在于
  - *确定一个进行Input/Output的系统*
  - 思考在I/O过程中，能不能进行其他I/O
- 代码演示 - glob（Train-myself/kaikeba/nodejs/gekee-node/4.nonblocking）

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200507214611166.png" alt="image-20200507214611166" style="zoom:50%;" />

#### 14|异步：异步编程之callback

- 回调函数格式规范
  - Error-first callback
  - Node-style callback
  - 第一个参数是error，后面的参数才是结果
- 异步编程容易出现的问题
  - 回调地狱
  - 异步的并发
- 历史的解决方案： 
  - node中的async.js
  - Thunk

### 15|异步：事件循环

- *try catch 的异常捕获机制* ??
  - 在调用栈中，上层的抛错 throw new Error，会被下层的捕获try catch
  - 只能捕获同一个调用栈中的异常
  - 代码演示- [（Train-myself/kaikeba/nodejs/gekee-node/5.async-callback/index.js）]
- node中与浏览器的事件循环有何不同
- 调用栈与event-loop

### 16|异步：异步编程之Promise

##### promise

- 当前事件循环得不到的结果，但未来的事件循环会给到你结果
- new Promise((resolve,reject)=>{.....})  中间包裹的东西是个异步操作
- 是一个状态机
  - pending
  - Fulfilled/resolved
  - Rejected
  - <img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200507225623911.png" alt="image-20200507225623911" style="zoom:50%;" />

- .then 和 .catch

  - resolve状态的Promise 会回调后面的第一个.then
  - rejected状态的promise会回调后面的第一个.catch
  - 任何一个rejected状态且后面没有.catch的promise，都会造成浏览器/node环境的全局错误

- resolve() 和 rejecte()

  - ```js
    var promise = new Promise(function(resolve,reject){
      setTimeout(function(){
        resolve(33) // 用来扭转Promise的pending状态为resolved状态
      },80)
      setTimeout(function(){
        reject(new Error(22)) // 无法再扭转为rejected
      },80)
    }).then(function(res){
      console.log(res) // promise状态变为resolved时会立即出发then中的回调
    }).catch(function(err){
      console.log(err)
    })
    ```

  - 一旦状态改为resolved状态就不会被再更改为rejected

- Promise 是如何解决异步流程控制的问题的呢 

  - 示例演示 - 在原来callback方式的interview函数基础上改成promise
  - 执行then和catch会返回一个新promise，该promise最终状态根据then和catch的回调函数的执行结果决定
    - 如果回调函数最终是throw，该Promise是rejected状态
    - 如果回调函数最终是return，该Promise是resolved状态
    - 但如果回调函数最终return了一个Promise，该Promise会和回调函数return的Promise状态保持一致

### 17|异步：异步编程之async-await 

##### async/await 

- Async function 是Promise的语法糖封装
- 异步编程的重疾方案 - 以同步的方式写异步
  - await关键字可以"暂停”async function 的执行
  - await 关键字可以以同步的写法获取Promise的执行结果
  - try-catch 可以获取await所得到的错误

#### 小知识点

- 只加了async的函数代表了什么含义

  - 相当于`return new Promise(resolve=> resolve())`，也就是说return了一个理解resolved的promise对象
  - `async function demo(){ return 123}` 相当于 `function demo(){ return new Promise(resolve=>resolve(123))}`

- 调用栈的理解

  - ```js
    function demo() {
        console.log(2)
     }
    console.log('demo',  demo())
    // 打印顺序
    > 2
    > demo undefined
    ```



### 18|HTTP：什么是HTTP服务器？

#### 是什么

- 应用层协议
- 五层网络协议
  - 应用层  - HTTP HTTPS
  - 运输层 - TCP UDP
  - 网络层 - IPv4 IPv6
  - 数据链路层 - mac
  - 物理层 - 光纤

#### 练习——石头剪刀布-online版

### 21|HTTP：用express重构石头剪刀布

#### 要了解一个框架，最好的方法是

- 了解他的关键功能
- 推导出他要解决的问题是什么

#### Features

- Robust routing
- Focus on high performance
- Super-high test coverage
- HTTP helpers (redirection, catching, etc)
- View system supporting 14+ template engines
- Content negotiation
- Executable for generating applications quickly

#### 核心功能

- 路由

- request/response 简化

  - request： pathname, query, etc
  - response： send() , json(), jsonp() , etc
    - response.status(200)
    - response.send('hello world')

- 中间件 - 洋葱模型

  - 缺陷1 ：对异步的支持不太好，催生了下一代的koa

  - 缺陷2 ： 通过res传递自定义变量，怪怪的

  - ```js
    // 使用方式
    app.get( // 这里接受很多个function
       '/game',
       function(req,res,next){
         console.log(1)
         next()
         console.log(3)
       },
       function(req,res,next){
         console.log(2)
       },
     )
    ```

    

### 22|HTTP:用koa重构石头剪刀布游戏

#### koa核心功能

- Midlleware
  - 使用 async function 实现的中间件
  - 有”暂停执行“能力
  - 在异步的情况下也符合洋葱模型
- Context - ctx.status,  ctx.req  或者在上面挂一些自定义的变量，比express中将一些自定义的变量挂在res上更符合语义
  - ctx.status = 200
  - ctx.body = 'hello world'
- 极简设计 - 路由需要中间件引入 - 使用koa-mount

#### 小问题

- ```js
  app.use(
    mount('/', function(){})
  )
  app.use(
    mount('/game', function(){})
  )
  
  // 这种顺序的写法，会导致请求 http://localhost:3000/game 总是会被上面那个拦截
  // 必须要把‘/’ 这个放到下面才行
  ```

### 23|RPC调用：什么是RPC调用？

#### RPC调用

- Remote Procedure Call 远程过程调用

#### 与Ajax的异同

- 相同点
  - 都是两个计算机间的网络通信
  - 需要双方约定一个数据格式
- 不同点
  - 不一定使用DNS作为寻址服务
  - 应用层协议一般不使用HTTP
    - 二进制协议 - 更小的数据包体积
    - 二进制协议 - 更快的编解码速率
  - 基于TCP或UDP协议

#### TCP通信方式

- 单工通信：单向独木桥
- 半双工通信：双向独木桥（也叫轮番单工）
- 全双工通信：双向车道

### 24|RPC调用：node  Buffer编解码二进制数据包

- Buffer.from()
- Buffer.alloc() : 创建指定长度的二进制
- Buffer.writeInt8()
- 手动将`{name:'ss', age:12}`的对象转为二进制协议所需要的二进制数据，肯定是很麻烦，有没有类似`JSON.stringify()`的函数，一键生成呢
  - protocol buffer - google提供的 - https://developers.google.com/protocol-buffers/docs/proto
  - npm - protocol buffers - https://www.npmjs.com/package/protocol-buffers

### 25|RPC调用：Node.js net建立多路复用的RPC通道

这一节不是很明白？？？？

### 26|项目启动：整体需求分析

- 三个页面
  - 首页
  - 详情页
  - 课程播放页
  - app下载页
- 设计网站的架构

### 28|课程详情：详情需求解构

- 解构
  - 使用RPC通信从后台服务器获取数据

- 模板引擎
  - include 子模板
  - xss过滤 模板helper函数

### 29|课程详情：将ES6模板字符串转换为模板引擎

- Node.js中常用模板引擎是ejs
- 通过vm模块编译JS形成的函数- `vm.runInNewContext（）`
  - xss过滤，模板helper函数
  - include子模板
- TODO：
  -  了解下其他的模板解析：https://www.jianshu.com/p/3337f8a13917
  - 状态机 + AST +  正则匹配 ：https://github.com/zhangxiang958/zhangxiang958.github.io/issues/39
  - demo: https://segmentfault.com/a/1190000005705169
  - https://juejin.im/post/5a04a08ff265da430e4e9d42



### 30|课程详情页：详情页需求实现

- RPC的封装
  - 通过8位的header，解决粘包问题，全双工通信的实现
    - [粘包问题解释](https://www.nodejs.red/#/nodejs/net?id=tcp-%e7%b2%98%e5%8c%85%e9%97%ae%e9%a2%98)
    - 如何跟后端协商的实现全双工通信？？

- node包：`easy_sock` - 快速开发基于tcp连接的二进制网络协议接口的nodejs模块

- node包：`proto-buffers`使用基于文件的协议

- `Buffer.readUInt32LE与` [readUInt32BE](https://vimsky.com/examples/usage/node-js-buffer-readuint32le-method.html)

- TODO： 这里有个BUG，只能请求一次，然后服务端报错 - 

-  ```js
  internal/buffer.js:51
      throw new ERR_BUFFER_OUT_OF_BOUNDS();
      ^
  RangeError [ERR_BUFFER_OUT_OF_BOUNDS]: Attempt to write outside buffer bounds
   ```

### 31|课程播放页：需求解构

- API服务 - RESTful
  - 简单易懂
  - 可以快速搭建
  - 在数据的聚合方面有很大劣势
- API服务 - GraphQL
  - [什么是 GraphQL？](https://www.zhihu.com/question/264629587?sort=created)
  - 专注数据聚合，前端要什么就返回什么

### 32|课程播放页：实现

- GraphQL
  - Facebook开发的实现API服务的库
  - 让前端有“自定义查询”数据的能力
- Koa-graphql 中间件
- TODO:自己使用这个写的例子 启动服务之后，在地址栏输入 `http://localhost:4000/?query={comment{id}}` 总是报错`{"errors":[{"message":"Expected {} to be a GraphQL schema."}]}` 不知道是为什么
- **思考题**
  - 自己工作中，有哪些是可以通过GraphQL来处理的场景
  - 后端为啥是一个微服务，占用一个端口吗？

### 34|课程列表页：需求解构

- 后端需要渲染列表
  - 首屏加速
  - SEO
- 前端也需要渲染列表
  - 无刷新过滤、排序
- 前后端使用一套模板渲染，开发效率高
- 前后端同构
  - 同一个模板/组件，可在浏览器渲染，也可在Node.js渲染

### 35|课程列表页： 服务端渲染

- 前后端同构
  - ReactDOMServer.renderToString()
  - VueServerRenderer.renderToString()
- 使用React实现SSR（服务端渲染）
  - 需要安装包
    - @babel/preset-react 
    - @babel/register
    - react
    - react-dom

- 同构的关键

  - 注意职责分离
    - 处理数据
    - 环境

- 同构的理解

  - ###### [JS核心理论之《SPA、CSR、SSR、Prerender原理浅析》](https://zhuanlan.zhihu.com/p/138356519)

- 服务端渲染的技术方案

  - 纯后台技术实现

    - 利用后台语言模板引擎进行服务器端渲染方案落地。对于前端来说，可以利用node作为中间件，然后利用node的ejs模板引擎负责数据填充，最后通过node路由响应机制输出html字符串给客户端浏览器进行渲染；

  - 构建同构应用

    - 同构应用就是可以同时运行在客户端和服务器端的Web应用；这种一般采用webpack构建工具和开源工具进行实现；以下会以Vue来介绍同构应用；这种实现方式相对于上面的方案更复杂，开发难度大；但是可以享受到Vue框架带来的便利（响应式数据，路由无感切换等便利）。前提需要“客户端激活”

    - > **客户端激活：官方术语，可以理解为服务器端渲染成html字符串给浏览器之后，需要引入客户端的bundleClient文件，这个环节就交给客户端处理了；**

- ###### 【小项目】[Vue SSR技术方案落地实现—构建同构应用](https://juejin.im/post/5cf79cee6fb9a07eeb139725)

  - 实现一个小DEMO
  - babel的设置学习
    - 详见 - /项目架构/工程能力.md

### 36|课程列表页：需求实现



 