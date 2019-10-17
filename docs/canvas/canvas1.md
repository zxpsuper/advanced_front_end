# 二维码的生成与扫码识别

## 背景

前些日子当前端面试官，问了一个问题：“你了解过canvas吗？”

“这个我知道，我有做过DEMO，这个不难吧，看着它的api接口就能实现！”

看着他这么（蜜汁）自信，我决定深入了解（为难）一下他！

“电商中大转盘，九宫格，刮刮乐，如何使用canvas实现，讲讲你的思路？”

“二维码的生成和扫码识别如何实现？”

“图片的粒子爆炸效果呢？”

“......”

----
因此，打算写一系列关于 canvas 的文章，探索学习提升自己的同时顺便分享给大家。

## 二维码的生成


![](./qrcode.png)

二维码的生成需借助第三方库，利用其算法对文本转化成二维码，并用 `canvas` 绘画出来。利用 `canvas.toDataURL('image/png')` 获取二维码转 `base64` 值，再将其赋值给 `img` 标签的 `src` 属性

这里我使用了一个库，[qrcodejs](https://github.com/davidshimjs/qrcodejs/).

可点击 [《Demo》](https://zxpsuper.github.io/Demo/qrcode/) 查看效果

使用方法如下：

```html

<!-- index.html -->
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Suporka Vue App</title>
    <style>
      .container {
        padding: 60px;
        margin: 0 auto;
        line-height: 50px;
      }
      input {
        display: inline-block;
        width: 200px;
        height: 32px;
        line-height: 1.5;
        padding: 4px 7px;
        font-size: 12px;
        border: 1px solid #dcdee2;
        border-radius: 4px;
        color: #515a6e;
        background-color: #fff;
        background-image: none;
        position: relative;
        cursor: text;
        transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
          box-shadow 0.2s ease-in-out;
      }
      button {
        color: #fff;
        background-color: #19be6b;
        border-color: #19be6b;
        outline: 0;
        vertical-align: middle;
        line-height: 1.5;
        display: inline-block;
        font-weight: 400;
        text-align: center;
        -ms-touch-action: manipulation;
        touch-action: manipulation;
        cursor: pointer;
        background-image: none;
        border: 1px solid transparent;
        white-space: nowrap;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        padding: 5px 15px 6px;
        font-size: 12px;
        border-radius: 4px;
        transition: color 0.2s linear, background-color 0.2s linear,
          border 0.2s linear, box-shadow 0.2s linear;
      }
      #qrcode {
        margin-top: 20px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <input
        type="text"
        placeholder="请输入您想转化成二维码的字符串"
        id="input"
      />
      <button onclick="creatQRcode();">一键生成</button>
      <div id="qrcode"></div>
    </div>
    <script src="https://zxpsuper.github.io/Demo/qrcode/qrcode-dev.js"></script>
    <script type="text/javascript">
      var qrcode = null;
      function creatQRcode() {
        document.getElementById("qrcode").innerHTML = "";
        qrcode = new QRCode(document.getElementById("qrcode"), {
          text: document.getElementById("input").value,
          width: 200,
          height: 200,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }
    </script>
  </body>
</html>
```

**options**

* 首参为生成存放 `img` 标签的父元素
* 第二个参数为 `Object`  类型的 `options`

|属性|类型|说明|
|:---:|:---:|:---:|
|text|String|目标文本|
|width|Number|图片宽度|
|height|Number|图片高度|
|colorDark|String|二维码颜色|
|colorLight|默认QRCode.CorrectLevel.L|容错级别，可设置为：QRCode.CorrectLevel.L ，QRCode.CorrectLevel.M，QRCode.CorrectLevel.Q，QRCode.CorrectLevel.H|


## 二维码扫码识别

这里利用了一个库 [llqrcode.js](https://github.com/zxpsuper/Demo/blob/master/qrcode/llqrcode.js), 使用 `qrcode.decode()` 对 id 为 `qr-canvas` 的 `canvas` 进行解码.

先上 [Demo](https://zxpsuper.github.io/Demo/qrcode/qrcode-scan.html) 和 [项目源码](https://github.com/zxpsuper/Demo/blob/master/qrcode)

我们需要做的就是，调用设备的摄像头（后置摄像头优先），获得的画面用 `video` 标签实时显示出来，再定时取画面生成 canvas ，调用 `qrcode.decode()` 解密。

```js
// variable.js
var gCtx = null; //canvas.ctx
var gCanvas = null; // qr-canvas
// var c = 0;
var stype = 0; // 识别流程 0未开始 1进行中 2已结束
var gUM = false;
var webkit = false;
var moz = false;
var v = null; // 存放视频的变量
var scanCodeStart = false; // 开始扫码
var mediaStreamTrack = null; // mediaStreamTrack 实现关闭摄像头功能 mediaStreamTrack.stop()
var imghtml =
  '<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>' +
  '<div id="imghelp">drag and drop a QRCode here' +
  "<br>or select a file" +
  '<input type="file" onchange="handleFiles(this.files)" id="upload-img"/>' +
  "</div>" +
  "</div>";

var vidhtml = '<video id="v" autoplay muted></video>';
```

```js
// methods.js

function qrcodeScanLoad(width, height) {
  if (isCanvasSupported() && window.File && window.FileReader) {
    initCanvas(width, height);
    qrcode.callback = scanCodeCallback;
    document.getElementById("mainbody").style.display = "inline";
    setwebcam();
  } else {
    document.getElementById("mainbody").style.display = "inline";
    document.getElementById("mainbody").innerHTML =
      '<p id="mp1">QR code scanner for HTML5 capable browsers</p><br>' +
      '<br><p id="mp2">sorry your browser is not supported</p><br><br>';
  }
}

// 绘制遮罩层canvas
function setMask() {
  var canvas = document.querySelector("#scancode-mask");
  canvas.width =
    document.body.clientWidth > 1024 ? 1024 : document.body.clientWidth;
  canvas.height =
    document.body.clientWidth > 1024 ? 1136 : document.body.clientHeight;
  var ctx = canvas.getContext("2d");

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  let x1,
    y1,
    width = canvas.width * 0.6;
  x1 = (canvas.width - width) / 2;
  y1 = (canvas.height - width) / 2;
  ctx.fillRect(x1, y1, width, width);
  ctx.fill();
  ctx.save();

  ctx.globalCompositeOperation = "source-over";

  // 第二象限点
  ctx.moveTo(x1, y1 + 2);
  ctx.lineTo(x1 + 20, y1 + 2);
  ctx.moveTo(x1 + 2, y1);
  ctx.lineTo(x1 + 2, y1 + 20);

  // 第一象限点
  ctx.moveTo(x1 + width - 20, y1 + 2);
  ctx.lineTo(x1 + width, y1 + 2);
  ctx.moveTo(x1 + width - 2, y1 + 1);
  ctx.lineTo(x1 + width - 2, y1 + 20);

  // 第四象限点
  ctx.moveTo(x1 + width - 20, y1 + width - 2);
  ctx.lineTo(x1 + width, y1 + width - 2);
  ctx.moveTo(x1 + width - 2, y1 + width - 1);
  ctx.lineTo(x1 + width - 2, y1 + width - 20);

  // 第三象限点
  ctx.moveTo(x1 + 20, y1 + width - 2);
  ctx.lineTo(x1, y1 + width - 2);
  ctx.moveTo(x1 + 2, y1 + width - 2);
  ctx.lineTo(x1 + 2, y1 + width - 20);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "green";
  ctx.stroke();
}
function setwebcam() {
  var options = true;
  if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
    try {
      navigator.mediaDevices.enumerateDevices().then(function(devices) {
        let video = [];
        devices.forEach(function(device) {
          if (device.kind === "videoinput") {
            video.push(device);
          }
        });
        // 调用设备的摄像头，video[1] 为后置摄像头，或者label含有‘back’为后置摄像头
        if (video.length >= 2) {
          options = {
            deviceId: { exact: video[1].deviceId },
            facingMode: { exact: "environment" }
          };
        }
        video.forEach(item => {
          if (item.label.toLowerCase().search("back") > -1)
            options = {
              deviceId: { exact: device.deviceId },
              facingMode: { exact: "environment" }
            };
        });
        scanCodeStart = true;
        setwebcam2(options);
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log("no navigator.mediaDevices.enumerateDevices");
    setwebcam2(options);
  }
}

function setwebcam2(options) {
  if (stype == 1) {
    setTimeout(captureToCanvas, 500);
    return;
  }

  var n = navigator;
  document.getElementById("outdiv").innerHTML = vidhtml;
  v = document.getElementById("v");
  try {
    if (n.mediaDevices && n.mediaDevices.getUserMedia) {
      n.mediaDevices
        .getUserMedia({ video: options, audio: false })
        .then(function(stream) {
          success(stream);
        })
        .catch(function(error) {
          error(error);
        });
    } else if (n.getUserMedia) {
      webkit = true;
      n.getUserMedia({ video: options, audio: false }, success, error);
    } else if (n.webkitGetUserMedia) {
      webkit = true;
      n.webkitGetUserMedia({ video: options, audio: false }, success, error);
    }
  } catch (err) {
    console.log(err);
  }
  stype = 1;
  if (getSystem() === "ios") {
    alert("您的設備暫不支持實時掃碼，請上傳圖片識別！");
    return;
  }
  if (
    (n.mediaDevices && n.mediaDevices.getUserMedia) ||
    n.getUserMedia ||
    n.webkitGetUserMedia
  )
    setTimeout(captureToCanvas, 500);
  else {
    alert("您的設備暫不支持實時掃碼，請上傳圖片識別！");
  }
}

// 获取操作系统
function getSystem() {
  var u = navigator.userAgent;
  var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //g
  var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  if (isAndroid) {
    //这个是安卓操作系统
    return "android";
  } else if (isIOS) {
    //这个是ios操作系统
    return "ios";
  } else {
    return "other";
  }
}

// 选择图片上传
function setimg($event) {
  qrcode.callback = scanCodeCallback;
  $event && $event.preventDefault();
  stype = 2;
  let file = document.getElementById("upload-img");
  file.click();
}

// 上传成功的回调
function scanCodeCallback(a) {
  var html = htmlEntities(a);
  stype = 0;
  alert(html);
}

// 处理上传文件识别
function handleFiles(f) {
  var o = [];

  for (var i = 0; i < f.length; i++) {
    var reader = new FileReader();
    reader.onload = (function(theFile) {
      return function(e) {
        gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
        qrcode.decode(e.target.result);
      };
    })(f[i]);
    reader.readAsDataURL(f[i]);
  }
}

function initCanvas(w, h) {
  gCanvas = document.getElementById("qr-canvas");
  gCanvas.style.width = w + "px";
  gCanvas.style.height = h + "px";
  gCanvas.width = w;
  gCanvas.height = h;
  gCtx = gCanvas.getContext("2d");
  gCtx.clearRect(0, 0, w, h);
}

// 画面转 canvas
function captureToCanvas() {
  if (stype != 1) return;
  if (gUM && scanCodeStart) {
    try {
      gCtx.drawImage(v, 0, 0);
      try {
        qrcode.decode(); // 默认为id=qr-canvas的canvas转成图片的base64
      } catch (e) {
        console.log(e);
        setTimeout(captureToCanvas, 500);
      }
    } catch (e) {
      console.log(e);
      setTimeout(captureToCanvas, 500);
    }
  }
}

// 对特殊符号进行处理
function htmlEntities(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// 判断是否支持canvas
function isCanvasSupported() {
  var elem = document.createElement("canvas");
  return !!(elem.getContext && elem.getContext("2d"));
}

function success(stream) {
  // mediaStreamTrack 实现关闭摄像头功能
  if (stream)
    mediaStreamTrack =
      typeof stream.stop === "function" ? stream : stream.getTracks()[0];

  v.srcObject = stream;
  if (scanCodeStart) {
    v.play();
    gUM = true;
    setTimeout(captureToCanvas, 500);
  } else {
  }
}

function error(error) {
  gUM = false;
  return;
}
```

其中 setMask 为绘制遮罩层方法，qrcodeScanLoad 为初始化加载方法。

```html

<body>
    <div class="body">
      <div id="mainbody" style="display: inline;">
        <div id="outdiv" autoplay muted></div>
      </div>
      <canvas id="qr-canvas" width="800" height="600"></canvas>
      <canvas id="scancode-mask"></canvas>
      <div class="scancode-tips-group" id="scancode-tips-group">
        <span class="tips">將QR Code 放入框内，即可自動掃描</span>
        <div class="upload-my-code" onClick="setimg()">我的QR Code</div>
      </div>

      <div id="img-upload-container" style="display: none">
        <div id="qrfile">
          <canvas id="out-canvas" width="320" height="240"></canvas>
          <div id="imghelp">
            drag and drop a QRCode here
            <br />or select a file
            <input
              type="file"
              onchange="handleFiles(this.files)"
              id="upload-img"
            />
          </div>
        </div>
      </div>
    </div>
    <script src="./llqrcode.js"></script>
    <script src="./variable.js"></script>
    <script src="./methods.js"></script>
    <script>
      qrcodeScanLoad(320, 400);
      setMask();
      // 对我的 QR Code 进行定位显示
      if (document.body.clientWidth < 1025) {
        document.getElementById("scancode-tips-group").style.top =
          (document.body.clientHeight - document.body.clientWidth) / 2 +
          document.body.clientWidth * 0.9 -
          10 +
          "px";
      } else {
        document.getElementById("scancode-tips-group").style.top = "720px";
      }
    </script>
  </body>
```

这里做了适配，当超过 1024 时，canvas 宽度就设为 1024。详细在代码中已经做了注释。


## 更多推荐

[前端进阶小书（advanced_front_end）](https://github.com/zxpsuper/advanced_front_end)

[前端每日一题（daily-question）](https://github.com/zxpsuper/daily-question)

[webpack4 搭建 Vue 应用（createVue）](https://github.com/zxpsuper/createVue)

![](https://user-gold-cdn.xitu.io/2019/4/23/16a483433ed83578?w=281&h=271&f=png&s=29836)