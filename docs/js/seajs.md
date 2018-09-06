# sea.js

最近项目中抛弃传统的`<script>`而改用 SeaJS 这样的 JS 模块加载器了，确实模块加载器对于代码的可维护性带来了较大的提升。

## 1. 前沿  
SeaJS 是一个模块加载器，模块加载器需要实现两个基本功能：

* 实现模块定义规范，这是模块系统的基础。
* 模块系统的启动与运行。

## 2. CMD 规范
在 CMD 规范中，一个模块就是一个文件。代码的书写格式如下：

```js
define(factory)
// id：模块标识。
// deps：一个数组，表示模块依赖。
define(id?, deps?, factory)
```

- factory 为对象、字符串时，表示模块的接口就是该对象、字符串。
- factory 为函数时，表示是模块的构造方法。执行该构造方法，可以得到模块向外提供的接口。factory默认会传入三个参数：require、exports 和 module。
```js
// factory 为对象
define({ "foo": "bar" });
// factory 为函数
define(function(require, exports, module) {
    // 模块代码
});
```
在用普通压缩工具压缩时，如果项目需要支持 IE，务必写上第一个参数id或通过工具提取 id；而且如果项目对性能有要求，上线后需要合并文件，也确保手工写上 id 参数。

## 3. factory 参数
```js
// 所有模块都通过 define 来定义
define(function(require, exports, module) {
  // 通过 require 引入依赖，获取模块 a 的接口
  var a = require('./a');
  // 调用模块 a 的方法
  a.doSomething();
  // 通过 exports 对外提供接口foo 属性
  exports.foo = 'bar';
  // 对外提供 doSomething 方法
  exports.doSomething = function() {};
  // 错误用法！！!
  exports = {
    foo: 'bar',
    doSomething: function() {}
  };
  // 正确写法，通过module.exports提供整个接口
  module.exports = {
    foo: 'bar',
    doSomething: function() {}
  };
});
```
**(1) require：Function**
* require是一个函数方法，用来获取其他模块提供的接口，而且是同步往下执行。require的模块不能被返回时，应该返回null。

* require.async(id, callback?)：用来在模块内部异步加载模块，并在加载完成后执行指定回调。require的模块不能被返回时，callback应该返回null。callback接受返回的模块作为它的参数。

* require.resolve(id)：不会加载模块，只返回解析后的绝对路径。

注意事项：

- factory第一个参数必须命名为 require 。
- 例外：在保证 id 和 dependencies 的预先提取下，可以调用任何普通 JS 压缩工具来进行压缩，require 参数可以被压缩成任意字符，或者在工具中定义不要压缩 require 参数；建议采用配套的构建工具spm来压缩、合并代码。
不要重命名 require 函数，或在任何作用域中给 require 重新赋值。
- require 的参数值必须是字符串直接量。

为什么那么死规定？！

首先你要知道SeaJS 是如何知道一个模块的具体依赖的。SeaJS 通过 factory.toString() 拿到源码，再通过正则匹配 require 的方式来得到依赖信息。这也是必须遵守 require 书写约定的原因。

有时会希望可以使用 require 来进行条件加载，如下：

```js
if (todayIsWeekend) {
  require("play");
} else {
  require("work");
}
```
在浏览器端中，加载器会把这两个模块文件都下载下来。 这种情况下，推荐使用 require.async 来进行条件加载。

**(2) exports：Object**

用来在模块内部对外提供接口。

exports 仅仅是 module.exports 的一个引用。在 factory 内部给 exports 重新赋值时，并不会改变 module.exports 的值。因此给 exports 赋值是无效的，不能用来更改模块接口。

**(3) module：Object**

module.uri：解析后的绝对路径

module.dependencies：模块依赖

module.exports：暴露模块接口数据，也可以通过 return 直接提供接口，因个人习惯使用。

对 module.exports 的赋值需要同步执行，慎重放在回调函数里，因为无法立刻得到模块接口数据。

## 4. 模块系统的启动与运行
通过define定义许多模块后，得让它们能跑起来，如下：
```html
<script type="text/javascript" src="../gb/sea.js"></script>
<script>
  seajs.use('./index.js');
</script>
```
直接使用 script 标签同步引入sea.js文件后，就可以使用seajs.use(id, callback?)在页面中加载模块了！

最佳实践：

seajs.use 理论上只用于加载启动，不应该出现在 define 中的模块代码里。

为了让 sea.js 内部能快速获取到自身路径，推荐手动加上 id 属性：

```html
<script src="../gb/sea.js" id="seajsnode"></script>
```

## 5. 与RequireJS的主要区别

1. RequireJS 遵循 AMD（异步模块定义）规范，SeaJS 遵循 CMD （通用模块定义）规范。

2. SeaJS按需执行依赖避免浪费，但是require时才解析的行为对性能有影响。

SeaJS是异步加载模块的没错, 但执行模块的顺序也是严格按照模块在代码中出现(require)的顺序。

RequireJS更遵从js异步编程方式，提前执行依赖，输出顺序取决于哪个 js 先加载完（不过 RequireJS 从 2.0 开始，也改成可以延迟执行）。如果一定要让 模块B 在 模块A 之后执行，需要在 define 模块时申明依赖，或者通过 require.config 配置依赖。

如果两个模块之间突然模块A依赖模块B：SeaJS的懒执行可能有问题，而RequireJS不需要修改当前模块。

当模块A依赖模块B，模块B出错了：如果是SeaJS，模块A执行了某操作，可能需要回滚。RequireJS因为尽早执行依赖可以尽早发现错误，不需要回滚。

3. SeaJS努力成为浏览器端的模块加载器，RequireJS牵三挂四，兼顾Rhino 和 node，因此RequireJS比SeaJS的文件大。

4. RequireJS 有一系列插件，功能很强大，但破坏了模块加载器的纯粹性。SeaJS 则努力保持简单，并支持 CSS 模块的加载。