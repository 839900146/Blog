---
title: 手写map
date: 2021-01-26 10:32:54
tags: [手写, js]
categories: [笔试重点]
---



## 作用

`map` 接收一个函数，并使用该函数对数组的每个元素进行调用，函数会返回处理后的值，进而组成一个新的数组返回

<!-- more -->

如下：

```js
let data = [
    { id: 1, state: false },
    { id: 2, state: true },
    { id: 3, state: false },
    { id: 4, state: true },
]

data = data.map(item => {
    if(item.state) {
        item.text = '成功';
    } else {
        item.text = '失败';
    };
    return item;
});

console.log(data);
```







---



## 原生实现

```js
Array.prototype.myMap = function(fn) {
    let result = [];
    for(let i = 0; i < this.length; i++){
        result.push(fn(this[i]));
    }
    return result;
}
```







## reduce实现

```js
Array.prototype.myMap = function(fn) {
    let result = [];
    this.reduce((pre, cur) => {
        return result.push(fn(cur));
    }, []);
    return result;
}
```

