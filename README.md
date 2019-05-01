# WebRTC
A project based on WebRTC

**在 WebRTC 客户端之间创建视频通话, 需要执行三个步骤:**

1.为每个客户端创建一个 RTCPeerConnection 实例, 并且通过 getUserMedia() 获取本地媒体流。<br/>
2.获取网络信息并发送给对方: 有可能成功的连接点(endpoint), 被称为 ICE 候选。<br/>
3.获取本地和远程描述信息并分享: SDP 格式的本地 media 元数据。</br>
