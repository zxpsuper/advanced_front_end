# Canvas 进阶（三）ts + canvas 重写”辨色“小游戏

# 1. 背景
之前写过一篇文章 [ES6 手写一个“辨色”小游戏](https://juejin.im/post/5ba0da47e51d450e6a2e0548), 感觉好玩挺不错。岂料评论区大神频出，其中有人指出，打开控制台，输入以下代码：
```js
setInterval( ()=>document.querySelector('#special-block').click(),1)
```
即可破解，分数蹭蹭上涨，这不就是bug吗？同时评论区 【[爱编程的李先森](https://juejin.im/user/5a58204af265da3e393a59cc/posts)】建议，让我用 `canvas` 来画会更简单，因此有了这篇文章。

话不多说，先上 [Demo](https://zxpsuper.github.io/Demo/color/colorTs.html) 和 [项目源码](https://github.com/zxpsuper/Demo/tree/master/color)

有趣的是，在我写完这篇文章之后，发现【[爱编程的李先森](https://juejin.im/user/5a58204af265da3e393a59cc/posts)】也写了一篇[canvas手写辨色力小游戏](https://juejin.im/post/5bb9e74b6fb9a05d185f0417),实现方式有所不同，可以对比下。

![项目预览](./canvas3-1.png)

# 2. 实现
本项目基于 `typescript` 和 `canvas` 实现

## (1) 首先定义配置项

一个canvas标签，游戏总时长time, 开始函数start, 结束函数end

```ts
interface BaseOptions {
  time?: number;
  end?: Function;
  start?: Function;
  canvas?: HTMLCanvasElement;
}
```

定义类 `ColorGame` 实现的接口 `ColorGameType`, init()初始化方法，nextStep()下一步，reStart()重新开始方法

```ts
interface ColorGameType {
  init: Function;
  nextStep: Function;
  reStart: Function;
}
```
定义一个坐标对象，用于储存每个色块的起始点
```ts
interface Coordinate {
  x: number;
  y: number;
}
```

## (2) 实现类 ColorGame
定义好了需要用到的接口，再用类去实现它

```ts
class ColorGame implements ColorGameType {
  option: BaseOptions;
  step: number; // 步
  score: number; // 得分
  time: number; // 游戏总时间
  blockWidth: number; // 盒子宽度
  randomBlock: number; // 随机盒子索引
  positionArray: Array<Coordinate>; // 存放色块的数组
  constructor(userOption: BaseOptions) {
    // 默认设置
    this.option = {
      time: 30, // 总时长
      canvas: <HTMLCanvasElement>document.getElementById("canvas"),
      start: () => {
        document.getElementById("result").innerHTML = "";
        document.getElementById("screen").style.display = "block";
      },
      end: (score: number) => {
        document.getElementById("screen").style.display = "none";
        document.getElementById(
          "result"
        ).innerHTML = `<div class="result" style="width: 100%;">
        <div class="block-inner" id="restart"> 您的得分是： ${score} <br/> 点击重新玩一次</div>
      </div>`;
        // @ts-ignore
        addEvent(document.getElementById("restart"), "click", () => {
          this.reStart();
        });
      } // 结束函数
    };
    this.init(userOption); // 初始化，合并用户配置
  }
  init(userOption: BaseOptions) {
  }
  nextStep() {}
  // 重新开始其实也是重新init()一次
  reStart() {
    this.init(this.option);
  }
}
```
## （3）实现 `init()` 方法
`init()` 方法实现参数初始化，执行 `start()` 方法，并在最后执行 `nextStep()` 方法，并监听 `canvas`的 `mousedown` 和 `touchstart` 事件。

这里用到 `canvas.getContext("2d").isPointInPath(x, y)` 判断点击点是否处于最后一次绘画的矩形内，因此特殊颜色的色块要放在最后一次绘制
```ts
init(userOption: BaseOptions) {
    if (this.option.start) this.option.start();
    this.step = 0; // 步骤初始化
    this.score = 0;// 分数初始化
    this.time = this.option.time; // 倒计时初始化
    // 合并参数
    if (userOption) {
      if (Object.assign) {
        Object.assign(this.option, userOption);
      } else {
        extend(this.option, userOption, true);
      }
    }
    
    // 设置初始时间和分数
    document.getElementsByClassName(
      "wgt-score"
    )[0].innerHTML = `得分：<span id="score">${this.score}</span>
    时间：<span id="timer">${this.time}</span>`;

    // 开始计时
    (<any>window).timer = setInterval(() => {
      if (this.time === 0) {
        clearInterval((<any>window).timer);
        this.option.end(this.score);
      } else {
        this.time--;
        document.getElementById("timer").innerHTML = this.time.toString();
      }
    }, 1000);
    
    this.nextStep(); // 下一关
    ["mousedown", "touchstart"].forEach(event => {
      this.option.canvas.addEventListener(event, e => {
        let loc = windowToCanvas(this.option.canvas, e);
        // isPointInPath 判断是否在最后一次绘制矩形内
        if (this.option.canvas.getContext("2d").isPointInPath (loc.x, loc.y)) {
          this.nextStep();
          this.score++;
          document.getElementById("score").innerHTML = this.score.toString();
        }
      });
    });
  }
```

## （4）实现 `nextStep()` 方法

`nexStep()` 这里实现的是每一回合分数增加，以及画面的重新绘画，这里我用了 `this.blockWidth` 存放每一级色块的宽度， `this.randomBlock` 存放随机特殊颜色色块的index, `this.positionArray` 用于存放每个色块的左上角坐标点，默认设置色块之间为2像素的空白间距。

有一个特殊的地方是在清除画布时`ctx.clearRect(0, 0, canvas.width, canvas.width);`，需要先 `ctx.beginPath();`清除之前记忆的路径。否则会出现以下的效果：

![](./canvas3-2.png)
```ts
nextStep() {
    // 记级
    this.step++;
    let col: number; // 列数
    if (this.step < 6) {
      col = this.step + 1;
    } else if (this.step < 12) {
      col = Math.floor(this.step / 2) * 2;
    } else if (this.step < 18) {
      col = Math.floor(this.step / 3) * 3;
    } else {
      col = 16;
    }
    let canvas = this.option.canvas;
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.width); // 清除画布
    ctx.closePath();
    // 小盒子宽度
    this.blockWidth = (canvas.width - (col - 1) * 2) / col;
    // 随机盒子index
    this.randomBlock = Math.floor(col * col * Math.random());
    // 解构赋值获取一般颜色和特殊颜色
    let [normalColor, specialColor] = getColor(this.step);

    this.positionArray = [];
    for (let i = 0; i < col ** 2; i++) {
      let row = Math.floor(i / col);
      let colNow = i % col;
      let x = colNow * (this.blockWidth + 2),
        y = row * (this.blockWidth + 2);

      this.positionArray.push({
        x,
        y
      });
      if (i !== this.randomBlock)
        drawItem(ctx, normalColor, x, y, this.blockWidth, this.blockWidth);
    }

    ctx.beginPath();
    drawItem(
      ctx,
      specialColor,
      this.positionArray[this.randomBlock].x,
      this.positionArray[this.randomBlock].y,
      this.blockWidth,
      this.blockWidth
    );
    ctx.closePath();
  }
```
`drawItem()`用于绘制每一个色块, 这里需要指出的是，`isPointInPath` 是判断是否处于矩形的路径上，只有使用 `context.fill()` 才能使整个矩形成为判断的路径。

```ts
function drawItem(
  context: Context,
  color: string,
  x: number,
  y: number,
  width: number,
  height: number
): void {
  context.fillStyle = `#${color}`;
  context.rect(x, y, width, height);
  context.fill(); //替代fillRect();
}
```

## （5） 其他共用方法 `gameMethods.ts` 和 `utils.ts`

```ts
// gameMethods.ts
/**
 * 根据关卡等级返回相应的一般颜色和特殊颜色
 * @param {number} step 关卡
 */
export function getColor(step: number): Array<string> {
  let random = Math.floor(100 / step);
  let color = randomColor(17, 255),
    m: Array<string | number> = color.match(/[\da-z]{2}/g);
  for (let i = 0; i < m.length; i++) m[i] = parseInt(String(m[i]), 16); //rgb
  let specialColor =
    getRandomColorNumber(m[0], random) +
    getRandomColorNumber(m[1], random) +
    getRandomColorNumber(m[2], random);
  return [color, specialColor];
}
/**
 * 返回随机颜色的一部分值
 * @param num 数字
 * @param random 随机数
 */
export function getRandomColorNumber(
  num: number | string,
  random: number
): string {
  let temp = Math.floor(Number(num) + (Math.random() < 0.5 ? -1 : 1) * random);
  if (temp > 255) {
    return "ff";
  } else if (temp > 16) {
    return temp.toString(16);
  } else if (temp > 0) {
    return "0" + temp.toString(16);
  } else {
    return "00";
  }
}
// 随机颜色 min 大于16
export function randomColor(min: number, max: number): string {
  var r = randomNum(min, max).toString(16);
  var g = randomNum(min, max).toString(16);
  var b = randomNum(min, max).toString(16);
  return r + g + b;
}
// 随机数
export function randomNum(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

```

```ts
// utils.ts
/**
 * 合并两个对象
 * @param o 默认对象
 * @param n 自定义对象
 * @param override 是否覆盖默认对象
 */
export function extend(o: any, n: any, override: boolean): void {
  for (var p in n) {
    if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override)) o[p] = n[p];
  }
}

/**
 *   事件兼容方法
 * @param element dom元素
 * @param type 事件类型
 * @param handler 事件处理函数
 */
export function addEvent(element: HTMLElement, type: string, handler: any) {
  if (element.addEventListener) {
    element.addEventListener(type, handler, false);
    // @ts-ignore
  } else if (element.attachEvent) {
    // @ts-ignore
    element.attachEvent("on" + type, handler);
  } else {
    // @ts-ignore
    element["on" + type] = handler;
  }
}

/**
 * 获取点击点于canvas内的坐标
 * @param canvas canvas对象
 * @param e 点击事件
 */
export function windowToCanvas(canvas: HTMLCanvasElement, e: any) {
  let bbox = canvas.getBoundingClientRect(),
    x = IsPC() ? e.clientX || e.clientX : e.changedTouches[0].clientX,
    y = IsPC() ? e.clientY || e.clientY : e.changedTouches[0].clientY;

  return {
    x: x - bbox.left,
    y: y - bbox.top
  };
}

/**
 * 判断是否为 PC 端，若是则返回 true，否则返回 flase
 */
export function IsPC() {
  let userAgentInfo = navigator.userAgent,
    flag = true,
    Agents = [
      "Android",
      "iPhone",
      "SymbianOS",
      "Windows Phone",
      "iPad",
      "iPod"
    ];

  for (let v = 0; v < Agents.length; v++) {
    if (userAgentInfo.indexOf(Agents[v]) > 0) {
      flag = false;
      break;
    }
  }
  return flag;
}
```
# 3. 使用

将代码打包构建后引入 `html` 后，新建 `new ColorGame(option)` 即可实现。前提是页面结构如下：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>canvas 辨色小游戏</title>
    <link
      rel="stylesheet"
      href="https://zxpsuper.github.io/Demo/color/index.css"
    />
  </head>
  <body>
    <div class="container">
      <div class="wgt-home" id="page-one">
        <h1>辨色力测试</h1>
        <p>找出所有色块里颜色不同的一个</p>
        <a id="start" class="btn btn-primary btn-lg">开始挑战</a>
      </div>
      <header class="header">
        <h1>辨色力测试</h1>
      </header>

      <aside class="wgt-score"></aside>

      <section id="screen" class="screen">
        <canvas id="canvas" width="600" height="600"></canvas>
      </section>
      <section id="result"></section>

      <footer>
        <div>
          <a href="http://zxpsuper.github.io" style="color: #FAF8EF">
            my blog</a
          >
        </div>
        ©<a href="https://zxpsuper.github.io">Suporka</a> ©<a
          href="https://zxpsuper.github.io/Demo/advanced_front_end/"
          >My book</a
        >
        ©<a href="https://github.com/zxpsuper">My Github</a>
      </footer>
    </div>
    <script src="./ColorGame2.js"></script>
    <script>
      function addEvent(element, type, handler) {
        if (element.addEventListener) {
          element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
          element.attachEvent("on" + type, handler);
        } else {
          element["on" + type] = handler;
        }
      }
      window.onload = function() {
        addEvent(document.querySelector("#start"), "click", function() {
          document.querySelector("#page-one").style.display = "none";
          new ColorGame({
            time: 30
          });
        });
      };
    </script>
  </body>
</html>
```

## 总结

这里主要是对 `isPointInPath` 的使用实践，在之后的文章《canvas绘制九宫格》也会用到此方法，敬请期待！

好了，等你们再次来破解，哈哈哈哈！！！😂😂😂😂😂

## 更多推荐

[前端进阶小书（advanced_front_end）](https://github.com/zxpsuper/advanced_front_end)

[前端每日一题（daily-question）](https://github.com/zxpsuper/daily-question)

[webpack4 搭建 Vue 应用（createVue）](https://github.com/zxpsuper/createVue)

[Canvas 进阶（一）二维码的生成与扫码识别](https://segmentfault.com/a/1190000019461615)

[Canvas 进阶（二）写一个生成带logo的二维码npm插件](https://juejin.im/post/5d1c461f6fb9a07f070e4768)
![](https://user-gold-cdn.xitu.io/2019/4/23/16a483433ed83578?w=281&h=271&f=png&s=29836)