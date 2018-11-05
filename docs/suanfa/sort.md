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

## 4. 快速排序
![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898c22284?imageslim)

快速排序是分治策略的经典实现，分治的策略如下：

- 分解(Divide)步骤：将问题划分未一些子问题，子问题的形式与原问题一样，只是规模更小
- 解决(Conquer)步骤：递归地求解出子问题。如果子问题的规模足够小，则停止递归，直接求解
- 合并(Combine)步骤：将子问题的解组合成原问题的解

快速排序函数,我们需要将排序问题划分为一些子问题进行排序，然后通过递归求解，我们的终止条件就是,当array.length > 1不再生效时返回数组
```javascript
// 原地交换函数，而非用临时数组
function swap(array, a, b) {
  [array[a], array[b]] = [array[b], array[a]];
}
// 划分操作函数
function partition(array, left, right) {
  // 取中间值
  const pivot = array[Math.floor((right + left) / 2)];
  let i = left;
  let j = right;

  while (i <= j) {
    while (compare(array[i], pivot) === -1) {
      i++;
    }
    while (compare(array[j], pivot) === 1) {
      j--;
    }
    if (i <= j) {
      swap(array, i, j);
      i++;
      j--;
    }
  }
  return i;
}

// 比较函数
function compare(a, b) {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
}

// 快排
function quick(array, left, right) {
  let index;
  if (array.length > 1) {
    index = partition(array, left, right);
    if (left < index - 1) {
      quick(array, left, index - 1);
    }
    if (index < right) {
      quick(array, index, right);
    }
  }
  return array;
}
function quickSort(array) {
  return quick(array, 0, array.length - 1);
};

```

## 5. 希尔排序
![](https://user-gold-cdn.xitu.io/2018/8/14/16538fc898c88c5f?imageslim)

希尔排序是插入排序的改良算法，但是核心理念与插入算法又不同，它会先比较距离较远的元素，而非相邻的元素。

```js
function shellSort(arr,gap) {
    //为了方便观察过程，使用时去除
    console.log(arr)
    //最外层循环，一次取不同的步长，步长需要预先给出
    for(let i = 0; i<gap.length; i++) {  
        let n = gap[i]; //步长为n
        //接下类和插入排序一样，j循环依次取后面的数
        for(let j = i + n; j < arr.length; j++) { 
          //k循环进行比较，和直接插入的唯一区别是1变为了n
            for(let k = j; k > 0; k-=n) { 
                if(arr[k] < arr[k-n]) {
                    [arr[k],arr[k-n]] = [arr[k-n],arr[k]];
                    console.log(`当前序列为[${arr}] \n 交换了${arr[k]}和${arr[k-n]}`)
                    //为了观察过程
                } else {
                    continue;
                }
            }
        }
    }
    return arr;
}
var arr = [3, 2, 45, 6, 55, 23, 5, 4, 8, 9, 19, 0];
var gap = [3,2,1];
console.log(shellSort(arr,gap))
```
## 6. 归并排序
归并排序的核心思想是分治，分治是通过递归地将问题分解成相同或者类型相关的两个或者多个子问题，直到问题简单到足以解决，然后将子问题的解决方案结合起来，解决原始方案的一种思想

归并排序通过将复杂的数组分解成足够小的数组（只包含一个元素），然后通过合并两个有序数组（单元素数组可认为是有序数组）来达到综合子问题解决方案的目的。所以归并排序的核心在于如何整合两个有序数组，拆分数组只是一个辅助过程。

```js
// 假设有以下数组，对其进行归并排序使其按从小到大的顺序排列：
var arr = [8,7,6,5];
// 对其进行分解，得到两个数组：
[8,7]和[6,5]
// 然后继续进行分解，分别再得到两个数组，直到数组只包含一个元素：
[8]、[7]、[6]、[5]
// 开始合并数组，得到以下两个数组：
[7,8]和[5,6]
// 继续合并，得到
[5,6,7,8]
// 排序完成

```

```js
function mergeSort(arr) {
    function main(arr) {
        // 记得添加判断，防止无穷递归导致callstack溢出，此外也是将数组进行分解的终止条件。
        if(arr.length === 1) return arr;
        // 从中间开始分解，并构造左边数组和右边数组。
        let mid = Math.floor(arr.length/2);
        let left = arr.slice(0, mid);
        let right = arr.slice(mid);
        // 开始递归调用。
        return merge(arguments.callee(left), arguments.callee(right));
    }
    // 数组的合并函数，left是左边的有序数组，right是右边的有序数组。
    function merge(left, right) {
        // il是左边数组的一个指针，rl是右边数组的一个指针。
        let il = 0,
            rl = 0,
            result = [];
        // 同时遍历左右两个数组，直到有一个指针超出范围。
        while(il < left.length && rl < right.length) {
            //count++;
            // 左边数组的当前项如果小于右边数组的当前项，那么将左边数组的当前项推入result，反之亦然，同时将推入过的指针右移。
            if(left[il] < right[rl]) {
                result.push(left[il++]);
            }
            else {
                result.push(right[rl++]);
            }
        }
        // 记得要将未读完的数组的多余部分读到result。
        return result.concat(left.slice(il)).concat(right.slice(rl));
    }
    return main(arr)
}

```

## 7. 堆排序
堆排序也是一种很高效的排序方法，因为它把数组作为二叉树排序而得名，可以认为是归并排序的改良方案，它是一种原地排序方法，但是不够稳定，其时间复杂度为O(nlogn)。
```js
// 数组
var arr = [1,2,3,4,5,6,7];
// 堆结构
        1
      /   \
    2       3
  /   \   /   \
4      5 6     7
```
堆排序示意图如下：

![](http://bubkoo.qiniudn.com/building-a-heap.png)
```js
function heapSort(arr) {
    //console.time('HeapSort');
    buildHeap(arr);
    for(let i=arr.length-1; i>0; i--) {
        // 从最右侧的叶子节点开始，依次与根节点的值交换。
        [arr[i], arr[0]] = [arr[0], arr[i]];
        // 每次交换之后都要重新构建堆结构，记得传入i限制范围，防止已经交换的值仍然被重新构建。
        heapify(arr, i, 0);
    }
    //console.timeEnd('HeapSort');
    return arr;
    function buildHeap(arr) {
        // 可以观察到中间下标对应最右边叶子节点的父节点。
        let mid = Math.floor(arr.length / 2);
        for(let i=mid; i>=0; i--) {
            // 将整个数组构建成堆结构以便初始化。
            heapify(arr, arr.length, i);
        }
        return arr;
    }
    // 从i节点开始下标在heapSize内进行堆结构构建的函数。
    function heapify(arr, heapSize, i) {
        // 左子节点下标。
        let left = 2 * i + 1,
            // 右子节点下标。
            right = 2 * i + 2,
            // 假设当前父节点满足要求（比子节点都大）。
            largest = i;
        // 如果左子节点在heapSize内，并且值大于其父节点，那么left赋给largest。
        if(left < heapSize && arr[left] > arr[largest]) {
            largest = left;
        }
        // 如果右子节点在heapSize内，并且值大于其父节点，那么right赋给largest。
        if(right < heapSize && arr[right] > arr[largest]) {
            largest = right;
        }
        if(largest !== i) {
            // 如果largest被修改了，那么交换两者的值使得构造成一个合格的堆结构。
            [arr[largest], arr[i]] = [arr[i], arr[largest]];
            // 递归调用自身，将节点i所有的子节点都构建成堆结构。
            arguments.callee(arr, heapSize, largest);
        }
        return arr;
    }
}

```