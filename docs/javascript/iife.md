# UMD规范的IIFE模板

UMD规范同时兼容了浏览器、Node环境及AMD规范，这样我们的代码使用UMD包装后就可以在不同的环境中运行了。
```javascript
// if the module has no dependencies, the above pattern can be simplified to
(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    // AMD. Register as an anonymous module.
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    // Browser globals (root is window)
    root.returnExports = factory();
  }
})(typeof self !== "undefined" ? self : this, function() {
  // Just return a value to define the module export.
  // This example returns an object, but the module
  // can return a function as the exported value.
  return {};
});
```
### 開發插件
开发插件最重要的一点，就是插件的兼容性，一个插件至少要能同时在几种不同的环境中运行。其次，它还需要满足以下几种功能及条件：

1. 插件自身的作用域与用户当前的作用域相互独立，也就是插件内部的私有变量不能影响使用者的环境变量；
2. 插件需具备默认设置参数；
3. 插件除了具备已实现的基本功能外，需提供部分API，使用者可以通过该API修改插件功能的默认参数，从而实现用户自定义插件效果；
4. 插件支持链式调用；
5. 插件需提供监听入口，及针对指定元素进行监听，使得该元素与插件响应达到插件效果。
。
