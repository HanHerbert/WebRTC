# Node.js搭建静态服务器

`Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行环境。 Node.js 使用了一个事件驱动、非阻塞式 I/O 的模型，使其轻量又高效。Node.js 的包管理器 npm，是全球最大的开源库生态系统。`

**node.js组成：**
 1、**引入 required 模块**：我们可以使用 require 指令来载入 Node.js 模块。
 2、**创建服务器**：服务器可以监听客户端的请求，类似于 Apache 、Nginx 等 HTTP 服务器。
 3、**接收请求与响应请求**：客户端可以使用浏览器或终端发送 HTTP 请求，服务器接收请求后返回响应数据。

**搭建过程**

**步骤一**：引入require模块：

使用require指令来载入http模块，并将实例化的http赋值给变量http：

`var http = require('http')`

**步骤二**：创建服务器并监听端口

使用http.createServer()方法创建服务器，并使用listen()方法监听8080端口;

**步骤三**：请求到达服务器后，进入createServer()函数，函数内部处理请求后发送响应呈现到用户界面

函数通过request,responce参数来接收和响应数据。



**实例**

创建index.js

`

//nodejs里面通过require加载一个模块

var http = require('http')

//通过http模块创建一个服务器

var server = http.createServer(function(req,res){

​    //设置响应头

​    res.setHeader('Content-Type', 'text/plain;cahrset=utf-8')

​    //检测服务器状态

​    res.writeHead(200,'Okay')

​    //将写入的数据返回给浏览器（发送响应数据）

​    res.write('hello world')

​    //结束传输

​    res.end()    

})

//监听端口

server.listen(8080)

//终端打印信息

console.log('Server running at 127.0.0.1:8080')

`

**测试**

1.在终端输入 `node index.js`启动服务器。

`herbert@herbert-M17xR4:/media/herbert/programfiles1/18-19-2/WebRTC$ sudo node index.js
Server running at 127.0.0.1:8080`

2.打开浏览器输入：<http://127.0.0.1:8080/>

打印：hello world

**静态服务器搭建成功**

