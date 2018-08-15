---
title: CSS 几个小技巧
---
### CSS 几个小技巧
1. 设置placeholder样式的方法

```css
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #b1b1b1; opacity:1; 
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #b1b1b1;opacity:1;
}

input:-ms-input-placeholder{
    color: #b1b1b1;opacity:1;
}

input::-webkit-input-placeholder{
    color: #b1b1b1;opacity:1;
}
```

2. 去掉 input 默认样式
```css
input {
    outline: none;
    border: none;
    background-image: none;
    cursor: text;
}
```
3. 设置placeholder样式的方法

```css
:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #b1b1b1; opacity:1; 
}

::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #b1b1b1;opacity:1;
}

input:-ms-input-placeholder{
    color: #b1b1b1;opacity:1;
}

input::-webkit-input-placeholder{
    color: #b1b1b1;opacity:1;
}
```
4. 修改 select 默认样式
```css
select {
    appearance:none;
    -moz-appearance:none;
    -webkit-appearance:none;
    background: url('./Group.png') no-repeat right;
}
```

5. 让文字不被选中
```css
.text {
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
}
```

6. 如何让图片不被选中
```css
img {
  -moz-user-select: none;   
  -webkit-user-select: none;
  -ms-user-select: none;   
  -khtml-user-select: none;   
  user-select: none;  
}
```
7. 单词换行
```css
.word {
    word-wrap: break-word;
    word-break: break-all;
}
```

8. css画叉
```css
.a{ 
  display: inline-block; 
  width: 20px;
  height:5px; 
  background: #ccc;
  line-height:0;
  font-size:0;
  vertical-align:middle;
  -webkit-transform: rotate(45deg);
  position: absolute;
  top: 16px;
  right: 13px;
}
.a:after{
  content:'/';
  display:block;
  width: 20px;
  height:5px; 
  background: #ccc;
  -webkit-transform: rotate(-90deg);
}
```

9. 文字过多三点显示隐藏
```css
// 单行三点隐藏
.one-line {
    white-space: nowrap;
    text-overflow:ellipsis;
    width: 150px;
    overflow: hidden;
}
// 多行三点隐藏
.more-line {
    overflow:hidden; 
    text-overflow:ellipsis;
    display:-webkit-box; 
    -webkit-box-orient:vertical;
    -webkit-line-clamp:2; 
}
```