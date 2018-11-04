# 排序算法
---
排序算法是面试及笔试中必考点，本文通过动画方式演示，通过实例讲解，最后给出JavaScript版的排序算法

## 1. 冒泡排序

![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898b4742e?imageslim)

1. 比较相邻的元素。如果第一个比第二个大，就交换他们两个。 
2. 对每一对相邻元素作同样的工作，从头到尾，最后的元素应该会是最大的数。 
3. 针对所有的元素重复以上的步骤，除了最后一个。 
4. 持续每次对越来越少的元素重复上面的步骤，直到没有任何一对数字需要比较。

编程思路：外循环控制需要比较的元素，比如第一次排序后，最后一个元素就不需要比较了，内循环则负责两两元素比较，将元素放到正确位置上

```js
// 冒泡排序，两层循环
function bubbleSort(arr){
  var len = arr.length
  for(var i = len - 1;i > 0;i--){
    for(var j = 0;j < i;j++){
      if(arr[j] > arr[j + 1]){
        var tmp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = tmp
      }
    }
  }
  return arr;
}
```
## 2. 选择排序
![](https://upload-images.jianshu.io/upload_images/7932253-cc76095678bc9ec9.gif?imageMogr2/auto-orient/strip)

选择排序是从数组的开头开始，将第一个元素和其他元素作比较，检查完所有的元素后，最小 (大) 的放在第一个位置，接下来再开始从第二个元素开始，重复以上一直到最后。

编程思路：两个循环，外循环不断递减至结尾，内循环负责找出最小的值给外层循环交换位置
```js
function selectSort(array) {
  var length = array.length, i, j, minIndex, minValue, temp;
  for (i = 0; i < length - 1; i++) {
    minIndex = i;
    minValue = array[minIndex];
    for (j = i + 1; j < length; j++) {//通过循环选出最小的
      if (array[j] < minValue) {
        minIndex = j;
        minValue = array[minIndex];
      }
    }
    // 交换位置
    temp = array[i];
    array[i] = minValue;
    array[minIndex] = temp;
  }
  return array
}
```
## 3. 插入排序
![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898df137f?imageslim)

插入排序核心——扑克牌思想： 就像自己在打扑克牌，接起来一张，放哪里无所谓，再接起来一张，比第一张小，放左边，继续接，可能是中间数，就插在中间....依次类推



```js
function insertSort(arr) {
  for(let i = 1; i < arr.length; i++) {  //外循环从1开始，默认arr[0]是有序段
    for(let j = i; j > 0; j--) {  //j = i,将arr[j]依次插入有序段中
      if(arr[j] < arr[j-1]) {
        [arr[j],arr[j-1]] = [arr[j-1],arr[j]];
      } else {
        break;
      }
    }
  }
  return arr;
}
```