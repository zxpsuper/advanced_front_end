# 设计模式
## 1. 单例模式
单例模式的核心就是：**保证一个类仅有一个实例，并提供一个访问它的全局访问点。**但在JavaScript中单例模式有别的区别于传统面向对象语言的应用，惰性单例模式在实际的开发中有很多用途，例如提高页面性能，避免不必要的DOM操作等。
```js
const singleton = function(name) {
  this.name = name
  this.instance = null
}

singleton.prototype.getName = function() {
  console.log(this.name)
}

singleton.getInstance = function(name) {
  if (!this.instance) { // 关键语句
    this.instance = new singleton(name)
  }
  return this.instance
}

// test
const a = singleton.getInstance('a') // 通过 getInstance 来获取实例
const b = singleton.getInstance('b')
console.log(a === b)
```
## 2. 代理模式
代理模式其实就是将违反单一性原则的类给抽离出来，尽量满足开放和封闭的原则。 相当于一个类的行为只是一种，但是你可以给这个类添加额外的行为。比如: 一个工厂制造伞，你可以给这个工厂设置一个代理，提供订单，运货，淘宝网店等多种行为。当然，里面还有最关键的一点就是，这个代理能把一些骗纸和忽悠都过滤掉，将最真实最直接的订单给工厂，让工厂能够放心的让工人加班，顺利的发年终奖.

**保护代理和虚拟代理**

保护代理就是起到保护作用，用来过滤掉一下不必要的请求，将真正需要的递给本体。

虚拟代理和函数节流的思想是一样的，将用户对性能的rape的伤害降低到最低。就像送快递一样，一件一件的送，这个公司是不是傻~ 所以为了生存，快递公司会当物品积攒到一定程度后才会让快递哥骑着小电驴穿梭在神州大地上。

```js
//譬如，验证用户名是否唯一
//这里我们应用，保护代理的思想，如果用户名是不合法的，则不会将该请求给本体执行
var checkUser = function(name){
    $.ajax({
        url:"xxxxx",
        type:"POST",
        contentType:"application/json",
        data:JSON.stringify({
            name:name  //用户名
        })
    })
}
var proxy = (function(){
    var user = document.querySelector("#username");
    return function(){
        var userName = user.value;
        var errMsg = detect(userName,["NotEmpty","isUserName"]); 
        if(errMsg){
            console.log(errMsg);
            return;
        }
        checkUser(userName);
    }
})();
// 虚拟代理，不拒绝请求，起到节流的效果
var send = function(article) {
    return $.ajax({
        url: xxx,
        type: "POST",
        contentType: "text/plain",
        data: article
    })
}
var proxy = (function() {
    var content = document.querySelector('#article'),
        timer;
    return function() {
        var article = content.value;
        if (timer) { //不覆盖已经发送的请求
            return;
        }
        timer = setTimeout(function() {
            send(article)
                .then(function() {  //执行完成再处理
                    clearTimeout(timer);
                    timer = null;
                })

        }, 2000);
    }
})();
setTimeout(function(){
    proxy();
},2000); //定时发送请求
```

**缓存代理**
将数据缓存在cache中，如果后面输入的内容一致，则从缓存里提取即可，提高性能
```js
function fb(num){  //斐波那契函数,超级耗内存
    if(num<=1){
        return 1;
    }
    return num*fb(--num)
}
//缓存代理出场了
var cProxy = (function(){
    var cache = {};
    return function(num){
        if(cache[num]){
          console.log(`this is cache ${cache[num]}`);
            return cache[num];
        }
        return cache[num] = fb(num);
    }
})();
//测试
console.log(cProxy(4));  //24
cProxy(4);  //"this is cache 24"
```
## 3. 中介者模式
中介者模式的作用就是解除对象与对象之间的紧耦合关系。

增加一个中介者对象后，所有的相关对象都通过中介者对象来通信，而不是互相引用，所以当一个对象发生改变时，只需要通知中介者对象即可。

承担两方面责任：中转作用，通过中介者和其他对象进行通信；协调作用，中介者可以进一步的对对象之间的关系进行封装

