# vue 手写一个时间选择器
最近研究了 DatePicker 的实现原理后做了一个 vue 的 DatePicker 组件，今天带大家一步一步实现 DatePicker 的 vue 组件。

## 原理

> DatePicker 的原理是——计算日历面板中当月或选中月份的总天数及前后月份相近的日子，根据点击事件计算日历面板显示内容，以及将所选值赋值给`<input/>`标签。

## 实现
* **CSS 代码于文章末尾处**

### 1. 构思页面结构
DatePicker 组件由输入框和日历面板组成，写好页面主体结构。
```html
<div class="date-picker">
  <input class="input" v-model="dateValue" @click="openPanel"/>
  <transition name="fadeDownBig">
    <div class="date-panel" v-show="panelState"></div>
  </transiton>
</div>
```
输入框`<input>`点击显示或隐藏日历面板,openPanel()方法改变 panelState 布尔值控制日历面板的显示隐藏。

日历面板由顶部条和面板两部分组成，而面板则由年份选择面板，月份选择面板，日期选择面板所组成，结构如下：
```html
<div class="date-panel" v-show="panelState">
  <!-- 顶部按钮及年月显示条 -->
  <div class="topbar">
    <span @click="leftBig">&lt;&lt;</span>
    <span @click="left">&lt;</span>
    <span class="year" @click="panelType = 'year'">{{tmpYear}}</span>
    <span class="month" @click="panelType = 'month'">{{changeTmpMonth}}</span>
    <span @click="right">&gt;</span>
    <span @click="rightBig">&gt;&gt;</span>
  </div>
  <!-- 年面板 -->
  <div class="type-year" v-show="panelType === 'year'">
    <ul class="year-list">
      <li v-for="(item, index) in yearList"
          :key="index"
          @click="selectYear(item)"
      >
        <span :class="{selected: item === tmpYear}" >{{item}}</span>
      </li>
    </ul>
  </div>
  <!-- 月面板 -->
  <div class="type-year" v-show="panelType === 'month'">
    <ul class="year-list">
      <li v-for="(item, index) in monthList"
          :key="index"
          @click="selectMonth(item)"
      >
        <span :class="{selected: item.value === tmpMonth}" >{{item.label}}</span>
      </li>
    </ul>
  </div>
  <!-- 日期面板 -->
  <div class="date-group" v-show="panelType === 'date'">
    <span v-for="(item, index) in weekList" :key="index" class="weekday">{{item.label}}</span>
    <ul class="date-list">
      <li v-for="(item, index) in dateList"
          v-text="item.value"
          :class="{preMonth: item.previousMonth, nextMonth: item.nextMonth,
          selected: date === item.value && month === tmpMonth && item.currentMonth, invalid: validateDate(item)}"
          :key="index" 
          @click="selectDate(item)">
      </li>
    </ul>
  </div>
</div>
```
### 2. 页面数据实现
DatePicker 所对应的 data 代码
```javascript
data() {
  return {
    dateValue: "", // 输入框显示日期
    date: new Date().getDate(), // 当前日期
    panelState: false, // 初始值，默认panel关闭
    tmpMonth: new Date().getMonth(), // 临时月份，可修改
    month: new Date().getMonth(),
    tmpYear: new Date().getFullYear(), // 临时年份，可修改
    weekList: [
      { label: "Sun", value: 0 },
      { label: "Mon", value: 1 },
      { label: "Tue", value: 2 },
      { label: "Wed", value: 3 },
      { label: "Thu", value: 4 },
      { label: "Fri", value: 5 },
      { label: "Sat", value: 6 }
    ], // 周
    monthList: [
      { label: "Jan", value: 0 },
      { label: "Feb", value: 1 },
      { label: "Mar", value: 2 },
      { label: "Apr", value: 3 },
      { label: "May", value: 4 },
      { label: "Jun", value: 5 },
      { label: "Jul", value: 6 },
      { label: "Aug", value: 7 },
      { label: "Sept", value: 8 },
      { label: "Oct", value: 9 },
      { label: "Nov", value: 10 },
      { label: "Dec", value: 11 }
    ], // 月
    nowValue: 0, // 当前选中日期值
    panelType: "date" // 面板状态
  };
},
```
DatePicker 的核心在于日期面板的数据。我们知道，一个月最多31天，最少28天。面板按周日至周六设计，最极端的情况如下:

最多的极端情况：
|日|一|二|三|四|五|六|
| :----: | :----:  | :----: | :----: | :----: | :----: | :----: |
|*|*|*|*|*|*|1|
|2|3|4|5|6|7|8|
|9|10|11|12|13|14|15|
|16|17|18|19|20|21|22|
|23|24|25|26|27|28|29|
|30|31|1|2|3|4|5|

最少的极端情况：
|日|一|二|三|四|五|六|
| :----: | :----:  | :----: | :----: | :----: | :----: | :----: |
|1|2|3|4|5|6|7|
|8|9|10|11|12|13|14|
|15|16|17|18|19|20|21|
|22|23|24|25|26|27|28|29|
|1|2|3|4|5|6|7|
|8|9|10|11|12|13|14|

