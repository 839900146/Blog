---
title: 手写bind
date: 2021-01-26 10:27:49
tags: [手写, js]
categories: 前端
---

## bind代码实现

<!-- more -->
```js
// 绑定自己的bind方法到Function原型
Function.prototype.myBind = function (target) {
	// 判断调用者是否合法
    if (typeof this !== 'function') throw Error(this + 'is not a function');
    // 保存this
    var that = this;
    // 转换为数组
    var args1 = Array.prototype.slice.call(arguments, 1);
    // 采取一个临时函数, 来实现继承
    var TempFn = function () {};
    // 通过有名函数, 才能用instanceof判断是否被new执行
    var NewFn = function () {
        var args2 = Array.prototype.slice.call(arguments);
        // 将所有参数合并为一个数组
        var newArrArgs = args1.concat(args2);
        if (this instanceof TempFn) {
            // 能进到这里，代表this是TempFn的实例对象，是被new出来的
            that.apply(this, newArrArgs);
        } else {
            that.apply(target, newArrArgs);
        }
    }

    // 原型继承
    // 这里用that而不是用this，是因为我们在NewFn里已经改变了that里this的指向
    TempFn.prototype = that.prototype;
    NewFn.prototype = new TempFn;

    // 返回该函数
    return NewFn;
}


```





## 调用

```js
function person(a, b, c) {
     console.log(a, b, c, this.name);
}

var obj = {
    name: '靓仔'
};

person.myBind(obj, '我', '是')('个');
```





## 小提示

1. 函数的祖先是 `Function`，我们要给所有函数添加一个公共的属性或方法的话，可以往 `Function` 的原型上加



2. 因为 `bind` 是返回一个未执行的函数，而这个函数也可以有参数传入