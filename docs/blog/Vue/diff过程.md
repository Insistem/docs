# 手摸手系列-和你深入浅出源码解析Vue diff过程

### 前言

要理解diff过程，那必须了解虚拟Dom，vue是声明式操作dom，通过描述状态和dom之间的映射关系，将状态渲染成视图，Vue中使用模板来描述状态与Dom之间的映射关系，通过编译将模板转换成渲染函数(render)，执行渲染函数就可以得到一个虚拟节点，然后使用这个虚拟节点树就可以渲染页面。

虚拟Dom的目标就是将虚拟节点(vnode)渲染到视图，如果直接使用虚拟节点覆盖旧节点，会有许多不必要的dom操作，影响性能，所以就需要将虚拟节点与上次渲染视图所使用的旧虚拟节点(oldVnode)进行对比，找出真正需要更新的节点，这一过程中，最重要的就是我们今天所讲的diff过程，闲话不多说，冲就完事了。

### 了解几个重要的概念

#### 1. Vnode

Vnode只是vue.js中的一个类名，用于实例化不同类型的vnode实例，类型有：注释节点，文本节点，元素节点，组件节点，函数式组件节点，克隆节点；仅仅是JS中的一个对象，可以简单的理解成节点描述对象.

Vnode属性简析：

```
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
复制代码
```

根据vnode的属性，上面我们所说的几中类型就可以对应入座：

1. 注释节点： 只有两个有效属性——text和isComment,其余属性全部默认为false或者undefined
2. 文本节点：一个有效属性：text
3. 克隆节点：将现有节点属性全部复制到新节点。克隆节点与被克隆节点唯一区别就是克隆节点的isCloned为true
4. 元素节点：通常会有4个有效属性：tag,data,children,context
5. 组件节点：与元素节点类似，但有componentOptions(组件节点参数),componentInstance(组件实例)独有属性
6. 函数式组件节点：与组件节点类似，但有functionContext和functionOptions独有属性

##### 需要注意的是后面会涉及到的几个属性：

children和parent 通过这个建立其vnode之间的层级关系，对应的也就是真实dom的层级关系

text 如果存在值，证明该vnode对应的就是一个文本节点，跟children是一个互斥的关系，不可能同时有值

tag 表明当前vnode，对应真实 dom 的标签名，如‘div’、‘p’

elm 就是当前vnode对应的真实的dom

### 2.patch函数

vue会在初始化过程之后，组件挂载前会生成虚拟dom，将虚拟dom挂载到vue实例上，：



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="776" height="100"></svg>)



这段代码就是判断是否浏览器环境下，判断条件很简单： typeof window !== 'undefined'，是就执行patch函数，否则的话就不执行任何操作：

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1220" height="264"></svg>)

同时，组件更新的过程，会执行 vm.$el = vm.**patch**(prevVnode, vnode)，它仍然会调用 patch 函数。ok,接下来我们看看patch函数做了写什么：

