### 快速排序
---
快速排序是分治策略的经典实现，分治的策略如下：

分解(Divide)步骤：将问题划分未一些子问题，子问题的形式与原问题一样，只是规模更小
解决(Conquer)步骤：递归地求解出子问题。如果子问题的规模足够小，则停止递归，直接求解
合并(Combine)步骤：将子问题的解组合成原问题的解

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