中介者对象不能订阅消息，只有活跃对象才可订阅中介者的消息，中介者是消息的发送者
```js
const player = function(name) {
  this.name = name
  playerMiddle.add(name)
}

player.prototype.win = function() {
  playerMiddle.win(this.name)
}

player.prototype.lose = function() {
  playerMiddle.lose(this.name)
}

const playerMiddle = (function() { // 将就用下这个 demo，这个函数当成中介者
  const players = []
  const winArr = []
  const loseArr = []
  return {
    add: function(name) {
      players.push(name)
    },
    win: function(name) {
      winArr.push(name)
      if (winArr.length + loseArr.length === players.length) {
        this.show()
      }
    },
    lose: function(name) {
      loseArr.push(name)
      if (winArr.length + loseArr.length === players.length) {
        this.show()
      }
    },
    show: function() {
      for (let winner of winArr) {
        console.log(winner + '挑战成功;')
      }
      for (let loser of loseArr) {
        console.log(loser + '挑战失败;')
      }
    },
  }
}())

const a = new player('A 选手')
const b = new player('B 选手')
const c = new player('C 选手')

a.win()
b.win()
c.lose()

// A 选手挑战成功;
// B 选手挑战成功;
// C 选手挑战失败;
```
## 4. 观察者模式
当观察的数据对象发生变化时，自动调用相应函数。

观察者模式指的是一个对象（Subject）维持一系列依赖于它的对象（Observer），当有关状态发生变更时 Subject 对象则通知一系列 Observer 对象进行更新。
在观察者模式中，Subject 对象拥有添加、删除和通知一系列 Observer 的方法等等，而 Observer 对象拥有更新方法等等。
在 Subject 对象添加了一系列 Observer 对象之后，Subject 对象则维持着这一系列 Observer 对象，当有关状态发生变更时 Subject 对象则会通知这一系列 Observer 对象进行更新。

```js
function Subject(){
  this.observers = [];
}

Subject.prototype = {
  add:function(observer){  // 添加
    this.observers.push(observer);
  },
  remove:function(observer){  // 删除
    var observers = this.observers;
    for(var i = 0;i < observers.length;i++){
      if(observers[i] === observer){
        observers.splice(i,1);
      }
    }
  },
  notify:function(){  // 通知
    var observers = this.observers;
    for(var i = 0;i < observers.length;i++){
      observers[i].update();
    }
  }
}

function Observer(name){
  this.name = name;
}

Observer.prototype = {
  update:function(){  // 更新
    console.log('my name is '+this.name);
  }
}

var sub = new Subject();

var obs1 = new Observer('ttsy1');
var obs2 = new Observer('ttsy2');

sub.add(obs1);
sub.add(obs2);
sub.notify();  //my name is ttsy1、my name is ttsy2

```

使用 Object.defineProperty(obj, props, descriptor) 或 Proxy 实现观察者模式

```js
// defineProperty
var obj = {
  value: 0
}

Object.defineProperty(obj, 'value', {
  set(newValue) {
    console.log('调用相应函数')
  }
})

obj.value = 1 // 调用相应函数

// Proxy

var obj = {
  value: 0
}

var proxy = new Proxy(obj, {
  set: function(target, key, value, receiver) { // {value: 0}  "value"  1  Proxy {value: 0}
    console.log('调用相应函数')
    Reflect.set(target, key, value, receiver)
  }
})

proxy.value = 1 // 调用相应函数
```
## 5. 发布订阅者模式

事件发布/订阅模式 (PubSub) 在异步编程中帮助我们完成更松的解耦，甚至在 MVC、MVVC 的架构中以及设计模式中也少不了发布-订阅模式的参与。

优点：在异步编程中实现更深的解耦

