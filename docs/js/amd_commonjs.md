### Javascript 模块化

#### **1. CommonJS**
CommonJS 最开始是 Mozilla 的工程师于 2009 年开始的一个项目，它的目的是让浏览器之外的 JavaScript （比如服务器端或者桌面端）能够通过模块化的方式来开发和协作。

在 CommonJS 的规范中，每个 JavaScript 文件就是一个独立的模块上下文（module context），在这个上下文中默认创建的属性都是私有的。也就是说，在一个文件定义的变量（还包括函数和类），都是私有的，对其他文件是不可见的。

如果想在多个文件分享变量，第一种方法是声明为 global 对象的属性。但是这样做是不推荐的，因为大家都给 global 加属性，还是可能冲突。

推荐的做法是，通过 module.exports 对象来暴露对外的接口。

Node 就采用了 CommonJS 规范来实现模块依赖。

我们可以这样创建一个最简单的模块：

```js
function myModule() {
  this.hello = function() {
    return 'hello!';
  }

  this.goodbye = function() {
    return 'goodbye!';
  }
}

module.exports = myModule;
```
我们可以注意到，在定义了自己的 function 之后，通过 module.exports 来暴露了出去。为什么我们可以在没有定义 module 的情况下就使用它？因为 module 是 CommonJS 规范中预先已经定义好的对象，就像 global 一样。

如果其他代码想使用我们的 myModule 模块，只需要 require 它就可以了。

```js
var myModule = require('myModule');

var myModuleInstance = new myModule();
myModuleInstance.hello(); // 'hello!'
myModuleInstance.goodbye(); // 'goodbye!'
```
需要注意的是，CommonJS 规范的主要适用场景是服务器端编程，所以采用**同步**加载模块的策略。如果我们依赖3个模块，代码会一个一个依次加载它们。

#### **2. AMD**
介绍了同步方案，我们当然也有异步方案。在浏览器端，我们更常用 AMD 来实现模块化开发。AMD 是 Asynchronous Module Definition 的简称，即“异步模块定义”。

我们看一下 AMD 模块的使用方式：
```js
define(['myModule', 'myOtherModule'], function(myModule, myOtherModule) {
  console.log(myModule.hello());
});
```
在这里，我们使用了 define 函数，并且传入了两个参数。

第一个参数是一个数组，数组中有两个字符串也就是需要依赖的模块名称或路径。**AMD 会以一种非阻塞的方式，通过 appendChild 将这两个模块插入到 DOM 中。在两个模块都加载成功之后，define 会调用第二个参数中的回调函数，一般是函数主体。**

第二个参数也就是回调函数，函数接受了两个参数，正好跟前一个数组里面的两个模块名一一对应。因为这里只是一种参数注入，所以我们使用自己喜欢的名称也是完全没问题的。

同时，define 既是一种引用模块的方式，也是定义模块的方式。

例如，myModule 的代码可能看上去是这样：

```js
define([], function() {
  return {
    hello: function() {
      console.log('hello');
    },
    goodbye: function() {
      console.log('goodbye');
    }
  };
});
```
#### **3. UMD**
对于需要同时支持 AMD 和 CommonJS 的模块而言，可以使用 UMD（Universal Module Definition）。
```js
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
      // AMD
    define(['myModule', 'myOtherModule'], factory);
  } else if (typeof exports === 'object') {
      // CommonJS
    module.exports = factory(require('myModule'), require('myOtherModule'));
  } else {
    // Browser globals (Note: root is window)
    root.returnExports = factory(root.myModule, root.myOtherModule);
  }
}(this, function (myModule, myOtherModule) {
  // Methods
  function notHelloOrGoodbye(){}; // A private method
  function hello(){}; // A public method because it's returned (see below)
  function goodbye(){}; // A public method because it's returned (see below)

  // Exposed public methods
  return {
      hello: hello,
      goodbye: goodbye
  }
}));
```
在执行UMD规范时，会优先判断是当前环境是否支持AMD环境，然后再检验是否支持CommonJS环境，否则认为当前环境为浏览器环境（window）。

如果你写了一个小工具库，你想让它及支持AMD规范，又想让他支持CommonJS规范，那么采用UMD规范对你的代码进行包装吧。

#### **4. ES6 模块**
可能你已经注意到了，上面所有这些模型定义，没有一种是 JavaScript 语言原生支持的。无论是 AMD 还是 CommonJS，这些都是 JavaScript 函数来模拟的。

幸运的是，ES6 开始引入了原生的模块功能。

ES6 的原生模块功能非常棒，它兼顾了规范、语法简约性和异步加载功能。它还支持循环依赖。

最棒的是，import 进来的模块对于调用它的模块来是说是一个活的只读视图，而不是像 CommonJS 一样是一个内存的拷贝。

下面是一个 ES6 模块的示例：
```js
// lib/counter.js
export let counter = 1;

export function increment() {
  counter++;
}

export function decrement() {
  counter--;
}


// src/main.js
import * as counter from '../../counter';

console.log(counter.counter); // 1
counter.increment();
console.log(counter.counter); // 2
```

如果只希望导出某个模块的部分属性，或者希望处理命名冲突的问题，可以有这样一些导入方式：

```js
import {detectCats} from "kittydar.js";
//or
import {detectCats, Kittydar} from "kittydar.js";
//or
import {flip as flipOmelet} from "eggs.js";
import {flip as flipHouse} from "real-estate.js";
```