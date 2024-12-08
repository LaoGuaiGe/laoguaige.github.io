---
title: 预处理命令
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-07
    author: 老怪鸽
    version: 1.0.0
    content: 更新了基本文档
---

## 宏定义

宏定义是C语言预处理器的一个重要功能，它可以定义常量或者简单的函数。本身的作用是替代！

```c
#include <stdio.h>

// 定义一个宏来表示圆周率
#define PI 3.14159

// 定义一个宏来计算一个数的平方
#define SQUARE(x) ((x) * (x))

int main() {
    float radius = 5.0f;
    float area;

    // 使用宏PI来计算圆的面积
    area = PI * SQUARE(radius);
    printf("Area of the circle with radius %f is %f\n", radius, area);

    return 0;
}

```

## 文件包含

文件包含使用 #include 指令，它允许将一个源文件的内容包含到另一个源文件中。

```c
// my_macros.h
#ifndef MY_MACROS_H
#define MY_MACROS_H

#define MAX_SIZE 100
#define MIN_SIZE 10

#endif // MY_MACROS_H

// main.c
#include <stdio.h>
#include "my_macros.h" // 包含自定义的宏定义文件

int main() {
    int array[MAX_SIZE];
    printf("The size of the array is %d\n", MAX_SIZE);
    return 0;
}
```

## 条件编译

条件编译允许根据特定条件编译代码的一部分。这通常用于跨平台兼容性或调试。

```c
#include <stdio.h>

#define DEBUG

int main() {
    int value = 10;

    #ifdef DEBUG
    printf("Debug: Value is set to %d\n", value);
    #endif

    #if defined(DEBUG) && (value > 5)
    printf("Debug: Value is greater than 5\n");
    #endif

    #ifndef RELEASE
    printf("This is a debug build.\n");
    #else
    printf("This is a release build.\n");
    #endif

    return 0;
}
```