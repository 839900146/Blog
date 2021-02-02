---
title: Axios二次封装
date: 2021-02-02 17:50:25
tags: [axios, ajax]
categories: 前端
---

## axios二次封装

`axios` 的基本配置有请求拦截、响应拦截、异常处理，以及个别基础配置（如 `baseURL`, `timeout`）等

只有将这些东西都提前配置好，我们才能更好的开发自己的项目。



**直接上代码：**
```js
import axios from 'axios';
import get from 'lodash/get';
// 创建 axios 实例
const request = axios.create({
	// API 请求的默认前缀
	baseURL: process.env.VUE_APP_BASE_URL,
	timeout: 10000, // 请求超时时间
});

// 异常拦截处理器
const errorHandler = (error) => {
	const status = get(error, 'response.status');
	switch (status) {
		case 400:
			error.message = '请求错误';
			break;
		case 401:
			error.message = '未授权，请登录';
			break;
		case 403:
			error.message = '拒绝访问';
			break;
		case 404:
			error.message = `请求地址出错: ${error.response.config.url}`;
			break;
		case 408:
			error.message = '请求超时';
			break;
		case 500:
			error.message = '服务器内部错误';
			break;
		case 501:
			error.message = '服务未实现';
			break;
		case 502:
			error.message = '网关错误';
			break;
		case 503:
			error.message = '服务不可用';
			break;
		case 504:
			error.message = '网关超时';
			break;
		case 505:
			error.message = 'HTTP版本不受支持';
			break;
		default:
			break;
		/* eslint-disabled */
	}
	return Promise.reject(error);
};

// 请求拦截
request.interceptors.request.use((config) => {
    // 让每个请求携带自定义 token 请根据实际情况自行修改
    let token = sessionStorage.get('token');
    
	// 如果 token 存在, 则添加至请求头，请求头字段自定义
    if(token) {
        config.headers.Authorization = `${token}`;
    }
    
	return config;
}, errorHandler);

// 响应拦截
request.interceptors.response.use((response) => {
	const { code, data } = response.data;
	// 这个状态码是和后端约定的
	// 根据 code 进行判断
	if (code === undefined) {
		// 如果没有 code 代表这不是项目后端开发的接口
		return data;
		// eslint-disable-next-line no-else-return
	} else {
		// 有 code 代表这是一个后端接口 可以进行进一步的判断
		switch (code) {
			case 200:
				// [ 示例 ] code === 200 代表没有错误
				return data;
			case 'xxx':
				// [ 示例 ] 其它和后台约定的 code
				return 'xxx';
			default:
				// 不是正确的 code
				return '不是正确的code';
		}
	}
}, errorHandler);

export default request;
```
