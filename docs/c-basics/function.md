---
title: 函数
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-07
    author: 老怪鸽
    version: 1.0.0
    content: 更新了基本文档
---

## 函数的定义与调用

在C语言中，函数是执行特定任务的代码块。

以下是函数定义的格式：
```c
返回类型 函数名(参数类型 参数名) {
    // 函数体
    // 执行的操作
}
```
例如，一个计算两个整数和的函数：

```c
int add(int a, int b) {
    return a + b;
}
```

**调用函数**

函数定义后，可以在代码中的任何位置调用它：

```c
int result = add(5, 3); // 调用add函数，并将返回值赋给result变量
```


## 函数参数与返回值

**参数**

函数参数是传递给函数的值，用于函数内部的计算或操作。

* **形参**：函数定义中的参数称为形参。
* **实参**：函数调用时传递的参数称为实参。

**返回值**

函数执行完成后，可以通过return语句返回一个值给调用者。

```c
int multiply(int a, int b) {
    return a * b; // 返回a和b的乘积
}
```

## 作用域与生命周期

**作用域**

变量的作用域是指变量可以被访问和使用的代码区域。

*  **局部变量**：在函数内部定义的变量，其作用域仅限于该函数。
* **全局变量**：在所有函数外部定义的变量，其作用域为整个程序。

**生命周期**

变量的生命周期是指变量从创建到销毁的时间段。

* **局部变量**：在函数调用时创建，函数返回时销毁。
* **全局变量**：在程序开始时创建，程序结束时销毁。

## 递归函数

递归函数是调用自身的函数。以下是一个计算阶乘的递归函数示例：

```c
unsigned long long factorial(unsigned int n) {
    if (n <= 1) {
        return 1; // 递归的基本情况
    } else {
        return n * factorial(n - 1); // 递归调用
    }
}
```


## 库函数简介

C语言标准库提供了一系列预定义的函数，用于执行常见任务。

**数学库函数**

```c
#include <math.h>

double sqrt(double x); // 计算平方根
double pow(double x, double y); // 计算x的y次幂
```

**输入输出库函数**

```c
#include <stdio.h>

int printf(const char *format, ...); // 格式化输出到标准输出
int scanf(const char *format, ...); // 格式化输入
```
**字符串处理库函数**

```c
#include <string.h>

size_t strlen(const char *s); // 计算字符串长度
char *strcpy(char *dest, const char *src); // 复制字符串
```

## 作业

编写一个C语言程序，实现以下功能：

1. 定义一个函数calculateAverage，该函数接收一个整型数组和数组的大小，计算并返回数组元素的平均值（作为浮点数）。
2. 定义一个递归函数printArray，该函数接收一个整型数组、数组的大小和当前索引，从当前索引开始打印数组中的所有元素。
3. 在main函数中，创建一个包含至少10个整数的数组，并使用calculateAverage函数计算其平均值。
4. 使用printArray函数打印数组中的所有元素。
5. 使用C标准库函数对数组进行排序（升序），并再次使用printArray函数打印排序后的数组。

.. details::答案代码
    ```c
    #include <stdio.h>

    // 函数声明
    float calculateAverage(int arr[], int size);
    void printArray(int arr[], int size, int index);
    void sortArray(int arr[], int size);

    int main() {
        int numbers[10] = {34, 78, 12, 9, 87, 66, 88, 99, 56, 45};
        int size = sizeof(numbers) / sizeof(numbers[0]);

        // 计算平均值
        float average = calculateAverage(numbers, size);
        printf("数组元素的平均值是：%.2f\n", average);

        // 打印数组
        printf("原始数组：\n");
        printArray(numbers, size, 0);

        // 排序数组
        sortArray(numbers, size);

        // 打印排序后的数组
        printf("排序后的数组：\n");
        printArray(numbers, size, 0);

        return 0;
    }

    // 计算平均值的函数实现
    float calculateAverage(int arr[], int size) {
        int sum = 0;
        for (int i = 0; i < size; i++) {
            sum += arr[i];
        }
        return (float)sum / size;
    }

    // 递归打印数组的函数实现
    void printArray(int arr[], int size, int index) {
        if (index < size) {
            printf("%d ", arr[index]);
            printArray(arr, size, index + 1); // 递归调用
        } else {
            printf("\n");
        }
    }

    // 数组排序的函数实现（使用简单的冒泡排序算法）
    void sortArray(int arr[], int size) {
        for (int i = 0; i < size - 1; i++) {
            for (int j = 0; j < size - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // 交换元素
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    ```