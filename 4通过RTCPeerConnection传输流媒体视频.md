## 提示

- 本节涉及的知识点很多! 关于 RTCPeerConnection 的更多信息, 请参考 [webrtc.org/start](https://webrtc.org/start). 里面有一些对 JavaScript 框架的建议, 如果想使用WebRTC, 也想深入了解API细节的话。
- 参考 [adapter.js GitHub repo](https://github.com/webrtc/adapter) 仓库, 获取更多信息。
- 如果想要体验当下最先进的WebRTC视频聊天应用, 可以看看 AppRTC, 这也是WebRTC项目的标准实现: app访问地址: <https://appr.tc/>, 代码地址 <https://github.com/webrtc/apprtc>。 创建通话的时间可以控制在 500 ms以内。

## 最佳实践

- 想要让代码跟上时代的部分, 请使用基于Promise的API, 并通过 [adapter.js](https://github.com/webrtc/adapter) 来兼容各种浏览器。

