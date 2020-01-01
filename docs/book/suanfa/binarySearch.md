# 算法复杂度

在开始学习之前，我们首先要搞懂时间复杂度和空间复杂度的概念，它们的高低共同决定着一段代码质量的好坏

## 1. 时间复杂度

一个算法的时间复杂度反映了程序运行从开始到结束所需要的时间。把算法中基本操作重复执行的次数（频度）作为算法的时间复杂度。

### **大O表示法**

**大O表示法是用来表示算法的性能和复杂度的, 通常也表示算法占用cpu的情况。**

- O(1)复杂度
```javascript
// 复杂度为永远为一
function increase(n) {
  n++;
}
```

- O(log n)复杂度

对数级的时间复杂度，随着数组数量的扩大，它的时间复杂度增长反而越来越缓慢，也就是说，数组越长对数级的时间复杂度的算法越具备优势.

二分查找法就是典型的对数级的时间复杂度，我们通过动图能看到它的优势，几步就能完成。

```javascript
// 二分查找，前提是数组为有序数组
function binarySearch(target, arr) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = parseInt(start + (end - start) / 2);
    if (target == arr[mid]) {
      return mid;
    } else if (target > arr[mid]) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return -1;
}
```
- O(n)复杂度

随着算法内容增加，复杂度正比例增加，如： 
```javascript
function search(arr, target) {
  let index = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) {
      index = i;
    }
  }
  return index;
}
```
- O(n²)复杂度

这种属于平方级别的时间复杂度，属于我们要尽量避免的复杂度，其速度极其慢，典型的O(n²)级别的算法就是冒泡排序。

```javascript
function bubbleSort(arr) {
  let len = arr.length;
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) {
        // 相邻元素两两对比
        let temp = arr[j + 1]; // 元素交换
        arr[j + 1] = arr[j];
        arr[j] = temp;
      }
    }
  }
  return arr;
}
```

## 2. 空间复杂度

一个程序的空间复杂度是指运行完一个程序所需内存的大小。利用程序的空间复杂度，可以对程序的运行所需要的内存多少有个预先估计。

一个程序执行时除了需要存储空间和存储本身所使用的指令、常数、变量和输入数据外，还需要一些对数据进行操作的工作单元和存储一些为现实计算所需信息的辅助空间。