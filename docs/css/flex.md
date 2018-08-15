---
title: Flex布局介绍
---
### **Flex布局介绍**

---------------------------------------------------------------

Flex 是 Flexible Box 的缩写，意为"弹性布局"，用来为盒状模型提供最大的灵活性

任何一个容器都可以指定为 Flex 布局。
```css
.box{
  display: -webkit-flex; /* Safari */   //考虑兼容
  display: flex;
}
```

行内元素也可以使用 Flex 布局。
```css
.box{
  display: inline-flex;
}
```
注意，设为 Flex 布局以后，子元素的float、clear和vertical-align属性将失效。

### 父属性（作用于父级div等元素）


**1.flex-direction属性决定主轴的方向（即项目的排列方向）。**
```css
.box {
  flex-direction: row | row-reverse | column | column-reverse;
                  →         ←          ↓            ↑
}
```
**2 flex-wrap属性**
默认情况下，项目都排在一条线上。flex-wrap属性定义，如果一条轴线排不下，如何换行。
```css
.box{
  flex-wrap: nowrap | wrap | wrap-reverse;
      不换行     换行       向上换行
}
```
**3 flex-flow**(常用属性)
flex-flow属性是flex-direction属性和flex-wrap属性的简写形式，默认值为row nowrap。

**4 justify-content属性**(常用属性)
justify-content属性定义了项目在x轴上的对齐方式。
```css
.box {
  justify-content: flex-start | flex-end | center | space-between | space-around;
                   →             ←         居中       中间留空        头尾中间都留空
}
```
**5 align-items属性（y轴）**(常用属性)
align-items属性定义项目在交叉轴上如何对齐。
```css
.box {
  align-items: flex-start | flex-end | center | baseline | stretch 
                顶对齐       底对齐      中部对齐   首行对齐    充满
}
```                   
**6 align-content属性（y轴）**
align-content属性定义了多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用。
```css
.box {
  align-content: flex-start | flex-end | center | space-between | space-around | stretch;
               （请对照 align-items属性）
}
```
### 子属性 （作用于子级div等元素）
-----------------

**1 order属性**(常用属性)
order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

**2 flex-grow属性（比例属性）**
flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

**3 flex-shrink属性**
flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小。
值大于等于0，0代表不缩小，其他的当空间不足时按比例比例缩小

**4 flex-basis属性**
flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。它的默认值为auto，即项目的本来大小。

**5 flex属性**(常用属性)
flex属性是flex-grow, flex-shrink 和 flex-basis的简写，默认值为0 1 auto。后两个属性可选。
该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。
建议优先使用这个属性，而不是单独写三个分离的属性，因为浏览器会推算相关值。

**6 align-self属性（y轴）**(常用属性)## 标题 ##
align-self属性允许单个项目有与其他项目不一样的对齐方式，可覆盖align-items属性。默认值为auto，表示继承父元素的align-items属性，如果没有父元素，则等同于stretch。
```css
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
  （请对照 align-items属性）
}
```
该属性可能取6个值，除了auto，其他都与align-items属性完全一致。
