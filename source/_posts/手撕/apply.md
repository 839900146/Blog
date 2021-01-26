---
title: 手写apply
date: 2021-01-26 10:27:08
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
Function.prototype.myApply = function (target, arr) {

    if (typeof this !== 'function') throw Error(this + 'is not a function');

    arr = arr || [];

    target = target || window;

    var unique = mySymbol(target);

    target[unique] = this;

    var args = [];

    // 遍历传入的第二个参数, apply的第二个参数是数组
    for (var i = 0; i < arr.length; i++) {
        args.push('arr[' + i + ']');
    }

    if (args.length === 0) {
        // 如果没有传递参数则直接执行
        target[unique]();
    } else {
        eval('target[unique](' + args + ')');
    }

    delete target[unique];

}
```







## ES6实现

```js
// 绑定自己的call方法到Function原型
Function.prototype.myApply = function (target = window) {

    if (typeof this !== 'function') throw Error(this + 'is not a function');
    // 生成唯一值
    const unique = Symbol('fn');
    // 绑定this
    target[unique] = this;
    // 执行
    target[unique](...arr);
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

person.myApply(obj, ['我', '是']);
```