缺点：如果过多的使用发布订阅模式，会增加维护的难度
```js
// 举个栗子：小明，小龙去烧饼店买饼，向老板订阅说：“只要有红烧肉烧饼，老板你就打电话给我”
// 老板做出了红烧肉烧饼，发布通知了，小明小龙他们也就知道了。
/*烧饼店*/        
var bingShop={
    clienlist: {}, //缓存列表
    on: function (key, fn) { //增加订阅者
        if(!this.clienlist[key]){
            this.clienlist[key] = [];
        }
        this.clienlist[key].push(fn);
    },
    emit: function () { //发布消息
        var key = [].shift.call(arguments),//取出消息类型
            fns = this.clienlist[key];//取出该类型的对应的消息集合
        if(!fns || fns.length===0){
            return false;
        }
        for(var i=0, fn; fn = fns[i++];){
            fn.apply(this,arguments);
        }
    },
    remove: function (key, fn) {
        var fns=this.clienlist[key]; //取出该类型的对应的消息集合
        if (!fns) { //如果对应的key没有订阅直接返回
            return false;
        }
        if (!fn) {//如果没有传入具体的回掉，则表示需要取消所有订阅
            fns && (fns.length = 0);
        } else{
            for (var l = fns.length-1; l >= 0; l--){//遍历回掉函数列表
                if(fn === fns[l]){
                    fns.splice(l,1);//删除订阅者的回掉
                }
            }
        }
    }
}

/*小明发布订阅*/
bingShop.on('红烧肉', fn1 = function (price, taste) {
    console.log("小明, 你要的" + price+ "元，" + taste + "味道的烧饼已经到货啦");
});
/*小龙发布订阅*/
bingShop.on('叉烧肉', function (price, taste){
    console.log("小龙, 你要的" + price + "元，" + taste + "味道的烧饼已经到货啦");
});        

bingShop.emit("红烧肉", 10, "红烧肉");
bingShop.emit("叉烧肉", 12, "叉烧肉");
bingShop.remove('红烧肉'); // 移除订阅，则发布通知也不会有消息
bingShop.emit("红烧肉", 10, "红烧肉");
```
观察者模式和发布订阅模式本质上的思想是一样的，而发布订阅模式可以被看作是观察者模式的一个进阶版。

## 6. 策略模式
根据不同的参数（level）获得不同策略方法(规则)，这是策略模式在 JS 比较经典的运用之一。

能减少大量的 if 语句, 复用性好

```js
const strategy = {
  'S': function(salary) {
    return salary * 4
  },
  'A': function(salary) {
    return salary * 3
  },
  'B': function(salary) {
    return salary * 2
  }
}

const calculateBonus = function(level, salary) {
  return strategy[level](salary)
}

calculateBonus('A', 10000) // 30000
```

## 7. 职责链模式

职责链模式：类似多米诺骨牌，通过请求第一个条件，会持续执行后续的条件，直到返回结果为止。

重要性：4 星，在项目中能对 if-else 语句进行优化

### 场景 demo

场景：某电商针对已付过定金的用户有优惠政策，在正式购买后，已经支付过 500 元定金的用户会收到 100 元的优惠券，200 元定金的用户可以收到 50 元优惠券，没有支付过定金的用户只能正常购买。

```js
// orderType: 表示订单类型，1：500 元定金用户；2：200 元定金用户；3：普通购买用户
// pay：表示用户是否已经支付定金，true: 已支付；false：未支付
// stock: 表示当前用于普通购买的手机库存数量，已支付过定金的用户不受此限制

const order = function( orderType, pay, stock ) {
  if ( orderType === 1 ) {
    if ( pay === true ) {
      console.log('500 元定金预购，得到 100 元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('库存不够，无法购买')
      }
    }
  } else if ( orderType === 2 ) {
    if ( pay === true ) {
      console.log('200 元定金预购，得到 50 元优惠券')
    } else {
      if (stock > 0) {
        console.log('普通购买，无优惠券')
      } else {
        console.log('库存不够，无法购买')
      }
    }
  } else if ( orderType === 3 ) {
    if (stock > 0) {
        console.log('普通购买，无优惠券')
    } else {
      console.log('库存不够，无法购买')
    }
  }
}

order( 3, true, 500 ) // 普通购买，无优惠券
```

下面用职责链模式改造代码：

```js
const order500 = function(orderType, pay, stock) {
  if ( orderType === 1 && pay === true ) {
    console.log('500 元定金预购，得到 100 元优惠券')
  } else {
    order200(orderType, pay, stock)
  }
}

const order200 = function(orderType, pay, stock) {
  if ( orderType === 2 && pay === true ) {
    console.log('200 元定金预购，得到 50 元优惠券')
  } else {
    orderCommon(orderType, pay, stock)
  }
}

const orderCommon = function(orderType, pay, stock) {
  if (orderType === 3 && stock > 0) {
    console.log('普通购买，无优惠券')
  } else {
    console.log('库存不够，无法购买')
  }
}

order500( 3, true, 500 ) // 普通购买，无优惠券
```

改造后可以发现代码相对清晰了，但是链路代码和业务代码依然耦合在一起，进一步优化：

