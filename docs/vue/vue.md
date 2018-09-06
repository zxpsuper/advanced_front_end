# Vue 双向数据绑定原理

#### DocumentFragment
创建一个新的空白的文档片段。DocumentFragments 是 DOM 节点。它们不是主 DOM 树的一部分。通常的用例是创建文档片段，将元素附加到文档片段，然后将文档片段附加到 DOM 树。在 DOM 树中，文档片段被其所有的子元素所代替。因为文档片段存在于内存中，并不在 DOM 树中，所以将子元素插入到文档片段时不会引起页面回流 (reflow) (对元素位置和几何上的计算)。因此，使用文档片段 document fragments 通常会起到优化性能的作用。

```html
<body>
    <ul data-uid="ul"></ul>
</body>

<script>
    let ul = document.querySelector(`[data-uid="ul"]`),
        docfrag = document.createDocumentFragment();
    
    const browserList = [
        "Internet Explorer", 
        "Mozilla Firefox", 
        "Safari", 
        "Chrome", 
        "Opera"
    ];
    
    browserList.forEach((e) => {
        let li = document.createElement("li");
        li.textContent = e;
        docfrag.appendChild(li);
    });
    
    ul.appendChild(docfrag);
</script>

```

#### defineProperty
对象的属性分为：数据属性和访问器属性。如果要修改对象的默认特性，必须使用Object.defineProperty方法，它接收三个参数：属性所在的对象、属性的名字、一个描述符对象。

```js
var book = {
  _year: 2018,
  edition: 1
};
Object.defineProperty(book, "year", {
  get: function(){
    return this._year;
  },
  set: function(newVal){
    if(newVal > 2008){
      this._year = newVal;
      this.edition += newVal - 2008;
    }
  }
});

book.year = 2019;

console.log(book._year);//2019
console.log(book.edition);//12
```

#### proxy
ES6新方法，它可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```js
<body>
  <input type="text" id="input">
  <p id="p"></p>
</body>
<script>
  const input = document.getElementById('input');
  const p = document.getElementById('p');
  const obj = {};
  
  const newObj = new Proxy(obj, {
    get: function(target, key, receiver) {
      console.log(`getting ${key}!`);
      return Reflect.get(target, key, receiver);
    },
    set: function(target, key, value, receiver) {
      console.log(target, key, value, receiver);
      if (key === 'text') {
        input.value = value;
        p.innerHTML = value;
      }
      return Reflect.set(target, key, value, receiver);
    },
  });
  
  input.addEventListener('keyup', function(e) {
    newObj.text = e.target.value;
  });
</script>
```