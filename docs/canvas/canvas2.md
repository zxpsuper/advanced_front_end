# 写一个生成带logo的二维码npm插件

## 背景

最近接触到的需求，前端生成一个带企业logo的二维码，并支持点击下载它。


## 实现

在前面的文章有讲到如何用 canvas 画二维码，在此基础上再画一个公司logo,并提供下载的方法供调用，再封装成 npm 插件

模块名称： `qrcode-with-logos`

github地址：[https://github.com/zxpsuper/qrcode-with-logos](https://github.com/zxpsuper/qrcode-with-logos)

npm地址：[https://www.npmjs.com/package/qrcode-with-logos](https://www.npmjs.com/package/qrcode-with-logos)

![](./qrcode-with-logo.png)

## 核心代码

将整个封装成一个 `QrCodeWithLogo`类，并提供三个方法：

```typescript
interface IQrCodeWithLogo {
  toCanvas(): Promise<any>;
  toImage(): Promise<any>;
  downloadImage(name: string): void;
}

class QrCodeWithLogo implements IQrCodeWithLogo {
  option: BaseOptions;
  constructor(option: BaseOptions) {
    this.option = option;
    return this;
  }
  toCanvas = () => {
    return toCanvas.call(this, this.option);
  };
  toImage = () => {
    return toImage.call(this, this.option);
  };
  downloadImage = (name: string) => {
    saveImage(this.option.image, name);
  };
}
```

### 1. toCanvas()

此方法用到了库`qrcode`的`toCanvas`方法
```ts
export const toCanvas = (options: BaseOptions) => {
  return renderQrCode(options)
    .then(() => options)
    .then(drawLogo);
};
```
这里先用`qrcode`库画出二维码的canvas

![](./canvas-qrcode.png)
```typescript
import QRCode = require("qrcode");

const toCanvas = promisify(QRCode.toCanvas);

export const renderQrCode = ({
  canvas,
  content,
  width = 0,
  nodeQrCodeOptions = {}
}: BaseOptions) => {
  // 容错率，默认对内容少的二维码采用高容错率，内容多的二维码采用低容错率
  // according to the content length to choose different errorCorrectionLevel
  nodeQrCodeOptions.errorCorrectionLevel =
    nodeQrCodeOptions.errorCorrectionLevel || getErrorCorrectionLevel(content);

  return getOriginWidth(content, nodeQrCodeOptions).then((_width: number) => {
    // 得到原始比例后还原至设定值，再放大4倍以获取高清图
    // Restore to the set value according to the original ratio, and then zoom in 4 times to get the HD image.
    nodeQrCodeOptions.scale = width === 0 ? undefined : (width / _width) * 4;
    // @ts-ignore
    return toCanvas(canvas, content, nodeQrCodeOptions);
  });
};
```

promisify()是封装的一个方法，用于减少return promise时的代码，方便书写

```ts
export const promisify = (f: Function): Function => {
  return function() {
    const args = Array.prototype.slice.call(arguments);
    return new Promise(function(resolve, reject) {
      args.push(function(err: object, result: object) {
        if (err) reject(err);
        else resolve(result);
      });
      f.apply(null, args);
    });
  };
};
```
画出canvas,紧接着判断是否有logo, 如果有就画logo,这里有两种模式:

- 一种是直接画图 `ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);`，可拓展性不强。

- 一种是canvas叠加，使用 `ctx.createPattern(canvasImage, "no-repeat");` 可以实现更多复杂的效果

![](./canvas-qrcode-logo.png)
```ts
export const drawLogo = ({ canvas, content, logo }: BaseOptions) => {
  if (!logo) {
    return;
  }
  // @ts-ignore
  const canvasWidth = canvas.width;
  const {
    logoSize = 0.15,
    borderColor = "#ffffff",
    bgColor = borderColor || "#ffffff",
    borderSize = 0.05,
    crossOrigin,
    borderRadius = 8,
    logoRadius = 0
  } = logo;
  let logoSrc = typeof logo === "string" ? logo : logo.src;
  let logoWidth = canvasWidth * logoSize;
  let logoXY = (canvasWidth * (1 - logoSize)) / 2;
  let logoBgWidth = canvasWidth * (logoSize + borderSize);
  let logoBgXY = (canvasWidth * (1 - logoSize - borderSize)) / 2;
  // @ts-ignore
  const ctx = canvas.getContext("2d");

  // logo 底色, draw logo background color
  canvasRoundRect(ctx)(
    logoBgXY,
    logoBgXY,
    logoBgWidth,
    logoBgWidth,
    borderRadius
  );
  ctx.fillStyle = bgColor;
  ctx.fill();

  // logo
  const image = new Image();
  if (crossOrigin || logoRadius) {
    image.setAttribute("crossOrigin", crossOrigin || "anonymous");
  }
  image.src = logoSrc;

  // 使用image绘制可以避免某些跨域情况
  // Use image drawing to avoid some cross-domain situations
  const drawLogoWithImage = (image: any) => {
    ctx.drawImage(image, logoXY, logoXY, logoWidth, logoWidth);
  };

  // 使用canvas绘制以获得更多的功能
  // Use canvas to draw more features, such as borderRadius
  const drawLogoWithCanvas = (image: any) => {
    const canvasImage = document.createElement("canvas");
    canvasImage.width = logoXY + logoWidth;
    canvasImage.height = logoXY + logoWidth;
    canvasImage
      .getContext("2d")
      .drawImage(image, logoXY, logoXY, logoWidth, logoWidth);

    canvasRoundRect(ctx)(logoXY, logoXY, logoWidth, logoWidth, logoRadius);
    ctx.fillStyle = ctx.createPattern(canvasImage, "no-repeat");
    ctx.fill();
  };

  // 将 logo绘制到 canvas上
  // Draw the logo on the canvas
  return new Promise((resolve, reject) => {
    image.onload = () => {
      logoRadius ? drawLogoWithCanvas(image) : drawLogoWithImage(image);
      resolve();
    };
  });
};
```

### 2. toImage()

此方法利用之前的`toCanvas()`方法，生成canvas后拿到 `canvas.toDataURL()` 的值，赋给`<img>`的 `src`即可。这里，我们加入了 `download` `downloadName`属性用于下载，因此在 `toImage()`方法中判断，代码如下：
```ts
export const toImage = (options: BaseOptions) => {
  const canvas = document.createElement("canvas");
  console.log("options", options);
  options.canvas = canvas;
  if (options.logo) {
    if (isString(options.logo)) {
      // @ts-ignore
      options.logo = { src: options.logo };
    }
    // @ts-ignore
    options.logo.crossOrigin = "Anonymous";
  }
  // @ts-ignore
  return toCanvas(options).then(() => {
    const { image = new Image(), downloadName = "qr-code" } = options;
    let { download } = options;
    // @ts-ignore
    image.src = canvas.toDataURL();

    if (download !== true && !isFunction(download)) {
      return;
    }
    download = download === true ? (start: Function) => start() : download;

    const startDownload: Function = () => {
      saveImage(image, downloadName);
    };

    download && download(startDownload);
    return new Promise((resolve, reject) => {
      resolve();
    });
  });
};


export const saveImage = (image: Element, name: string) => {
  // @ts-ignore
  const dataURL = image.src;

  const link = document.createElement("a");
  link.download = name;
  link.href = dataURL;
  link.dispatchEvent(new MouseEvent("click"));
};
```

### 3. downloadImage(name)

提供一个主动调用下载图片的方法，传入文件名name, 其中用到 `saveImage()`方法，这个在 `toImage()` 中也有用到。

下载文件的流程是：生成一个`<a>`标签, 设置 `href`值为 `image`的 `src` 值，`download` 属性赋值文件名，然后给 `<a>` 主动一次点击事件即可。

```ts
downloadImage = (name: string) => {
    saveImage(this.option.image, name);
};
```

## npm 发布

初次尝试 `typescript`, 用的不够优美但无妨使用。 `npm run build` 构建出支持 umd 的文件，然后 `npm login`, `npm publish` 即可。webpack 配置可查看 [github](https://github.com/zxpsuper/qrcode-with-logos) 代码。 

## 插件使用

下面是详细代码
```html
<canvas id="canvas"></canvas> <img src="" alt="" id="image" />
<img id="image" alt="">
```
npm 模块导入：
```js
import QrCodeWithLogo from "qrcode-with-logos";
let qrcode = new QrCodeWithLogo({
  canvas: document.getElementById("canvas"),
  content: "https://github.com/zxpsuper",
  width: 380,
  //   download: true,
  image: document.getElementById("image"),
  logo: {
    src: "https://avatars1.githubusercontent.com/u/28730619?s=460&v=4"
  }
});

qrcode.toCanvas().then(() => {
  qrcode.toImage().then(() => {
    setTimeout(() => {
      qrcode.downloadImage("hello world");
    }, 2000);
  });
});
```
当然你也可以`<script>`引入使用

```html
<script src="https://zxpsuper.github.io/qrcode-with-logos/dist/QRcode-with-logo.js"></script>
<script>
let qrcode = new QrCodeWithLogo({
  canvas: document.getElementById("canvas"),
  content: "https://github.com/zxpsuper",
  width: 380,
  //   download: true,
  image: document.getElementById("image"),
  logo: {
    src: "https://avatars1.githubusercontent.com/u/28730619?s=460&v=4"
  }
});

qrcode.toCanvas().then(() => {
  qrcode.toImage().then(() => {
    setTimeout(() => {
      qrcode.downloadImage("hello world");
    }, 2000);
  });
});
</script>

```
That is all.

## 更多推荐

[前端进阶小书（advanced_front_end）](https://github.com/zxpsuper/advanced_front_end)

[前端每日一题（daily-question）](https://github.com/zxpsuper/daily-question)

[webpack4 搭建 Vue 应用（createVue）](https://github.com/zxpsuper/createVue)

[Canvas 进阶（一）二维码的生成与扫码识别](https://juejin.im/post/5d00b3626fb9a07ed74076a9)
![](https://user-gold-cdn.xitu.io/2019/4/23/16a483433ed83578?w=281&h=271&f=png&s=29836)