---
title: Redux学习笔记
date: 2021-01-26 10:24:22
tags: [React, Redux, 学习笔记]
---


## 什么是redux

`redux` 是一个用于 `javascript` 的状态容器，提供可预测的状态管理。

`redux` 可以让你构建 `一致化` 的应用，运行于不同的环境（客户端，服务器，原生应用），并易于测试。

`redux` 除了和 `react` 一起使用外，还支持其他界面库。


<!-- more -->


## redux的设计初衷

随着 `JavaScript` 单页面发开日趋复杂，`JavaScript`需要管理更多的`state`(状态)，这些`state`可能包括服务器响应、缓存数据、本地生成未持久化到服务器的数据，也包括UI状态等。

管理不断变化的 `state` 非常麻烦，如果一个 `model` 的变化会引起另一个 `model` 变化，那么当 `view` 变化时，就可能引起对应  `model` 以及另一个 `model` 的变化，依次可能会引起另一个 `view` 的变化。所以就会产生混乱。



而 `redux` 就是为了去解决这个问题。





## redux三大核心



### 1. 单一数据源

整个应用的 `state` 被存储在一颗 `object tree` 中，并且这个 `object tree`  只存在于唯一一个 `store` 中

![image-20201221103355668](https://i.loli.net/2020/12/21/dIPeWugBnhSsUvq.png)





### 2. State是只读的

唯一改变state的方法就是触发 `action`，`action` 是一余用于描述已发生事件的普通对象。



这样确保了视图和网络请求都不能直接去修改 `state`，相反，它们只能表达想要修改的意图，因为所有的修改都被集中化处理，并且严格按照一个接一个的顺序执行



```js
store.dispatch({
    type: 'demo',
    payload: 666
})
```





### 3. 使用纯函数来执行修改

为了描述 `action` 如何改变 `state tree`，你需要去编写 `reducers`。

Reducers 只是一些纯函数，它接收先前的state和action，并且返回新的state。可以复用、可以控制顺序、传入附加参数。





## redux的组成



### 1. State-状态

就是我们传递的 `数据`，那么我们在用React开发项目的时候，大致可以把State分为三类

- **DomainDate：**可以理解成为服务器端的数据，比如:获取用户的信息，商品的列表等等
- **UI State：**决定当前UI决定展示的状态，比如:弹框的显示隐藏，受控组件等等
- **App State：** App级别的状态，比如:当前是否请求loading，当前路由信息等可能被多个和组件去使用的到的状态





### 2. Action-事件

`Action` 是把数据从应用传到 `store` 的载体，它是 `store` 数据的唯一来源，一般来说，我们可以通过`store.dispatch()` 将 `action` 传递给 `store`

![image-20201221104510464](https://i.loli.net/2020/12/21/j7PoCWaMUF9DSsI.png)



**Action的特点：**

- `Action` 的本质就是一个 `javaScript` 的普通对象

- Action 对象内部必须要有一个 `type` 属性来表示要执行的动作

- 多数情况下，这个 `type` 会被定义成字符串常量
- 除了 `type` 字段之外，action的结构随意进行定义

- 而我们在项目中，更多的喜欢用action创建函数（就是创建action的地方)
- 只是描述了有事情要发生，并没有描述如何去更新state



![image-20201221104945887](https://i.loli.net/2020/12/21/qofAbNjeiRM31Ik.png)







### 3. Reducer

`Reducer` 本质就是一个函数，它用来响应发送过来的 `actions`，然后经过处理，把 `state` 发送给`Store` 的。



**注意：**

- 在Reducer函数中，需要 `return返回值`，这样Store才能接收到数据

- 函数会接收两个参数，第一个参数是初始化 state，第二个参数是action



```js
const initState = {...};
rootReducer = (state = initState, action) => {... return {...}};
```



![image-20201221105306667](https://i.loli.net/2020/12/21/AjnX4BVQWqtsa8y.png)





### 4. Store

`store` 就是把 `action` 和 `reducer` 联系到一起的对象



**主要职责：**

- 维持应用的 state
- 提供 `getState()` 方法获取 state
- 提供 `dispatch()` 方法发送 action
- 通过 `subscribe()` 来注册监听
- 通过 `subscribe()` 的返回值来注销监听



构建 `store` ：

```js
import { createStore } from 'redux';
const store = createStore(reducer)
```







## 步骤

### 1. 创建 `action`

```js
export const sendAction = () => { type: 'demo', name: '靓仔' }
```



### 2. 创建 `reducer`

```js
export const reducer = (store, action) => {
    switch(action.type){
        case 'demo':
            return Object.assign({}, store, action);
        default:
            return store;
    }
}
```



### 3. 创建 `store`

```js
import { createStore } from 'redux'
import { reducer } from '../reducer/index.js'

const store = createStore(reducer);

export default store;
```



### 4. 在组件中使用

```jsx
import React, { Component } from 'react';
import store from '../../store/index';
import { sendAction } from '../../action/index';

export default class index extends Component {
    // 点击按钮时，通过dispatch发送一个action
	handleClick = () => {
		let action = sendAction();
		store.dispatch(action);
    };
    
    componentDidMount(){
        // 监听 store 数据的改变
        store.subscribe(()=>{
            console.log(store.getState());
            this.setState({})
        })
    }

	render() {
		return (
			<div>
				<p>这是某个组件</p>
                {/* 显示store内的数据 */}
                <p>{store.getState().name}</p>
				<div>
					<button onClick={this.handleClick}>发送action</button>
				</div>
			</div>
		);
	}
}
```



### 总结

![image-20201221115558903](https://i.loli.net/2020/12/21/maHYFIeN3TOBKA1.png)







## react-redux



### 两个重要成员

- **Provider**：这个组件能够让你整个app都能使用store里的数据。
- **connect**：这个组件能够让组件与store相关联。





## Provider

Provider `包裹` 在 **根组件** 最外层，使所有的子组件都可以拿到State

Provider接收 `store` 作为 `props` ，然后通过context往下传递，这样react中任何组件都可以通过context 获取到store

![image-20201221133054988](https://i.loli.net/2020/12/21/nBvNQrH2ltXsLoj.png)





## connect

Provider内部组件如果想要使用到state中的数据，就必须要connect进行一层包裹封装，换一句话来说就是必须要被connect进行加强。

connect就是方便我们组件能够获取到store中的state。



**格式：**`connect(mapStateToProps, mapDispatchToProps)(组件)`



`mapStateToProps：` 将 state 添加到组件的 props 中



`mapDispatchToProps：` 将 dispatch 添加到组件的 props 中







## 步骤



### 1. 创建action

```js
// src/actions/index.js
export const sendAction = () => { type: 'plus', num: 0 }
```





### 2. 创建reducer

```js
// src/reducers/index.js
const initState = { num: 0 };

export const reducer = (store = initState, action) => {
    switch(action.type){
        case 'demo':
            return {
                num: store.num + 1
            };
        default:
            return store;
    }
}
```





### 3. 创建store

```js
// src/store/index.js
import { createStore } from 'redux'
import { reducer } from '../reducers'

export default createStore(reducer);
```





### 4. 修改根组件

```jsx
// src/App.jsx
import react, { Component } from 'react'
import { Provider } from 'react-redux'
import store from './store'
import Foo from './pages/Foo'
import Bar from './pages/Bar'

export default class App extends Component {
    render() {
        return {
            <Provider store={ store }>
                <div>
                    <Foo />
                    <Bar />
                </div>
            </Provider>
        }
    }
}
```





### 5. 创建Foo界面

```jsx
// src/pages/Foo/index.jsx —— 接收方
import react, { Component } from 'react'
import { connect } from 'react-redux'

class Foo extends Component {
    render() {
        return {
            <div> {} </div>
        }
    }
}

const mapStateToProps = state => state;

export default connect(mapStateToProps)(Foo)
```





### 6. 创建Bar界面

```jsx
// src/pages/Bar/index.jsx —— 发送方
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Bar extends Component {
	handleClick = () => {
		// 发送action
		this.props.sendAction();
	};

	render() {
		return (
			<div>
				<button onClick={ this.handleClick }> + </button>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		sendAction: () => {
			dispatch({
				type: 'plus',
			});
		},
	};
};

export default connect(null, mapDispatchToProps)(Bar);
```

