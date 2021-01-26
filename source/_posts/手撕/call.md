---
title: 手写call
date: 2021-01-26 10:28:30
tags: [手写, js]
categories: [笔试重点]
---

## ES5实现

<!-- more -->

```js
// 生成唯一值
function mySymbol(obj) {
    var unique = (Math.random() + Date.now()).toString(32).slice(0, 16);
    if (obj[unique]) {
        return mySymbol(obj);
    } else {
        return unique;
    }
}

// 绑定自己的call方法到Function原型
Function.prototype.myCall = function (target) {

    if (typeof this !== 'function') throw Error(this + 'is not a function');

    target = target || window;

    var args = [];

    for (var i = 1; i < arguments.length; i++) {
        args.push('arguments[' + i + ']');
    }
	// 生成唯一值
    var unique = mySymbol(target);
	// 绑定this
    target[unique] = this;
	// 执行
    eval('target[unique](' + args + ')');
	// 用完就抛弃
    delete target[unique];
    
}
```







## ES6实现

```js
// 绑定自己的call方法到Function原型
Function.prototype.myCall = function (target = window) {

    if (typeof this !== 'function') throw Error(this + 'is not a function');

    const args = [...arguments].slice(1);
	// 生成唯一值
    const unique = Symbol('fn');
	// 绑定this
    target[unique] = this;
	// 执行
    target[unique](...args);
	// 用完就抛弃
    delete target[unique];
    
}
```







## 调用

```js
function person(a, b) {
     console.log(a, b, this.name);
}

var obj = {
    name: '靓仔'
};

person.myCall(obj, '我', '是');
```





## 小提示

生成唯一值的目的是用来作为 `target` 的 `key`，`key` 在对象中是不能出现重复的