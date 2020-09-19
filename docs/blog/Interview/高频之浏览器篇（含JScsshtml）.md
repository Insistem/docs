####  01 什么是防抖和节流，他们的应用场景有哪些

#### 02 前端性能优化

参考：https://github.com/wy-ei/notebook/issues/34

JS 、 CSS 、webpack层面的优化



可以分为以下三点：

 - 页面加载性能；

   - 指从发出请求到渲染出完整页面的过程，影响到这个阶段的主要因素有网络

     和 JavaScript 脚本。

 - 动画与操作性能；

    - 避免重排重绘

    - 避免强制同步布局

    - **避免频繁的垃圾回收**

    - css动画代替JS动画

    - 主要是从页面加载完成到用户交互的整合过程，影响到这个阶段的主要因素是

      JavaScript 脚本。

      - **减少** **JavaScript** 脚本执行时间 - 可以分成多个任务或者借助web workers,可以把一些和 DOM 操作无关且耗时的任务放到 Web Workers 中去执行

 - 内存、电量消耗。

   	- 避免内存泄露
   	- 主要是用户发出关闭指令后页面所做的一些清理操作。

	- <img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200907164736128.png" alt="image-20200907164736128" style="zoom:50%;" />

项目打包优化实践： https://juejin.im/post/6844904071896236040

Vue层面的性能优化

- 组件的动态引入

  - const comp = () => import('./about')

- 构建时减小Vue文件的大小

  - 线上版本，只需要使用Vue的运行时版本即可，比完整版本体积小30%？？这个如何配置呢？

- 避免一些内存泄露问题

- 路由的缓存

- 还有一些写法 容易导致不必要的依赖收集 从而触发组件的重新渲染

  - 多次对data中的属性赋值，会有什么影响？会导致多次渲染吗？什么情况会，什么情况不会？
  - 每次状态的改变都会生成一个微任务，DOM的变化也会生成一个微任务，内部都是用的nextTick函数
  - 但是有个规则： 在一轮事件循环中，vm.$nextTick只会向任务队列添加一个任务

- 减少页面dom个数，更新diff的时候  对比速度快？？

- 

  

#### 03 内存泄露

列举几个项目中出现的内存泄露的场景，怎么出现的，如何避免的

- 使用echarts

#### 04 各种函数实现或手写

#### 05 从输入URL到页面展示发生了什么？

参考：https://xie.infoq.cn/article/9066d97f021319a6bac5f9eb5

浏览器从磁盘或网络读取 HTML 的原始字节，并根据文件的指定编码（例如 UTF-8）将它们转换成各个字符。下一步通过状态机去做分词，将字符串转换成 Token ，每个 Token 都具有特殊含义和一组规则。Token 会被转换成定义了属性等规则的“对象”，同时利用栈构建 DOM 树

词法分析 ： 通过状态机去做分词，将字符串转换成 Token

async 就是可以让这个 JS 代码异步执行。defer 是表明 JS 代码不会操作 DOM 的结构，它会先下载，在 DOM 树解析完之前去执行它。

﻿

 - 缓存检查 - 开启一个网络进程
 - DNS解析
 - 建立TCP连接
 - HTTPS还得交换证书
 - 传输数据
 - 拿到HTML页面开始解析 - 开启一个渲染进程
 - 构建DOM树
 - 解析到资源，开始下载资源， JS 代码的执行 ，（JS可能会更改DOM树）会阻碍HTML的解析，这里style文件的下载,不会阻碍HTML解析，因为最终没有css页面也会显示出来，
 - 构建cssOM - 1. 转为styleSheets结构中的数据，具备了查询和修改功能 - 2. 样式计算，computedStyle 继承 层叠（优先级） ？？？
 - 构建layout树 - 
    - 计算布局 ？？ 如何 与computedStyle合并的 - 已经知道每个元素的大小，颜色等属性
    - 计算坐标
- 构建分层树 layerTree
 - 图层绘制 - 生成绘制指令
 - 合成，光栅化，GPU   -》 合成线程：合成线程会按照视口附近的图块来优先生成位图，实际生成位图的操作是由栅格化来执行的。所谓栅格化，是指将图块转换为位图
 - 最终生成绘制土块的命令 - drawQuad, 用来接收合成线程发过来的 DrawQuad 命令，浏览器进程里面有一个叫 viz 的组件，然后根据 DrawQuad 命令，将其页面内容绘制到内存中，最后再将内存显示在屏幕上

主体分为 导航阶段 和 渲染阶段

#### 06 浏览器缓存

##### HTTP缓存

 https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ

#### 问题点

1. V8解析后的字节码或热节点的机器码是存在哪的，是以缓存的形式存储 的么?和浏览器三级缓存原理的存储位置比如内存和磁盘有关系么?
2. 字节码和机器码存放的位置是不是不一样啊?既然字节码最后还是要转化为机器码，为什 么说有了字节码之后，就能解决内存占用问题呢?

参考： https://juejin.im/entry/6844903593275817998

https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651226347&idx=1&sn=6dbccc54406f0b075671884b738b1e88&chksm=bd49596f8a3ed079f79cda4b90ac3cb3b1dbdb5bfb8aade962a16a323563bf26a0c75b0a5d7b&scene=21#wechat_redirect

- 如果Expires, Cache-Control: max-age, 或 Cache-Control:s-maxage 都没有在响应头中出现, 并且也没有其它缓存的设置, 那么浏览器默认会采用一个启发式的算法, 通常会取响应头的Date_value - Last-Modified_value值的10%作为缓存时间.

- ![image-20200909192636806](/Users/mpy/Library/Application Support/typora-user-images/image-20200909192636806.png)

- 强缓存 -  200 from disk cache / from memory cache 

  - Cache-control 高于一切
  - ![image-20200907161553828](/Users/mpy/Library/Application Support/typora-user-images/image-20200907161553828.png)
  - Expires 过期日期

- 协商缓存 -  304 not modified    

  - Etag / if-none-match   

    - 会根据If-None-Match的字段值与该资源在服务器的Etag值做对比，一致则返回304，代表资源无更新，继续使用缓存文件；不一致则重新返回资源文件，状态码为200 

  - last-modified / if-modified-since

    - 根据If-Modified-Since的字段值与该资源在服务器的最后被修改时间做对比

    ![image-20200907162528300](/Users/mpy/Library/Application Support/typora-user-images/image-20200907162528300.png)

协商缓存和强缓存的应用场景和具体的实现方式是怎样的??

#### 07：垃圾回收

栈中的

堆中的

新生代：生存时间短，复制算法

老生代：大对象，标记-清除算法

#### 08：消息队列和事件循环

 

#### 09：toy-broswer

状态机的应用

- 处理后端返回来的一个个字符
  - 通过状态机，拆分成对象包含status、headers、body等属性
- 通过状态机+栈将HTML内容转为dom树
- 利用css第三方包来讲css转为AST结构 - style中的css
- 解析到每个元素都调用下computedCSS 将行内和style中的属性加到这个元素上, 通过stack可以获取到当前元素的父元素
  - ![image-20200908225011718](/Users/mpy/Library/Application Support/typora-user-images/image-20200908225011718.png)











































