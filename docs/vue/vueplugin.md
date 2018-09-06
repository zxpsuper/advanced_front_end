
# Vue 编写一个长按指令插件
## 1. 如何编写 Vue 插件

在以往的 Vue 项目开发过程中，我们使用插件的方法是`Vue.use(plugin)`。如： 
```js
import filters from "./filter/filters";
Vue.use(filters);
```
plugin 为 Object 对象，需内置一个install()方法方可使用。该方法第一个参数为Vue对象，其余参数由使用者传入决定。
```js
plugin.install = function(Vue, options) {}
```
## 2. 编写 Vue 长按指令

1. 根据官方文档：
```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化
  bind: function (el, binding, vnode, oldVnode) {
  },
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  },
  // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
  update: function (el, binding, vnode, oldVnode) {
  },
  // 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
  componentUpdated: function (el, binding, vnode, oldVnode) {
  },
  // 只调用一次，指令与元素解绑时调用。
  unbind: function (el, binding, vnode, oldVnode) {
  },
})
```
此次长按指令我们只用到了bind()函数

2. 分析长按功能实现

监听 mousedown 和 mouseout (移动端为 touchstart 和 touchend)，间隔时间大于某个时间则视为长按事件触发。

因此需设置一个变量存放定时器`let pressTimer = null;`

一个开始和取消定时器方法——
```js
// 创建计时器（ 1秒后执行函数 ）
let start = (e) => {
  if (e.type === 'click' && e.button !== 0) {
    return;
  }
  if (pressTimer === null) {
    pressTimer = setTimeout(() => {
      // 执行函数
      handler();
    }, 1000)
  }
}
// 取消计时器
let cancel = (e) => {
  // 检查计时器是否有值
  if ( pressTimer !== null ) {
    clearTimeout(pressTimer);
    pressTimer = null;
  }
}         
// 运行函数
const handler = (e) => {
  // 执行传递给指令的方法
  binding.value(e)
};  
```

给各种事件设置监听——
```js
// 添加事件监听器
el.addEventListener("mousedown", start);
el.addEventListener("touchstart", start);
// 取消计时器
el.addEventListener("click", cancel);
el.addEventListener("mouseout", cancel);
el.addEventListener("touchend", cancel);
el.addEventListener("touchcancel", cancel);
```

功能优化，当指令传入的值不为函数时提醒用户——
```js
// 确保提供的表达式是函数        
if (typeof binding.value !== 'function') {            
  // 获取组件名称            
  const compName = vNode.context.name;            
  // 将警告传递给控制台            
  let warn = `[longpress:] provided expression '${binding.expression}' is not afunction, but has to be `;
  if (compName) { warn += `Found in component '${compName}' `}
  console.warn(warn);
}  
```
## 3. 使长按时间可定制化

```js
// longpress.js
export default {
  install(Vue, options = {
    time: 2000
  }) {
    // ...
  }
}
```
且定时器中的时间改为`options.time`，然后`Vue.use(plugin, {time: 5000})`即可。

## 4. 完整代码
```js
// longpress.js
export default {
  install(Vue, options = {
    time: 2000
  }) {
    Vue.directive('longpress', {    
      bind: function(el, binding, vNode) {         
        // 确保提供的表达式是函数        
        if (typeof binding.value !== 'function') {            
          // 获取组件名称            
          const compName = vNode.context.name;            
          // 将警告传递给控制台            
          let warn = `[longpress:] provided expression '${binding.expression}' is not afunction, but has to be `;
          if (compName) { warn += `Found in component '${compName}' `}
          console.warn(warn);
        }      
        // 定义变量
        let pressTimer = null;
        // 定义函数处理程序
        // 创建计时器（ 1秒后执行函数 ）
        let start = (e) => {
          if (e.type === 'click' && e.button !== 0) {
            return;
          }
          if (pressTimer === null) {
            pressTimer = setTimeout(() => {
              // 执行函数
              handler();
            }, options.time)
          }
        }
        // 取消计时器
        let cancel = (e) => {
          // 检查计时器是否有值
          if ( pressTimer !== null ) {
            clearTimeout(pressTimer);
            pressTimer = null;
          }
        }         
        // 运行函数
        const handler = (e) => {
          // 执行传递给指令的方法
          binding.value(e)
        };  
        // 添加事件监听器
        el.addEventListener("mousedown", start);
        el.addEventListener("touchstart", start);
        // 取消计时器
        el.addEventListener("click", cancel);
        el.addEventListener("mouseout", cancel);
        el.addEventListener("touchend", cancel);
        el.addEventListener("touchcancel", cancel);
      }
    })
  }
}
```
main.js
```js
// main.js
import LongPress from 'longpress.js'
Vue.use(LongPress, {time: 2500})
```

component.vue
```js
// template
<div v-longpress="test"></div>
// methods
methods: {
  test(event) {
    console.log(111)
  }
}
```

希望本文对你有帮助！！
