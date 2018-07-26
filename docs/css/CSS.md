1. 使用flex布局，元素的宽度定不了，需使用flex-shrink：0 使其宽度不缩小

2. 箭头的画法——两个三角形合成，一个覆盖另一个。

3. 父子元素设置margin-top以值大为准，且子元素无margin-top

4. 设置placeholder样式的方法

```
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

5. float:left 会影响 margin: 0 auto;自适应

6. div 设置 text-align:center 只对 div 中的行内元素起作用

7. 修改 select 默认样式
```
appearance:none;
-moz-appearance:none;
-webkit-appearance:none;
background: url('./Group.png') no-repeat right;
```

8. 让文字不被选中
```
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
```

9. botton 标签没有加type属性会出现路由加问号的情况出现（谷歌浏览器）。

10. vertical-align 只针对使用的元素，不会使子元素垂直居中

11. 如何让图片不被选中
```
  -moz-user-select: none;   
  -webkit-user-select: none;
  -ms-user-select: none;   
  -khtml-user-select: none;   
  user-select: none;  
```

12. 不允许的CSS cursor: not-allowed

13. 单词换行
```
word-wrap: break-word;
word-break: break-all;
```

14. 给父元素加上 transform:translate(0,0) ，fixed即可根据父容器定位。

15. css画叉
```
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
16. 3d按钮的实现

两个类：一个初始样式，一个：active样式。
主要属性：阴影，：active位置偏移。如top:5px;

17. box-sizing:border-box  使用该类的盒子并排显示，宽度高度包含padding

18. 绝对定位是相对于元素最近的已定位的祖先元素（即是设置了绝对定位或者相对定位h的祖先元素）