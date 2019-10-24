# Vue 中的 computed 与 watch 对比
官方文档在 **计算属性缓存 vs 方法** 中提出了： **计算属性是基于它们的依赖进行缓存的。**

> 计算属性只有在它的相关依赖发生改变时才会重新求值。这就意味着只要 message 还没有发生改变，多次访问 reversedMessage 计算属性会立即返回之前的计算结果，而不必再次执行函数。

然后在网上就看到有人解释：computed 与 watch 区别是——计算属性是基于它们的依赖进行缓存的。

仔细想来，胡扯。！！

computed 与 methods 的区别确实是——计算属性是基于它们的依赖进行缓存的。
```js
<template>
  <p>{{getMessage()}}</p>
  <p>{{message}}</p>
</template>
export default {
  data() {
    return {
      messageA: 'hello',
      messageB: 'suporka'
    }
  }
  computed() {
    message() {
      return this.messageA + '' + this.messageB
    }
  },
  methods: {
    getMessage() {
      return this.messageA + '' + this.messageB
    }
  }
}
```

当页面发生多次渲染时，getMessage() 都会执行 methods 里的 getMessage()。而 message 依赖缓存，获取缓存的值而不会执行 `return this.messageA + '' + this.messageB` 计算语句。

## 1. computed 书写相对简洁
```js
var vm = new Vue({
  el: '#demo',
  data: {
    messageA: 'Foo',
    messageB: 'Bar',
    message: 'Foo Bar'
  },
  watch: {
    messageA: function (val) {
      this.message = val + ' ' + this.messageB
    },
    messageB: function (val) {
      this.message = this.messageA + ' ' + val
    }
  }
})
```
```js
var vm = new Vue({
  el: '#demo',
  data: {
    messageA: 'Foo',
    messageB: 'Bar'
  },
  computed: {
    message: function () {
      return this.messageA + ' ' + this.messageB
    }
  }
})
```
以上是官方文档给出的解释，确实书写简洁。`当需要在数据变化时执行异步或开销较大的操作时, 应当使用侦听器 watch`, 对这句话保留疑问。

我尝试着如下操作，并在页面加载后一段时间更改 messageA 的值，发现该计算属性中的其他操作也照样执行
```js
message: function () {
  console.log('hello computed')
  setTimeout(() => {
    console.log('hello suporka')
  }, 2000)
  return this.messageA + ' ' + this.messageB
}
```
因此，计算属性其实同样也可以`在数据变化时执行异步或开销较大的操作`。

## 2. watch 可以获取 newVal 和 oldVal
watch 可以获取 newVal 和 oldVal, 而 computed 获取不到
```js
export default {
  watch: {
    messageA: function (newVal, oldVal) {
      console.log(newVal, oldVal)
      this.message = val + ' ' + this.messageB
    },
  },
}
```

## 3. computed 属性在组件创建时即执行一次

computed 属性基于 template 模板而执行，因此在组件创建时，该计算属性也需执行一次并返回数据给 template.

watch 在组件创建时并不会执行函数，只有在监听到数据变化时才执行

