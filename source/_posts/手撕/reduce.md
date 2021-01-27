---
title: 手写reduce
date: 2021-01-26 10:33:30
tags: [手写, js]
categories: 前端
---


## 作用

`reduce` 接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。

<!-- more -->

如下：

```js
let data = [5, 88, 45, 12, 98, 23];

let sum = data.reduce((total, item) => {
    return total + item;
});

console.log(sum);
```





**参数：**

![image-20210122103335492](https://i.loli.net/2021/01/22/msbUlTIGrDHgnjM.png)





---



## 原生实现

```js
Array.prototype.myReduce = function(fn, initValue) {
    let item; // 当前存储的值
    let i; // 起始索引
    
    if(initValue) {
        item = initValue;
        i = 0;
    } else {
        item = this[0];
        i = 1;
    };
    
    for(i; i < this.length; i++) {
        item = fn(item, this[i], i, this);
    };
    
    return item;
}
```