![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1226" height="526"></svg>)

调用了createPatchFunction函数，而createPatchFunction函数返回了一个patch函数:





![img](https://user-gold-cdn.xitu.io/2020/3/26/17115b88c271498f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

patch函数主要处理(除去边界情况)三种情况:



不存在 oldVnode,则进行createElm

存在 oldVnode 和 vnode，但是 sameVnode 返回 true, 则进行patchVnode

存在 oldVnode 和 vnode，但是 sameVnode 返回 false, 则进行createElm

patch完成之后，新的vnode上会对应生成elm，也就是真实的dom，且是已经挂载到parentElm下的dom

#### 3.sameVnode比较函数

```
function sameVnode (a, b) {  // 是否是相同的VNode节点
  return (
    a.key === b.key && (  // 如平时v-for内写的key
      (
        a.tag === b.tag &&   // tag相同
        a.isComment === b.isComment &&  // 注释节点
        isDef(a.data) === isDef(b.data) &&  // 都有data属性
        sameInputType(a, b)  // 相同的input类型
      ) || (
        isTrue(a.isAsyncPlaceholder) &&  // 是异步占位符节点
        a.asyncFactory === b.asyncFactory &&  // 异步工厂方法
        isUndef(b.asyncFactory.error)
      )
    )
  )
}
复制代码
```

这个函数主要是来判断需不需要进行patchVnode,返回false的时候后会根据vnode进行createElm，但是返回true的时候，也不能表明是同一个vnode，有可能出现children发生了变化，仍需进行patchVnode进行更新

### patchVnode函数

由前面的patch方法，我们知道patchVnode方法和createElm的方法最终的处理结果一样，就是生成或更新了当前vnode对应的dom。

看代码：

```
function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

    const elm = vnode.elm = oldVnode.elm

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
复制代码
```

代码主要是：

1. if (oldVnode === vnode)，他们的引用一致，可以认为没有变化
2. 克隆节点，后面updateChildren会用到

```
 if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode)
    }

复制代码
```

1. const el = vnode.el = oldVnode.el 让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化
2. 重用静态树元素，静态资源会在编译时标记出来,但是vue 2.x中不完善，如果子节点中存在一个不为静态节点的元素，那么就不会标记为静态节点，vue 3.0 虚拟dom重构后 会精确的标记每一个静态节点

```
  if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }
复制代码
```

1. 核心逻辑：

```
 if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch)
        }
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
      } else if (isDef(oldCh)) {
        removeVnodes(oldCh, 0, oldCh.length - 1)
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
复制代码
```

总结： 一个vnode有三种情况：文本vnode，有children的vnode，没有children的vnode，那么新的vnode和oldVnode比较的话会有9种处理情况：



![img](https://user-gold-cdn.xitu.io/2020/3/26/17115ff5e48d9c2e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



### updateChildren函数(diff核心)

经过上面的分析，新老节点都存在Children的情况下才会执行updateChildren，此时入参是oldVnode.Children和vnode.Children，所以可以知道的是，updateChildren进行的是同层级下的children的更新比较，**比较只会在同层级进行, 不会跨层级比较**。



![img](https://user-gold-cdn.xitu.io/2020/3/26/1711607883e7f97d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



代码如下：

```
function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0 第一个下标
    let newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx // 旧节点key和下标的对象集合
    let idxInOld // 新节点key在旧节点key集合里的下标
    let vnodeToMove // idxInOld对应的旧节点
    let refElm // 参考节点

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh) // 检测newVnode的key是否有重复
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) { // 跳过因位移留下的undefined
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) { // 跳过因位移留下的undefined
        oldEndVnode = oldCh[--oldEndIdx]
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx)
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)  // 获取旧开始到结束节点的key和下标集合
        idxInOld = isDef(newStartVnode.key) // 获取新节点key在旧节点key集合里的下标
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)
        if (isUndef(idxInOld)) { // New element  找不到对应的下标，表示新节点是新增的，需要创建新dom
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
        } else { // 能找到对应的下标，表示是已有的节点，移动位置即可
          vnodeToMove = oldCh[idxInOld] // 获取对应已有的旧节点
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx)
            oldCh[idxInOld] = undefined
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx)
          }
        }
        newStartVnode = newCh[++newStartIdx] // 新开始下标和节点更新为第二个节点
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue)
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(oldCh, oldStartIdx, oldEndIdx)
    }
  }
复制代码
```

开始之前定义了一系列的变量，分别如下：

1. oldStartIdx 开始指针，指向oldCh中待处理部分的头部，对应的vnode也就是oldStartVnode
2. oldEndIdx 结束指针，指向oldCh中待处理部分的尾部，对应的vnode也就是oldEndVnode
3. newStartIdx 开始指针，指向ch中待处理部分的头部，对应的vnode也就是newStartVnode
4. newEndIdx 结束指针，指向ch中待处理部分的尾部，对应的vnode也就是newEndVnode
5. oldKeyToIdx 是一个map，其中key就是常在for循环中写的v-bind:key的值，value 对应的就是当前vnode,也就是可以通过唯一的key，在map中找到对应的vnode updateChildren使用的是while循环来更新dom的，其中的退出条件就是!(oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx)，换种理解方式：oldStartIdx > oldEndIdx || newStartIdx > newEndIdx，什么意思呢，就是只要有一个发生了‘交叉’(下面的例子会出现交叉)就退出循环。

#### diff比较顺序(优先级从上到下)：

1. 无oldStartVnode则开始oldStartIdx指针右移(参照round6)
2. 无oldEndVnode则开始oldEndIdx指针左移
3. 对比头部，成功则patchVnode更新并oldStartIdx，newStartIdx右移动（参照round4）
4. 对比尾部，成功则patchVnode更新并oldEndIdx，newEndIdx左移动（参照round1）
5. oldVnode头与vnode尾对比，成功则patchVnode更新并oldStartIdx右移动，newEndIdx左移动（参照round5）
6. oldVnode尾与vnode头对比，成功则patchVnode更新并oldEndIdx左移动，newStartIdx右移动（参照round2）
7. 在oldKeyToIdx中根据newStartVnode的可以进行查找，成功则patchVnode更新并移动（参照round3）

#### 举个例子

例子来源于网络，如侵必删

原有的oldCh的顺序是 A 、B、C、D、E、F、G，更新后成ch的顺序 F、D、A、H、E、C、B、G。



![img](https://user-gold-cdn.xitu.io/2020/3/26/1711638305ecc01f?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



#### 图解说明

为了更好理解后续的round，开始之前先看下相关符合标记的说明



![img](https://user-gold-cdn.xitu.io/2020/3/26/171163b7393544f0?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



#### diff过程

##### round1:

对比顺序：A-F -> G-G，匹配成功，然后：

对G进行patchVnode的操作，更新oldEndVnodeG和newEndVnodeG的elm

指针移动，两个尾部指针向左移动，即oldEndIdx-- newEndIdx--



![img](https://user-gold-cdn.xitu.io/2020/3/26/17116577b7cf3405?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



##### round2:

对比顺序：A-F -> F-B -> A-B -> F-F，匹配成功，然后：

对F进行patchVnode的操作，更新oldEndVnodeF和newEndVnodeF的elm

指针移动，移动指针，即oldEndIdx-- newStartIdx++

找到oldStartVnode在dom中所在的位置A，然后在其前面插入更新过的F的elm



![img](https://user-gold-cdn.xitu.io/2020/3/26/171167985c15c830?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



##### round3:

对比顺序：A-D -> E-B -> A-B -> E-D，仍未成功，取D的key，在oldKeyToIdx中查找，找到对应的D，查找成功，然后：

将D取出赋值到 vnodeToMove

对D进行patchVnode的操作，更新vnodeToMoveD和newStartVnodeD的elm

指针移动，移动指针，即newStartIdx++

将oldCh中对应D的vnode置undefined

在dom中找到oldStartVnodeA的elm对应的节点，然后在其前面插入更新过的D的elm



![img](https://user-gold-cdn.xitu.io/2020/3/26/171167d1d32ff2b3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)



##### round4:

对比顺序：A-A，对比成功，然后：

对A进行patchVnode的操作，更新oldStartVnodeA和newStartVnodeA的elm

指针移动，两个尾部指针向左移动，即oldStartIdx++ newStartIdx++



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1280" height="504"></svg>)



##### round5:

对比顺序：B-H -> E-B -> B-B ,对比成功，然后：

对B进行patchVnode的操作，更新oldStartVnodeB和newStartVnodeB的elm

指针移动，即oldStartIdx++ newEndIdx--

在dom中找到oldEndVnodeE的elm的nextSibling节点（即G的elm），然后在其前面插入更新过的B的elm



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1280" height="519"></svg>)



##### round6:

对比顺序：C-H -> E-C -> C-C ,对比成功，然后(同round5)：

对C进行patchVnode的操作，更新oldStartVnodeC和newStartVnodeC的elm

指针移动，即oldStartIdx++ newEndIdx--

在dom中找到oldEndVnodeE的elm的nextSibling节点（即刚刚插入的B的elm），然后在其前面插入更新过的C的elm



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1280" height="493"></svg>)



##### round7:

获取oldStartVnode失败（因为round3的步骤4）,然后：

指针移动，即oldStartIdx++



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1280" height="590"></svg>)



##### round8:

对比顺序：E-H、E-E,匹配成功，然后（同round1）：

对E进行patchVnode的操作，更新oldEndVnodeE和newEndVnodeE的elm

指针移动，两个尾部指针向左移动，即oldEndIdx-- newEndIdx--



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1280" height="595"></svg>)



##### round9:

round8之后oldCh提前发生了‘交叉’，退出循环。

找到newEndIdx+1对应的元素A

待处理的部分（即newStartIdx-newEndIdx中的vnode）则为新增的部分，无需patch，直接进行createElm

所有的这些待处理的部分，都会插到步骤1中dom中A的elm所在位置的后面



![img](data:image/svg+xml;utf8,<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="1160" height="962"></svg>)



#### 注意点：

oldCh和ch在过程中他们的位置并不会发生变化

真正进行操作的是进入updateChildren传入的parentElm，round即为父vnode的elm while每一次的循环体

多次提到patchVnode，往前看patchVnode的部分，其处理的结果就是oldVnode.elm和vnode.elm得到了更新

#### 总结

这里只要记住，oldCh和ch都是参照物，其中，ch是我们的目标顺序，而oldCh是我们用来了解当前dom顺序的参照。所以整个diff过程，就是对比oldCh和ch，确认当前round，oldCh如何移动更靠近ch，由于oldCh中待处理的部分仍在dom中，所以可以根据oldCh中的oldStartVnode的elm和 oldEndVnode的elm的位置，来确定匹配成功的元素该如何插入。

‘头头’匹配成功的时候，证明当前oldStartVnode位置正是现在的位置，无需移动，进行patchVnode更新即可

‘尾尾’匹配成功同‘头头’匹配成功，也无需移动

若‘尾头匹配成功’，即oldEndVnode与newSatrtVnode匹配成功，表示oldEndVnode的被替换到了Vnode的头部，这里注意成功的是newSatrtVnode，所以我们直接在dom将oldEndVnode插入到最前面。

同理，若‘头尾匹配成功’，即oldStartVnode与newEndVnode匹配成功，表示oldStartVnode的被替换到了Vnode的头部，这里注意成功的是newEndVnode，所以是在待处理dom的尾部插入（就是尾部元素的下一个元素前插）

以上已经包含updateChildren中大部分的内容了，当然还有部分没有涉及到的就不一一说明的，具体的大家可以对着源码，找个实例走整个的流程即可。

顺便提下insertedVnodeQueue：

这部分涉及到组件的patch的过程，这里可以简单说下：组件的mount函数之后之后并不会立即触发组件实例的mounted钩子，而是把当前实例push到insertedVnodeQueue中，然后在patch函数中，会执行invokeInsertHook，也就是触发所有组件实例的insert的钩子，而组件的insert钩子函数中才会触发组件实例的mounted钩子。比方说，在patch的过程中，patch了多个组件vnode，他们都进行了mount即生成dom，但没有立即触发$mounted，而是等整个patch完成，再逐一触发。