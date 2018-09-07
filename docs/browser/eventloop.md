# 浏览器 Event Loop 机制
## 1. Event Loop是什么
event loop是一个执行模型，在不同的地方有不同的实现。浏览器和NodeJS基于不同的技术实现了各自的Event Loop。

## 2. 宏队列和微队列
**宏队列，macrotask，也叫tasks。** 一些异步任务的回调会依次进入macro task queue，等待后续被调用，这些异步任务包括：
* setTimeout
* setInterval
* setImmediate (Node独有)
* requestAnimationFrame (浏览器独有)
* I/O
* UI rendering (浏览器独有)

**微队列，microtask，也叫jobs。** 另一些异步任务的回调会依次进入micro task queue，等待后续被调用，这些异步任务包括：

* process.nextTick (Node独有)
* Promise
* Object.observe
* MutationObserver

## 3. 实例介绍

执行顺序，先微队列，后宏队列。

看下面一个例子：
```js
console.log(1);
setTimeout(() => {
  console.log(2);
  setTimeout(() => {
    console.log(8);
  })
  Promise.resolve().then(() => {
    console.log(3)
  });
});
new Promise((resolve, reject) => {
  console.log(4)
  setTimeout(() => {
    console.log(10);
  })
  resolve()
}).then(() => {
  console.log(5);
  Promise.resolve().then(() => {
    console.log(11)
  });
  setTimeout(() => {
    console.log(13);
  })
})
setTimeout(() => {
  Promise.resolve().then(() => {
    console.log(9)
  });
  console.log(6);
  setTimeout(() => {
    console.log(12);
  })
})
console.log(7);
```
从头至尾执行一次代码,根据上面分类规则分至不同队列, new promise( function )也是立即执行。setTimeout 的回调函数属于宏队列（macrotask），resolve 的回调函数属于微队列

```js
// 栈区（stack）
console.log(1);
console.log(4);
console.log(7);
```
```js
// 宏队列
() => {
  console.log(2);
  setTimeout(() => {
    console.log(8);
  })
  Promise.resolve().then(() => {
    console.log(3)
  });
}
() => {
  console.log(10);
}
() => {
  Promise.resolve().then(() => {
    console.log(9)
  });
  console.log(6);
  setTimeout(() => {
    console.log(12);
  })
}
```
```js
// 微队列
() => {
  console.log(5);
  Promise.resolve().then(() => {
    console.log(11)
  });
  setTimeout(() => {
    console.log(13);
  })
}
```
优先执行微队列，微队列执行过程中产生的微队列和宏队列置于队列末尾排序执行，而宏队列产生的微队列和宏队列于新的队列中等待。。

执行微队列：（分类）
```js
// 栈区（stack）
console.log(1);
console.log(4);
console.log(7);
//////////
console.log(5);
```
```js
// 微队列
() => {
  console.log(11)
});
```
```js
// 宏队列
() => {
  console.log(2);
  setTimeout(() => {
    console.log(8);
  })
  Promise.resolve().then(() => {
    console.log(3)
  });
}
() => {
  console.log(10);
}
() => {
  Promise.resolve().then(() => {
    console.log(9)
  });
  console.log(6);
  setTimeout(() => {
    console.log(12);
  })
}
() => {
    console.log(13);
}
```
此时新增了一个微队列`console.log(11)`,因为是微队列产生的，继续执行： 
```js
// 栈区（stack）
console.log(1);
console.log(4);
console.log(7);
//////////
console.log(5);
/////////
console.log(11)
```
```js
// 微队列-空
```
```js
// 宏队列
() => {
  console.log(2);
  setTimeout(() => {
    console.log(8);
  })
  Promise.resolve().then(() => {
    console.log(3)
  });
}
() => {
  console.log(10);
}
() => {
  Promise.resolve().then(() => {
    console.log(9)
  });
  console.log(6);
  setTimeout(() => {
    console.log(12);
  })
}
() => {
    console.log(13);
}
```
执行完微队列后执行宏队列：
```js
// 栈区（stack）
console.log(1);
console.log(4);
console.log(7);
//////////
console.log(5);
/////////
console.log(11);
/////////
console.log(2);
console.log(10);
console.log(6);
console.log(13);
```
```js
// 微队列
() => {
  console.log(3)
}
() => {
  console.log(9)
}
```
```js
// 宏队列
() => {
  console.log(8);
}
() => {
  console.log(12);
}
```
接下来执行微队列后宏队列，即：

```js
// 栈区（stack）
console.log(1);
console.log(4);
console.log(7);
//////////
console.log(5);
/////////
console.log(11);
/////////
console.log(2);
console.log(10);
console.log(6);
console.log(13);
////////
console.log(3)
console.log(9)
////////
console.log(8);
console.log(12);
```