根据上表我们可以得知一个月最多占六个星期，最少四个星期，所以日历面板必须设计为 6 行，剩余的用下个月的日期补上，最多补14天。因此日期数组可以这么设计：
```Javascript
computed: {
  dateList() {
    //获取当月的天数
    let currentMonthLength = new Date(
      this.tmpYear,
      this.tmpMonth + 1,
      0
    ).getDate();
    //先将当月的日期塞入dateList
    let dateList = Array.from(
      { length: currentMonthLength },
      (val, index) => {
        return {
          currentMonth: true,
          value: index + 1
        };
      }
    );
    // 获取当月1号的星期是为了确定在1号前需要插多少天
    let startDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay();
    // 确认上个月一共多少天
    let previousMongthLength = new Date(
      this.tmpYear,
      this.tmpMonth,
      0
    ).getDate();
    // 在1号前插入上个月日期
    for (let i = 0, len = startDay; i < len; i++) {
      dateList = [
        { previousMonth: true, value: previousMongthLength - i }
      ].concat(dateList);
    }
    // 补全剩余位置,至少14天，则 i < 15
    for (let i = 1, item = 1; i < 15; i++, item++) {
      dateList[dateList.length] = { nextMonth: true, value: i };
    }
    return dateList;
  },
}
```

changeTmpMonth 为选择月份后显示的文案，yearList 为年份列表，为了与月份数量保持一致，我们也设长度为12.
```javascript
computed: {
  changeTmpMonth() {
    return this.monthList[this.tmpMonth].label;
  },
  // 通过改变this.tmpYear则可以改变年份数组
  yearList() {
    return Array.from({ length: 12 }, (value, index) => this.tmpYear + index);
  }
}

```
### 3. 实现页面功能
（1）面板切换功能
![面板图](https://user-gold-cdn.xitu.io/2018/8/2/164f98291bbb4743?w=331&h=436&f=png&s=19236)
- 点击输入框，除了打开日历面板，同时也默认为日期面板
```javascript
openPanel() {
  this.panelState = !this.panelState;
  this.panelType = "date";
},
```
- 点击 2018 年份进入年份面板，点击相对应年份显示该年份并进入月份选择面板
```html
<span class="year" @click="panelType = 'year'">{{tmpYear}}</span>
```
```javascript
selectYear(item) {
  this.tmpYear = item;
  this.panelType = "month";
},
```
- 点击 Aug 月份进入月份面板，点击相对应月份显示该月份并进入日期选择面板
```html
<span class="month" @click="panelType = 'month'">{{changeTmpMonth}}</span>
```
```javascript
selectMonth(item) {
  this.tmpMonth = item.value;
  this.panelType = "date";
},
```
点击日期选择日期，关闭面板同时赋值给输入框
```Javascript
// methods
selectDate(item) {
  // 赋值 当前 nowValue,用于控制样式突出显示当前月份日期
  this.nowValue = item.value;
  // 选择了上个月
  if (item.previousMonth) this.tmpMonth--;
  // 选择了下个月
  if (item.nextMonth) this.tmpMonth++;
  // 获取选中日期的 date
  let selectDay = new Date(this.tmpYear, this.tmpMonth, this.nowValue);
  // 格式日期为字符串后，赋值给 input
  this.dateValue = this.formatDate(selectDay.getTime());
  // 关闭面板
  this.panelState = !this.panelState;
},
// 日期格式方法
formatDate(date, fmt = this.format) {
  if (date === null || date === "null") {
    return "--";
  }
  date = new Date(Number(date));
  var o = {
    "M+": date.getMonth() + 1, // 月份
    "d+": date.getDate(), // 日
    "h+": date.getHours(), // 小时
    "m+": date.getMinutes(), // 分
    "s+": date.getSeconds(), // 秒
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? o[k]
          : ("00" + o[k]).substr(("" + o[k]).length)
      );
  }
  return fmt;
},
// 确认是否为当前月份
validateDate(item) {
  if (this.nowValue === item.value && item.currentMonth) return true;
},
```
（2）topbar 中左右箭头功能，具体详看下面方法
```javascript
// <
left() {
  if (this.panelType === "year") this.tmpYear--;
  else {
    if (this.tmpMonth === 0) {
      this.tmpYear--;
      this.tmpMonth = 11;
    } else this.tmpMonth--;
  }
},
// <<
leftBig() {
  if (this.panelType === "year") this.tmpYear -= 12;
  else this.tmpYear--;
},
// >
right() {
  if (this.panelType === "year") this.tmpYear++;
  else {
    if (this.tmpMonth === 11) {
      this.tmpYear++;
      this.tmpMonth = 0;
    } else this.tmpMonth++;
  }
},
// >>
rightBig() {
  if (this.panelType === "year") this.tmpYear += 12;
  else this.tmpYear++;
},
```

（3） 实现输入框的双向绑定及格式规定

props
```javascript
props: {
  value: {
    type: [Date, String],
    default: ""
  },
  format: {
    type: String,
    default: "yyyy-MM-dd"
  }
},
```
其中 value 支持日期格式和字符串，当设置了props时，则需在monted钩子函数中初始化input 值。format 默认值为 "yyyy-MM-dd", 当然你也可以设置为 "dd-MM-yyyy"等。
```javascript
mounted() {
  if (this.value) {
    this.dateValue = this.formatDate(new Date(this.value).getTime());
  }
},
```
双向绑定父组件赋值 props 为 value, 子组件传递的事件为input, 因此需在 selectDate 方法中 emit 事件及数据给父组件

```javascript
selectDate(item) {
  ...
  this.$emit("input", selectDay);
},
```
这样，父组件便可以进行双向绑定了
```html
<Datepicker v-model="time" format="dd-MM-yyyy"/>
```
（4）点击页面其他位置收起日历面板
> 原理
>
> 监听页面的点击事件，检测到有点击事件时关闭面板，但点击组件内容时也会触发点击事件，因此需要在组件内部阻止冒泡。同时，当组件销毁时，也要及时清除该监听器。

组件最外层阻止冒泡
```html
<div class="date-picker" @click.stop></div>
```
页面创建设置监听
```javascript
mounted() {
  ...
  window.addEventListener("click", this.eventListener);
}
```
页面销毁清除监听
```javascript
destroyed() {
  window.removeEventListener("click", this.eventListener);
}
```
公共方法
```javascript
eventListener() {
  this.panelState = false;
},
```

[项目Demo](https://zxpsuper.github.io/Demo/datepicker/index.html)

[项目源码](https://github.com/zxpsuper/Demo/)

有用就点个赞呗~

### **最后，贴上 CSS 代码...**
- fadeDownBig 后面的样式为 vue `<transiton>` 的动画特效.

```CSS
.topbar {
  padding-top: 8px;
}
.topbar span {
  display: inline-block;
  width: 20px;
  height: 30px;
  line-height: 30px;
  color: #515a6e;
  cursor: pointer;
}
.topbar span:hover {
  color: #2d8cf0;
}
.topbar .year,
.topbar .month {
  width: 60px;
}
.year-list {
  height: 200px;
  width: 210px;
}
.year-list .selected {
  background: #2d8cf0;
  border-radius: 4px;
  color: #fff;
}
.year-list li {
  display: inline-block;
  width: 70px;
  height: 50px;
  line-height: 50px;
  border-radius: 10px;
  cursor: pointer;
}
.year-list span {
  display: inline-block;
  line-height: 16px;
  padding: 8px;
}
.year-list span:hover {
  background: #e1f0fe;
}
.weekday {
  display: inline-block;
  font-size: 13px;
  width: 30px;
  color: #c5c8ce;
  text-align: center;
}
.date-picker {
  width: 210px;
  text-align: center;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
}
.date-panel {
  width: 210px;
  box-shadow: 0 0 8px #ccc;
  background: #fff;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.date-list {
  width: 210px;
  text-align: left;
  height: 180px;
  overflow: hidden;
  margin-top: 4px;
}
.date-list li {
  display: inline-block;
  width: 28px;
  height: 28px;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
  color: #000;
  border: 1px solid #fff;
  border-radius: 4px;
}
.date-list .selected {
  border: 1px solid #2d8cf0;
}
.date-list .invalid {
  background: #2d8cf0;
  color: #fff;
}
.date-list .preMonth,
.date-list .nextMonth {
  color: #c5c8ce;
}
.date-list li:hover {
  background: #e1f0fe;
}
input {
  display: inline-block;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  line-height: 1.5;
  padding: 4px 7px;
  font-size: 12px;
  border: 1px solid #dcdee2;
  border-radius: 4px;
  color: #515a6e;
  background-color: #fff;
  background-image: none;
  position: relative;
  cursor: text;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  margin-bottom: 6px;
}
.fadeDownBig-enter-active,
.fadeDownBig-leave-active,
.fadeInDownBig {
  -webkit-animation-duration: 0.5s;
  animation-duration: 0.5s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}
.fadeDownBig-enter-active {
  -webkit-animation-name: fadeInDownBig;
  animation-name: fadeInDownBig;
}
.fadeDownBig-leave-active {
  -webkit-animation-name: fadeOutDownBig;
  animation-name: fadeOutDownBig;
}
@-webkit-keyframes fadeInDownBig {
  from {
    opacity: 0.8;
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
@keyframes fadeInDownBig {
  from {
    opacity: 0.8;
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
  to {
    opacity: 1;
    -webkit-transform: none;
    transform: none;
  }
}
@-webkit-keyframes fadeOutDownBig {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.8;
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
}
@keyframes fadeOutDownBig {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
```