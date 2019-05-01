'use strict';

// 本节只需要使用到 video (video: true).
//3.参数 constraints 可以指定要获取哪些 media 信息。
//如果不指定, 声音(audio) 默认配置是禁用的, 所以此处实际上只获取了 video 流
const mediaStreamConstraints = {
  video: true,
  audio: true
};

// 用于播放视频流stream 的 video元素.
const localVideo = document.querySelector('video');

// Local stream that will be reproduced on the video.
let localStream;

// success 处理函数;  by adding the MediaStream to the video element.
//2.如果权限验证通过, 则返回 MediaStream 对象, 可以将该对象赋值给 media 元素的 srcObject 属性:
function gotLocalMediaStream(mediaStream) {
  localStream = mediaStream;
  localVideo.srcObject = mediaStream;
}

// error 处理函数;  将 error 信息打印到 console.
function handleLocalMediaStreamError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

// 初始化 media stream.
//1.调用 getUserMedia() 方法之后, 浏览器会判断当前域名(domain)是否具有调用摄像头的权限,
// 如果是第一次请求授权, 则会弹出对话框, 要求用户手动选择允许。
navigator.mediaDevices.getUserMedia(mediaStreamConstraints)
  .then(gotLocalMediaStream).catch(handleLocalMediaStreamError);

//还可以加上更多的约束条件, 例如设置视频分辨率:
const hdConstraints = {
  video: {
    width: {
      min: 1280
    },
    height: {
      min: 720
    }
  }
}
//test1：只获取媒体流
<<<<<<< HEAD

=======
>>>>>>> ec6b64ed6b00fa3df114ae892ab8fa56fd87545a
