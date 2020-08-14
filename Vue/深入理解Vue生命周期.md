#### beforeCreate

实例中值为空

#### created

#### beforeMount

#### Mounted

详细说说每个钩子中执行代码，都是些什么状态，mounted钩子中执行，只能说明执行了appendChild方法，因为DOM渲染需要一个过程，并不是执行了这个方法，页面立马就渲染出来，dom树中就立马出现了新的DOM，但是页面什么时候真正显示出来（或者说完成体现在dom改变中），还是需要在 $nextTick中

详细说说 这些钩子都是在啥时候被调用的，在哪里被调用的



#### 问题点

- 可以这么理解不，
  - 第一阶段： beforeMount前 ， 先处理用户配置的$options:(data, props, methods, components, mixins) ，完成了 属性的响应式设置，defineReactive， new Dep 这些-（可以在代码中验证下）， 
  - 第二阶段：挂载阶段，执行$mount ，将模板渲染到指定的DOM元素中，每个组件都创建一个 new Watcher ,通过触发getter,将依赖加到属性中，当通过 this.demo="foo"，导致状态改变时，就通知到这个watcher，然后这个组件就知道自己需要更新了，至于更新啥，就是vm._update的工作了
  - 