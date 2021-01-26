---
title: 手写new
date: 2021-01-26 10:29:11
tags: [手写, js]
---


## 思路

- 1- 创建一个空对象



- 2- 绑定 `this` 到这个空对象



- 3- 将空对象的 `__proto__` 和构造函数的 `prototype` 相连接



- 4- 执行构造函数，并向该空对象添加属性



- 5- 判断构造函数的返回值是否为对象类型，如果是，则使用构造函数自己的返回值，如果不是，则返回我们创建的这个空对象

<!-- more -->

> 第五点可能有人不理解，意思就是：
>
> 我们的构造函数一般情况下是没有返回值的，所以
>
> 假设我在构造函数里手动写上了 `return` ，那么我就需要判断它返回的是不是一个对象
>
> 如果是，则返回它自定义的对象
>
> 如果不上，则返回我们自己的对象



---



## ES5实现

```js
function MyNew() {
    // 1. 创建空对象
    var obj = {};
    // 2. 得到构造函数
    var ConstructorFn = Array.prototype.shift.call(arguments);
    // 3. 得到剩余参数
    var args = Array.prototype.slice.call(arguments);
    // 4. 判断是否传入构造函数
    if(typeof ConstructorFn !== 'function') throw Error(ConstructorFn + ' is not a constructor function');
    // 5. 连接原型
    Object.setPrototypeOf(obj, ConstructorFn.prototype);
    // 6. 绑定this并得到返回值
    var result = ConstructorFn.apply(obj, args);
    // 7. 判断构造函数的返回值是否是一个对象
    return Object.prototype.toString.call(result).slice(8, -1) === 'Object' ? result : obj;
    
}
```







## ES6实现

```js
function MyNew(ConstructorFn, ...args) {
    // 1. 判断是否传入构造函数
    if(typeof ConstructorFn !== 'function') throw Error(ConstructorFn + ' is not a constructor function');
    // 2. 创建空对象
    let obj = {};
    // 3. 连接原型
    Object.setPrototypeOf(obj, ConstructorFn.prototype);
    // 4. 绑定this并得到返回值，也可以使用 ConstructorFn.apply(obj, args)
    let result = ConstructorFn.call(obj, ...args);
    // 5. 判断构造函数的返回值是否是一个对象
    return Object.prototype.toString.call(result).slice(8, -1) === 'Object' ? result : obj;
    
}
```







## 调用

```js
function Persion(name, age) {
    this.name = name;
    this.age = age;
}

let p = MyNew(Persion, '靓仔', 18)

console.log(p);
```





## 小提示

- 更推荐使用 `setPrototypeOf` 来链接原型

