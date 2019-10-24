# 一款轮播组件的诞生

## 1. 前言

早在几个月前，就想自己动手写个轮播图组件，因此也看了许多文章，断断续续过了几个月，今天终于有时间腾出手来给此插件做个总结，因此有了这篇文章。话不多说，先上 [Demo](https://zxpsuper.github.io/Demo/carousal/index.html), 效果如下：

![](https://user-gold-cdn.xitu.io/2018/12/27/167eee21bc7e4338?w=564&h=277&f=gif&s=3058680)

## 2. HTML and CSS
本文不讨论html,css的实现方式，直接贴上代码
```html

<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Suporka Vue App</title>
  </head>
  <body>
    <div id="carousal">
      <!--左箭头-->
      <button
        type="button"
        class="suporka-carousel__arrow suporka-carousel__arrow--left"
        style=""
        id="suporka-prev-btn"
      >
        &lt;
      </button>
      <div id="wrapper">
        <div class="box">
          <img
            src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher1.jpg"
            alt=""
          />
        </div>
        <div class="box">
          <img
            src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher2.jpg"
            alt=""
          />
        </div>
        <div class="box">
          <img
            src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher3.jpg"
            alt=""
          />
        </div>
        <div class="box">
          <img
            src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher4.jpg"
            alt=""
          />
        </div>
      </div>
      <!--右箭头-->
      <button
        type="button"
        class="suporka-carousel__arrow suporka-carousel__arrow--right"
        style=""
        id="suporka-next-btn"
      >
        &gt;
      </button>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/suporka-carousal@1.0.3/carousal.js"></script>
    <script>
      new Carousal({
        autoScroll: true,
        showDot: true
      });
    </script>
  </body>
</html>
```

```css
/*样式代码*/
* {
  margin: 0;
  padding: 0;
}
div {
  margin: 0;
  border: 0;
  padding: 0;
}
#carousal {
  width: 557px;
  overflow: hidden;
  position: relative;
}
#wrapper {
  display: box; /* OLD - Android 4.4- */
  display: -webkit-box; /* OLD - iOS 6-, Safari 3.1-6 */
  display: -moz-box; /* OLD - Firefox 19- (buggy but mostly works) */
  display: -ms-flexbox; /* TWEENER - IE 10 */
  display: -webkit-flex; /* NEW - Chrome */
  display: flex;
  -webkit-flex-wrap: nowrap;
  -moz-flex-wrap: nowrap;
  -ms-flex-wrap: nowrap;
  -o-flex-wrap: nowrap;
  flex-wrap: nowrap;
  white-space: nowrap;
  position: relative;
  left: 0;
}
.suporka-carousel__arrow {
  /* display: none; */
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  height: 36px;
  width: 36px;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 50%;
  background-color: rgba(31, 45, 61, 0.5);
  color: #fff;
  position: absolute;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}
.suporka-carousel__arrow--right {
  right: -38px;
}
.suporka-carousel__arrow--left {
  left: -38px;
}
#carousal:hover > .suporkal-carousel__arrow {
  display: block;
}
#carousal:hover .suporka-carousel__arrow--right {
  right: 16px;
}
#carousal:hover .suporka-carousel__arrow--left {
  left: 16px;
}
#suporka-dot {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translate(-50%, 0);
}
#suporka-dot span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin: 0 10px;
  display: inline-block;
  background: #999;
}
#suporka-dot .suporka-dot--acitve {
  background: #fff;
}

```

## 3. javascript 实现轮播图功能

本插件是用 es6 写的，当然考虑兼容性，你可以选择 babel 进行编译，本文不做阐述。
### 1. 首先，创建一个 carousal 类
它有一些默认参数，如time（图片轮播间隔），transition (转场动画时间)，autoScroll（是否自动轮播）,showDot（是否显示底部小圆点）。然后将页面的一些元素挂载在类的属性上。

```js
class Carousal {
    constructor(userOption) {
    this.option = {
      time: 4000,
      transition: 0.8,
      autoScroll: true,
      showDot: false
    };
    // 当前索引
    this.number = 1;
    // 定时器
    this.timer = null;
    this.interval = null;
    this.carousal = document.getElementById("carousal");
    this.wrapper = document.querySelector("#wrapper");
    this.childrenLength: document.getElementById("wrapper").children.length;
    this.init(userOption);
  }
}
```

### 2. 初始化dom

当然，默认参数是可以修改的，所以类传入了一个 userOption 对象, 在构造函数中将用户设置的参数覆盖默认参数，在this.init(userOption) 方法中执行覆盖。

轮播图轮播的原理是：在轮播图组首位添加一个末位图片的副本，同时也在轮播图末位添加一个首位图片的副本，大概就是 ` 5 1 2 3 4 5 1 `, 此时共有7张图片，当向右轮播至第七张图片‘1’ 时, 取消transition后轮播图定位至第二张图片 ‘1’, 此时再度开启transition 。同理，向左轮播至第一张图片“5”时，也会取消transition后轮播图定位至第六张图片 ‘5’, 而后再度开启 transition。

因此，我们需要手动在dom结构中插入这两个首尾图片。pushItem() 方法正是为此而生。

```js
class Carousal {
    //...
  init(userOption) {
    // 合并用户配置
    if (Object.assign) {
      Object.assign(this.option, userOption);
    } else {
      // 不支持 Object.assign 就调用 extend 方法
      this.extend(this.option, userOption, true);
    }
    // 设置动画 transition
    this.wrapper.style.transition = `all ${this.option.transition}s`;
    this.wrapper.style["-moz-transition"] = `all ${this.option.transition}s`;
    this.wrapper.style["-webkit-transition"] = `all ${this.option.transition}s`;
    this.wrapper.style["-o-transition"] = `all ${this.option.transition}s`;
    // 首尾添加元素
    this.pushItem();
  }
  // 合并属性方法
  extend(o, n, override) {
    for (var p in n) {
      if (n.hasOwnProperty(p) && (!o.hasOwnProperty(p) || override))
        o[p] = n[p];
    }
  }
  // 初始化添加首尾子元素
  pushItem() {
    let movePx = this.carousal.offsetWidth; // 获取轮播图宽度
    let first = this.wrapper.children[0].cloneNode(true);
    let last = this.wrapper.children[this.childrenLength - 1].cloneNode(true);
    let parent = this.wrapper;
    parent.appendChild(first);
    parent.insertBefore(last, parent.children[0]);
    this.wrapper.style.left =
      this.wrapper.offsetLeft - movePx + "px";
  }
}

```

插入轮播图片之后，判断是否需要插入底部小圆点。requestAnimFrame()用于实现持续的动画效果。

```js
class Carousal {
    init() {
        //...续 this.pushItem();
        if (this.option.showDot) {
            let node = document.createElement('div');
            node.setAttribute('id', 'suporka-dot');
            node.innerHTML = `${'<span></span>'.repeat(this.childrenLength)}`;
            this.carousal.appendChild(node);
            this.dot = document.getElementById('suporka-dot');
            this.dot.firstChild.setAttribute('class', 'suporka-dot--acitve');
        }
        // 判断是否开启自动轮播，如是则自动轮播
        if (this.option.autoScroll) this.requestAnimFrame(this.autoMove());
    }
    requestAnimFrame() {
        return (
            window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            }
        );
    }
}
```

### 3. 加入事件监听

监听鼠标移入事件，当鼠标移入的时候，停止自动滚动。

监听左右按钮的点击，执行上一张，下一张图的轮播效果。

```js
class Carousal {
    init() {
        //...续 if (this.option.autoScroll) this.requestAnimFrame(this.autoMove());
        this.addEventListener();
    }
    // 添加事件
    addEvent(element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent('on' + type, handler);
        } else {
            element['on' + type] = handler;
        }
    }
    // 事件监听
    addEventListener() {
        if (this.option.autoScroll) {
            this.addEvent(this.carousal, 'mouseover', event => {
                clearInterval(this.interval);
            });
            this.addEvent(this.carousal, 'mouseout', event => {
                this.autoMove();
            });
        }
        let prev = document.getElementById('suporka-prev-btn');
        let next = document.getElementById('suporka-next-btn');
        if (prev && next) {
            this.addEvent(prev, 'click', event => {
                this.prev();
            });
            this.addEvent(next, 'click', event => {
                this.next();
            });
        }
    }
}
```

### 4. 自动轮播

定时动画，并且如果存在底部小圆点，修改其类名，达到与轮播图同步的效果。

```js
// 自动轮播
class Carousal {
    // ...
    autoMove() {
        let movePx = this.carousal.offsetWidth;
        this.interval = setInterval(() => {
            this.number += 1;
            this.wrapper.style.left = 0 - movePx * this.number + 'px';
            if (this.number === this.childrenLength + 1) this.startMove();
            if (this.dot)
                this.setDotClass(
                    this.dot.children,
                    this.number - 1,
                    'suporka-dot--acitve'
                );
        }, this.option.time);
    }
    // 开始移动
    startMove() {
        this.number = 1;
        this.timer = setTimeout(() => {
            this.wrapper.style.transition = `none`;
            this.wrapper.style.left = -this.carousal.offsetWidth + 'px';
            setTimeout(() => {
                this.wrapper.style.transition = `all ${
                    this.option.transition
                }s`;
            }, 100);
        }, this.option.transition * 1000);
    }
    // 设置小圆点样式
    setDotClass(parent, index, cls) {
        // 没有小圆点就返回
        if (!this.dot) return false;
        for (let i = 0; i < parent.length; i++) {
            removeClass(parent[i], cls);
        }
        addClass(parent[index], cls);
    }
}

// 三个类名操作方法
function hasClass(ele, cls) {
    if (ele.className)
        return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    else return false;
}
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

```

### 5. 实现上一张，下一张轮播功能

```js
class Carousal {
    //...
    // prev上一张
    prev() {
        let movePx = this.carousal.offsetWidth;
        this.number -= 1;

        this.wrapper.style.left = 0 - movePx * this.number + 'px';
        if (this.number === 0) this.goLastOne();
        if (this.dot)
            this.setDotClass(
                this.dot.children,
                this.number - 1,
                'suporka-dot--acitve'
            );
    }
    // 下一张
    next() {
        let movePx = this.carousal.offsetWidth;
        this.number += 1;
        this.wrapper.style.left = 0 - movePx * this.number + 'px';
        if (this.number === this.childrenLength + 1) this.startMove();
        if (this.dot)
            this.setDotClass(
                this.dot.children,
                this.number - 1,
                'suporka-dot--acitve'
            );
    }
    // 去到最后一张
    goLastOne() {
        this.number = this.childrenLength;
        this.timer = setTimeout(() => {
            this.wrapper.style.transition = `none`;
            this.wrapper.style.left =
                -this.carousal.offsetWidth * this.childrenLength + 'px';
            setTimeout(() => {
                this.wrapper.style.transition = `all ${
                    this.option.transition
                }s`;
            }, 100);
        }, this.option.transition * 1000);
    }
}

```

## 4.优化及其他

最后，代码需经过babel转译，并且以 umd 的形式支持浏览器直接引入，requirejs 及 commonjs 导入，详细做法可以参考我之前的一篇文章[《ES6 手写一个“辨色”小游戏》](https://juejin.im/user/5af17df4518825672a02e1f5/posts)。也可以参考我在 [github](https://github.com/zxpsuper/Demo) 上的代码, 欢迎 fork and star .