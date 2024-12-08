---
title: 数组
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-07
    author: 老怪鸽
    version: 1.0.0
    content: 更新了基本文档
---

## 一维数组

一维数组是线性数据结构，用于存储相同数据类型的元素集合。

**定义与初始化**
```c 
int numbers[10]; // 声明一个整型数组，包含10个元素
int nums[] = {1, 2, 3, 4, 5}; // 声明并初始化一个整型数组
```
**访问元素**
```c
int value = numbers[2]; // 访问索引为2的元素
numbers[2] = 10; // 设置索引为2的元素值为10
```
**遍历数组**
```c
for (int i = 0; i < 5; i++) {
    printf("%d ", nums[i]);
}
```

## 二维数组

二维数组用于存储表格形式的元素，可以看作是一个数组的数组。

**定义与初始化**
```c
int matrix[3][4]; // 声明一个3行4列的整型数组
int grid[2][2] = {{1, 2}, {3, 4}}; // 声明并初始化一个2x2的整型数组
```
**访问元素**
```c
int element = grid[1][0]; // 访问第2行第1列的元素
grid[0][1] = 10; // 设置第1行第2列的元素值为10
```

**遍历数组**
```c
for (int i = 0; i < 2; i++) {
    for (int j = 0; j < 2; j++) {
        printf("%d ", grid[i][j]);
    }
    printf("\n");
}
```
## 字符数组与字符串

字符数组用于存储字符序列，C语言中没有专门的字符串类型，字符串通常以字符数组的形式存储。

**定义与初始化**
```c
char str[11] = "Hello, World"; // 声明并初始化一个字符数组
```

**字符串操作**
```c
#include <string.h>

// 字符串长度
int length = strlen(str);

// 字符串复制
char copy[11];
strcpy(copy, str);

// 字符串连接
char dest[21];
strcat(dest, str);
strcat(dest, " Goodbye");
```

> **strlen、strcpy、strcat**是 `string.h` 文件的函数用于返回字符串长度、从字符串1复制到字符串2、将字符串2接到字符串1的结尾。
> 还有`strstr`字符串查找函数，具体功能先自行百度。

## 作业

编写一个C语言程序，实现以下功能：

1. 创建一个包含10个整数的数组。
2. 使用循环初始化数组，使得数组的每个元素等于其索引的平方（即array[i] = i * i）。
3. 打印出数组的每个元素。
4. 计算数组中所有元素的和，并打印出来。

.. details::答案代码
    ```c
    #include <stdio.h>

    int main() {
        int array[10]; // 创建一个包含10个整数的数组
        int sum = 0;   // 用于存储数组元素的和

        // 初始化数组并计算和
        for (int i = 0; i < 10; i++) {
            array[i] = i * i; // 数组元素等于其索引的平方
            sum += array[i];  // 累加数组元素到sum
        }

        // 打印数组元素
        printf("数组元素：\n");
        for (int i = 0; i < 10; i++) {
            printf("array[%d] = %d\n", i, array[i]);
        }

        // 打印数组元素的和
        printf("数组元素的和：%d\n", sum);

        return 0;
    }
    ```
