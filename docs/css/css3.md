# **CSS3 兼容性处理**
---
#### 当然，目前前端工程化，已经不需要人为的去写这些兼容不同浏览器的属性，一切可以交给打包工具，如 webpack + postcss。但是作为一名前端人员，了解一下这些还是很有必要的。
### **Transform**
```css
.css {
  transform:rotate(7deg);
  -ms-transform:rotate(7deg);   /* IE 9 */
  -moz-transform:rotate(7deg);  /* Firefox */
  -webkit-transform:rotate(7deg); /* Safari 和 Chrome */
  -o-transform:rotate(7deg);  /* Opera */
}
```

键值有：
```
    translate(x,y) translate3d(x,y,z) translateX(x)

    translateY(y)scale(x,y) scale3d(x,y,z) scaleX(x) 

    scaleY(y) scaleZ(z) rotate(angle)  rotate3d(x,y,z,angle)    rotateX(angle) …
```

### **Border-radius**
Border-radius:10px;

低版本的chrome:-webkit-border-radius:10px;

低版本的firefox:-moz-border-radius:10px;
```css
.css {
    border-top-left-radius:5px;      //左上角，注意顺序是先上下后左右
    border-top-right-radius:10px;    //左上角
    border-bottom-left-radius:15px;  //左下角
    border-bottom-left-radius:20px;  //右上角
}
```
### **transition**
```css
div{
  width:100px;
  transition: width 2s;
  -moz-transition: width 2s; /* Firefox 4 */
  -webkit-transition: width 2s; /* Safari 和 Chrome */
  -o-transition: width 2s; /* Opera */
}
```
有一个:hover伪类
`div:hover { height : 300px; }`
transition: 变化css属性   过渡时间   速度曲线   推迟时间
默认为：transition: all 0 ease 0

### **Animation**
```css
div{
  animation : mymove 5s infinite;
  -webkit-animation : mymove 5s infinite; /* Safari 和 Chrome */
}
```
Animation: 动画名  动画时间  速度曲线  推迟时间  播放次数 是否轮流反向
默认为： animation: none  0  ease  0  1  normal
定义动画——
```css
@keyframes myfirst{
  from {background: red;}
  to {background: yellow;}
}

@-moz-keyframes myfirst /* Firefox */
{
  from {background: red;}
  to {background: yellow;}
}

@-webkit-keyframes myfirst /* Safari 和 Chrome */
{
  from {background: red;}
  to {background: yellow;}
}

@-o-keyframes myfirst /* Opera */
{
  from {background: red;}
  to {background: yellow;}
}
```
多次改变——
```css
@keyframes myfirst {
  0%    {background: red;}
  25%   {background: yellow;}
  50%   {background: blue;}
  100%  {background: green;}
}
```
