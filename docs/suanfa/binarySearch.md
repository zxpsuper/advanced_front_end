### 算法复杂度
---
1. 大O表示法

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