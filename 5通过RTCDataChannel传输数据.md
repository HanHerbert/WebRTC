##  本节内容(参考demo3)

- WebRTC客户端(peers)之间如何传递数据。

`在本示例中, 使用WebRTC的数据通道(data channel), 将一个 textarea 的内容, 传递给同页面中的另一个textarea。`



main.js实现通过 RTCPeerConnection 和 RTCDataChannel 来传输文本消息。





demo3让我学习了如何在同一页面中WebRTC客户端之间传输数据, 但不同设备的客户端之间如何进行数据传输呢?

 当然这有一个前提: **客户端之间需要建立信令通道(Signaling Channel),来交换元数据消息.** 在下一节我们会进行讲解!