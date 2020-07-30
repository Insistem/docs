# JS设计模式

参考：

- [设计模式](https://www.yuque.com/yizo/web/ft7h33)

### SOLID 五大设计原则

## 面向人群

想深入了解面向对象编程思想，并且提高自己模块化开发能力，写出可维护、更灵活、高效率、可拓展的代码，即使出现复杂的问题也会编写出一目了然、结构清晰的代码

#### 面向对象编程

就是将你的需求抽象成一个对象，然后针对这个对象分析其特征（属性）与动作（方法）。

JavaScript中的类： 创建一个类，通过new 可以实例化一个对象，this中的属性和方法会得到相应的创建，而通过prototype继承的属性或方式是每个对象通过__proto\__访问到，所以每次通过类创建一个新对象时，这些属性和方法不会再次创建。

原型对象： prototype，其constructor属性指向的就是拥有这个原型对选的函数或对象。

<img src="/Users/mpy/Library/Application Support/typora-user-images/image-20200713110240966.png" alt="image-20200713110240966" style="zoom:50%;" />



写一个类时要用安全模式，防止别人不用new直接使用报错

```js
//图书安全类
var Book function (title, time type)i
// 判断执行过程中this是否是当前这个对象(如果是说明是用new创建的)
// instanceof: a instanceof b ，判断b是否在a的原型链上(a 是不是b的实例)
if(this instanceof Book){
  this.tit1e=tit1e;
  this time time
  this type = type
 }
//否则重新创建这个对象
else{
	return new Book (title, time type);
}
var book= Book ( JavaScript','2014','js')
```

### 继承

原始父类

```js
//声明父类
function SuperClass() {
    this.subValue = true
}
//为父类添加共有方法
SuperClass.prototype.getSuperValue = function() {
    return this.subValue
}
```

##### 1. 类式继承

子类的prototype直接等于父类的实例对象

###### 缺点：

1. 一个子类的实例更改了从父类中继承来的共有属性(这个属性一定是引用类型并且子类中没有这个属性)就会直接影响到其他子类
2. 由于子类实现的继承是靠其原型prototype对父类的实例化实现的,因此在创建父类的时候,是无法向父类传递参数的,因而在实例化父类的时候也无法对父类构造函数内的属性进行初始化

```js
//声明子类
function SubClass(id) {
    this.subValue = [1,2] 
    this.id = id
}
//继承父类
SubClass.prototype = new SuperClass();
// 为子类添加共有方法
SubClass.prototype.getSubValue = function() {
    return this.subValue
}
// 验证
 const parent = new SuperClass()
 const son = new SubClass()
 const res = son.__proto__.constructor === parent.__proto__.constructor
 console.log(res) // true
// 问题1
const son1 = new SubClass()
const son2 = new SubClass()
console.log(son2.subValue) // [1,2]
son1.subValue.push(123)
console.log(son2.subValue) // [1,2,123]
```

2. 构造函数式继承

```js
//声明子类
function SubClass() {
    this.subValue = false
    // 继承父类
    SuperClass.call(this, id)
}
SubClass.prototype.getSuperValue = SuperClass.prototype.getSuperValue
// 但是想要继承父类的原型方法 需要单独拥有一份，不能共用
```

3. 组合继承 - 结合上面两种继承

   1. 缺点： 父类被执行了两次

   ```js
   //声明子类
   function SubClass(id) {
       this.subValue = false
       this.id = id
     // 继承父类
       SuperClass.call(this, id)
   }
   //继承父类
   SubClass.prototype = new SuperClass();
   // 为子类添加共有方法
   SubClass.prototype.getSubValue = function() {
       return this.subValue
   }
   ```

4. 寄生式继承
5. 寄生组合式继承

### 对象的深浅拷贝

### 正题-模式介绍

#### 1. 工厂模式 - 创建多类对象

简单工厂模式: 用于创建单一对象，耦合强 。1、通过实例化对象；2、通过新创建一个对象

安全工厂模式：创建多类对象，内部进行判断如果没调用new，手动调用

抽象工厂模式：是一个实现子类继承父类的方法

#### 2. 建造者模式

将多个类，合并为一个完整的类

#### 3. 原型模式

#### 4. 单例模式































































