---
title: 手写splice
date: 2021-01-26 10:25:54
tags: [手写, js]
categories: [笔试重点]
---

## 代码实现

<!-- more -->
```js
var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var startIndex = 1;
var endIndex = 3;

// 往数组的原型上添加自定义splice方法
Array.prototype.mySplice = function () {
    var args = [].slice.call(arguments); // 得到剩余参数
    var start = args.shift(); // 得到开始位置
    var end = args.shift(); // 得到结束位置/删除个数
    var _this = this; // 保存this的引用

    // 改变this值的函数
    var changeThis = function (newArr) {
        _this.length = 0;
        for (let i = 0; i < newArr.length; i++) {
            _this.push(newArr[i])
        }
    }

    // 判断调用者是不是数组
    if (Object.prototype.toString.call(this).slice(8, -1) !== 'Array') return;

    // 判断传递的索引是否正确
    if (!start || start >= this.length) return;

    // 如果只传了start，则删除this内的所有元素，并返回被删除的元素
    if (typeof end === 'undefined') {
        var removes = this.slice(start); // 得到被删除的元素
        var newArr = this.slice(0, start); // 得到新的数组
        changeThis(newArr); // 将this的值变为新数组
        return removes; // 返回被删除的元素
    }

    // 如果只传递了start和end
    if (args.length === 0) {
        // 从start开始，删除end个元素
        var prevArr = this.slice(0, start); // 得到要保留的前一段数据
        var nextArr = this.slice(start + end); // 得到要保留的后一段数据
        var removes = this.slice(start, start + end); // 得到要删除的数据
        var newArr = prevArr.concat(nextArr); // 将前一段数据和后一段数据合并为新数组
        changeThis(newArr); // 将this的值变为新数组
        return removes; // 返回被删除的元素
    }

    // 如果传递了start, end, args
    var prevArr = this.slice(0, start); // 得到要保留的前一段数据
    var nextArr = this.slice(start + end); // 得到要保留的后一段数据
    // 将前一段数据和传递的参数进行合并，然后再与后一段数据进行合并，得到新数组
    var removes = this.slice(start, start + end); // 得到要删除的数据
    var newArr = prevArr.concat(args).concat(nextArr);
    changeThis(newArr); // 将this的值变为新数组
    return removes; // 返回被删除的元素
}


// -------------------------------
arr.mySplice(startIndex, endIndex, 77, 88, 99)

console.log(arr);
```



## 思路

首先判断this是否是数组

其次判断传递的参数是否合法

最后判断你传递了多少个参数

**1.如果传递了1个参数**

从这个位置开始，往后删除所有元素，并返回所删除的元素

步骤：

    - slice只传递1个参数，可以从这个位置开始一直截取到数组的最后一位元素，而这个结果就是被删除的所有元素
    
    - slice(0, n) 可以得到0-n之间的所有数组元素，而这个结果就是要保留的数组元素
    
    - 因为this是数组，清空数组的方式可以用length=0，把this的值变为newArr的值就可以了

**2.如果传递了2个参数**

    从这个位置开始，往后删除n个元素，并返回所删除的元素
    
    步骤：
        - slice(0, 起始位置) 可以得到前一段要保留的数据
    
        - slice(起始位置，起始位置 + 删除个数) 可以得到你要删除的数据
    
        - slice(起始位置 + 删除个数) 可以得到后一段要保留的数据
    
        - 前一段数据+后一段数据 进行合并，就是我们想要的新数据

**3.如果传递了2个以上的参数**

    因为不知道会传递多少个参数，所以通过arguments来取出所传递的所有参数
    
    从这个位置开始，往后删除n个元素，并将其余元素添加至所删除的位置，然后返回所删除的元素
    
    步骤：
    - 通过数组方法shift可以取出start和end，并且改变args
    
    - slice(0, 起始位置) 可以得到前一段要保留的数据
    
    - slice(起始位置，起始位置 + 删除个数) 可以得到你要删除的数据
    
    - slice(起始位置 + 删除个数) 可以得到后一段要保留的数据
    
    - 前一段数据+剩余参数+后一段数据 进行合并，就是我们想要的新数据

