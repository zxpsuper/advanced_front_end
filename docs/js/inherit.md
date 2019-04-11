# 继承的几种实现方式

**继承优先寻找本身，没有找到的话再从原型链 (__proto__属性) 一层层往上找**

## 类式继承

```js
// 声明父类
function SupperClass(value) {
  this.value = value;
  this.fn = function() {
    console.log(this.value);
  };
}
SupperClass.prototype.otherValue = "other value";

// 子类
function SubClass(value) {
  this.subValue = value;
}
SubClass.prototype = new SupperClass("I'm supper value");
//声明子类，并使得子类继承自SupperClass
```

### 缺点:

1. 子类继承自父类的实例，而实例化父类的过程在声明阶段，因此在实际使用过程中无法根据实际情况向父类穿参

2. 子类的家庭关系不完善。Instance.constructor = SupperClass，因为 SubClass 并没有 constructor 属性，所以最终会从 SupperClass.prototype 处继承得到该属性。

3. 不能为 SubClass.prototype 设置 constructor 属性，该属性会造成属性屏蔽，导致 SubClass.prototype 不能正确获取自己的 constructor 属性

## 构造函数继承

```js
function SupperClass(value1) {
  this.xx = value1;
}
function SubClass(value1, value2) {
  SupperClass.call(this, value1);
  this.xx = value2;
}

//实际使用
var Instance = new SubClass("value1", "value2");
```

- 优点: 可以传参

- 缺点: 构造函数继承方式的本质就是将父类的构造方法在子类的上下文环境运行一次，从而达到复制父类属性的目的，在这个过程中并没有构造出一条完整的原型链。

## 组合式继承

```js
function SupperClass(value) {
  this.value = value;
  this.fn = function() {
    console.log(this.value);
  };
}
SupperClass.prototype.otherValue = "other value";
//声明父类

function SubClass(value1, value2) {
  SupperClass.call(this, value1);
  this.subValue = value2;
}
SubClass.prototype = new SupperClass("I'm supper value");
//声明子类，并使得子类继承自SupperClass
//以上为声明阶段

//通过以下方式使用
var Instance = new SubClass("I'm supper value", "I'm sub value");
```

- 优点: 组合式继承集合了以上两种继承方式的优点，从而实现了“完美”继承所有属性并能动态传参的功能

- 缺点: 但是这种方式仍然不能补齐子类的家庭成员关系，因为 SubClass.prototype 仍然是父类的实例。

## 原型式继承
原型式继承又被成为纯洁继承，它的重点只关注对象与对象之间的继承关系，淡化了类与构造函数的概念，这样能避免开发者花费过多的精力去维护类与类/类与原型之间的关系，从而将重心转移到开发业务逻辑上面来。

```js
var supperObj = {
    key1: 'value',
    func: function(){
        console.log(this.key1);
    }
}

function Factory(obj){
    function F(){}
    F.prototype = obj;
    return new F()
}

//实际使用方法
//var Instance = new Factory(supperObj);
var Instance = Factory(supperObj);

```
- 缺点：
1. 无法根据使用的实际情况动态生成supperObj（无法动态传参）。
2. 虽然实现了对象的继承，但是生成的子类还没有添加自己的属性与方法。

- 优点:
1. 由于其纯洁性，开发者不必再去维护constructor与prototype属性，仅仅只需要关注原型链。
2. 更少的内存开销。

## 寄生式继承
ES5提供了Object.create()，并且在原型式继承，以及多继承中起着重要的作用。在寄生式继承中我们会对原型继承做一次优化。

`var subObj = Object.create(obj);` = `subObj.prototype = obj`
```js
var supperObj = {
    key1: 'value',
    func: function(){
        console.log(this.key1);
    }
}
function inheritPrototype(obj,value){
    //var subObj = Factory(obj);
    var subObj = Object.create(obj);
    subObj.name = value;
    subObj.say = function(){
        console.log(this.name);
    }
    return subObj;
}

var Instance = inheritPrototype(supperObj,'sub');
Instance.func();
Instance.say();

```
寄生式继承实际上就是对原型式继承的二次封装，在这次封装过程中实现了根据提供的参数添加子类的自定义属性。但是缺点仍然存在，**被继承对象无法动态生成**。