```js
// 业务代码
const order500 = function(orderType, pay, stock) {
  if ( orderType === 1 && pay === true ) {
    console.log('500 元定金预购，得到 100 元优惠券')
  } else {
    return 'nextSuccess'
  }
}

const order200 = function(orderType, pay, stock) {
  if ( orderType === 2 && pay === true ) {
    console.log('200 元定金预购，得到 50 元优惠券')
  } else {
    return 'nextSuccess'
  }
}

const orderCommon = function(orderType, pay, stock) {
  if (orderType === 3 && stock > 0) {
    console.log('普通购买，无优惠券')
  } else {
    console.log('库存不够，无法购买')
  }
}

// 链路代码
const chain = function(fn) {
  this.fn = fn
  this.sucessor = null
}

chain.prototype.setNext = function(sucessor) {
  this.sucessor = sucessor
}

chain.prototype.init = function() {
  const result = this.fn.apply(this, arguments)
  if (result === 'nextSuccess') {
    this.sucessor.init.apply(this.sucessor, arguments)
  }
}

const order500New = new chain(order500)
const order200New = new chain(order200)
const orderCommonNew = new chain(orderCommon)

order500New.setNext(order200New)
order200New.setNext(orderCommonNew)

order500New.init( 3, true, 500 ) // 普通购买，无优惠券
```

重构后，链路代码和业务代码彻底地分离。假如未来需要新增 order300，那只需新增与其相关的函数而不必改动原有业务代码。

另外结合 AOP 还能简化上述链路代码：

```js
// 业务代码
const order500 = function(orderType, pay, stock) {
  if ( orderType === 1 && pay === true ) {
    console.log('500 元定金预购，得到 100 元优惠券')
  } else {
    return 'nextSuccess'
  }
}

const order200 = function(orderType, pay, stock) {
  if ( orderType === 2 && pay === true ) {
    console.log('200 元定金预购，得到 50 元优惠券')
  } else {
    return 'nextSuccess'
  }
}

const orderCommon = function(orderType, pay, stock) {
  if (orderType === 3 && stock > 0) {
    console.log('普通购买，无优惠券')
  } else {
    console.log('库存不够，无法购买')
  }
}

// 链路代码
Function.prototype.after = function(fn) {
  const self = this
  return function() {
    const result = self.apply(self, arguments)
    if (result === 'nextSuccess') {
      return fn.apply(self, arguments) // 这里 return 别忘记了~
    }
  }
}

const order = order500.after(order200).after(orderCommon)

order( 3, true, 500 ) // 普通购买，无优惠券
```

职责链模式比较重要，项目中能用到它的地方会有很多，用上它能解耦 1 个请求对象和 n 个目标对象的关系。

## 8. 装饰者模式

装饰器模式：动态地给函数赋能。

### JavaScript 的装饰者模式

生活中的例子：天气冷了，就添加衣服来保暖；天气热了，就将外套脱下；这个例子很形象地含盖了装饰器的神韵，随着天气的冷暖变化，衣服可以动态的穿上脱下。

```js
let wear = function() {
  console.log('穿上第一件衣服')
}

const _wear1 = wear

wear = function() {
  _wear1()
  console.log('穿上第二件衣服')
}

const _wear2 = wear

wear = function() {
  _wear2()
  console.log('穿上第三件衣服')
}

wear()

// 穿上第一件衣服
// 穿上第二件衣服
// 穿上第三件衣服
```

这种方式有以下缺点：1：临时变量会变得越来越多；2：this 指向有时会出错

### AOP 装饰函数

```js
// 前置代码
Function.prototype.before = function(fn) {
  const self = this
  return function() {
    fn.apply(new(self), arguments) 
    return self.apply(new(self), arguments)
  }
}

// 后置代码
Function.prototype.after = function(fn) {
  const self = this
  return function() {
    self.apply(new(self), arguments)
    return fn.apply(new(self), arguments)
  }
}
```

用后置代码来实验下上面穿衣服的 demo，

```js
const wear1 = function() {
  console.log('穿上第一件衣服')
}

const wear2 = function() {
  console.log('穿上第二件衣服')
}

const wear3 = function() {
  console.log('穿上第三件衣服')
}

const wear = wear1.after(wear2).after(wear3)
wear()

// 穿上第一件衣服
// 穿上第二件衣服
// 穿上第三件衣服
```

但这样子有时会污染原生函数，可以做点通变

```js
const after = function(fn, afterFn) {
  return function() {
    fn.apply(this, arguments)
    afterFn.apply(this, arguments)
  }
}

const wear = after(after(wear1, wear2), wear3)
wear()
```