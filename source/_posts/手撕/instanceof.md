---
title: 手写instanceof
date: 2021-01-26 10:32:10
tags: [手写, js]
categories: 前端
---



## 作用

`instanceof` 的用来判断 **一个对象是否是某个类或构造函数的实例**


<!-- more -->
如下：

```js
let arr = [];
if(arr instanceof Array) {
    // 如果arr是Array的实例，则能进来
}
```



**instanceof** **在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 prototype**，若查找失败，返回 false，成功则返回 true



---



## 实现

```js
/**
* instance {any} 实例对象
* target {class} 类或构造函数
*/
function myInstanceof(instance, target) {
    while(instance){
        if(instance.__proto__ === target.prototype){
            return true;
        };
        instance = instance.__proto__;
    }
    return false;
}
```

