---
title: 指针
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-07
    author: 老怪鸽
    version: 1.0.0
    content: 更新了基本文档
---

## 指针的概念与定义

指针是一个变量，它存储了另一个变量的地址。

在C语言中，指针的定义格式如下：
```c
数据类型 *指针变量名;
```
**示例：**
```c
int *ptr; // 定义一个指向整数的指针
```
## 指针的运算
指针可以进行几种基本运算，包括加法、减法、自增（++）、自减（–）以及比较运算。
**示例：**
```c
int var = 5;
int *ptr = &var; // ptr指向var的地址

ptr++; // ptr指向下一个int类型的地址
ptr--; // ptr指向前一个int类型的地址
```


## 指针与数组
数组名在大多数情况下可以作为指向数组首元素的指针使用。

**示例：**
```c
int arr[5] = {10, 20, 30, 40, 50};
int *ptr = arr; // ptr指向数组arr的首元素

for (int i = 0; i < 5; i++) {
    printf("%d ", *(ptr + i)); // 输出数组元素
}
```

## 指针与函数

可以通过指针向函数传递变量的地址，这样函数就可以直接修改传入的变量。

**示例：**
```c
void increment(int *p) {
    (*p)++; // 直接修改指针所指向的值
}

int main() {
    int num = 10;
    increment(&num); // 传递num的地址
    printf("num = %d\n", num); // 输出11
    return 0;
}
```

## 指针与字符串

在C语言中，字符串实际上是一个字符数组，可以用指针来操作字符串。

**示例：**
```c
char str[] = "Hello, World!";
char *ptr = str; // ptr指向字符串的首字符

while (*ptr != '\0') { // 遍历字符串直到遇到空字符
    printf("%c", *ptr);
    ptr++; // 移动到下一个字符
}
printf("\n");
```

## 指针数组与数组指针

指针数组是一个数组，其元素都是指针。

**示例：**

```c
int var1 = 10, var2 = 20, var3 = 30;
int *ptrArr[3] = {&var1, &var2, &var3}; // 指针数组

for (int i = 0; i < 3; i++) {
    printf("%d ", *ptrArr[i]); // 输出指针数组指向的值
}
printf("\n");
```

数组指针是一个指向数组的指针。

**示例：**

```c
int arr[3] = {10, 20, 30};
int (*ptrArr)[3] = &arr; // 数组指针

for (int i = 0; i < 3; i++) {
    printf("%d ", (*ptrArr)[i]); // 输出数组指针指向的数组元素
}
printf("\n");

```

## 作业

编写一个C语言程序，实现以下功能，不使用任何函数（除了main函数）：

1. 声明一个整型数组，包含10个元素。
2. 使用指针初始化数组，使得每个元素的值等于其索引的立方（即array[i] = i * i * i）。
3. 使用指针遍历数组，并打印出每个元素的值。
4. 使用指针计算并打印数组中所有元素的总和。

**作业要求**

* 确保所有操作都通过指针完成。
* 程序中不得使用数组下标[]，只能使用指针运算。

.. details::答案代码
    ```c
    #include <stdio.h>

    int main() {
        int array[10]; // 声明一个整型数组
        int *ptr = array; // 指针指向数组的首元素
        int sum = 0; // 用于存储数组元素的总和

        // 使用指针初始化数组
        for (int i = 0; i < 10; i++) {
            *ptr = i * i * i; // 设置元素的值为索引的立方
            ptr++; // 移动指针到下一个元素
        }

        // 重置指针指向数组的首元素
        ptr = array;

        // 使用指针遍历数组并打印元素
        printf("数组元素：\n");
        for (int i = 0; i < 10; i++) {
            printf("%d ", *ptr); // 打印当前指针指向的元素
            sum += *ptr; // 累加到总和
            ptr++; // 移动指针到下一个元素
        }
        printf("\n");

        // 打印数组元素的总和
        printf("数组元素的总和：%d\n", sum);

        return 0;
    }
    ```