---
title: 结构体与联合体
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-07
    author: 老怪鸽
    version: 1.0.0
    content: 更新了基本文档
---

## 结构体的定义与使用

结构体是C语言中一种组合数据类型，它允许我们将多个不同类型的数据项组合成一个单一的实体。结构体的定义和使用是C语言编程中的基础技能。

**注意事项：**
* 结构体定义以 struct 关键字开始。
* 结构体成员可以是不同的数据类型。
* 结构体变量在声明时不会自动初始化，需要手动赋值。
* 结构体成员的访问使用点操作符（.）。

**示例**
```c
#include <stdio.h>
#include <string.h>

// 定义一个名为Person的结构体
struct Person {
    char name[50];
    int age;
    float height;
};

int main() {
    // 创建结构体变量
    struct Person person1;

    // 使用点操作符为结构体成员赋值
    strcpy(person1.name, "Alice Smith"); // 复制字符串到name成员
    person1.age = 30; // 赋值年龄
    person1.height = 5.7f; // 赋值身高

    // 打印结构体成员的值
    printf("Name: %s\n", person1.name);
    printf("Age: %d\n", person1.age);
    printf("Height: %.2f\n", person1.height);

    return 0;
}
```

## 结构体数组

结构体数组是一系列相同结构体的集合，可以用来存储多个具有相同属性的数据项。

**注意事项：**
* 结构体数组声明时可以初始化。
* 结构体数组的索引从0开始。
* 可以通过循环遍历结构体数组来访问和操作每个元素。

**示例**
```c
#include <stdio.h>
#include <string.h>

// 定义Person结构体
struct Person {
    char name[50];
    int age;
    float height;
};

int main() {
    // 声明并初始化结构体数组
    struct Person employees[2] = {
        {"Alice Smith", 30, 5.7f},
        {"Bob Johnson", 25, 5.9f}
    };

    // 遍历结构体数组并打印成员
    for (int i = 0; i < 2; i++) {
        printf("Employee %d:\n", i + 1);
        printf("Name: %s\n", employees[i].name);
        printf("Age: %d\n", employees[i].age);
        printf("Height: %.2f\n", employees[i].height);
        printf("\n");
    }

    return 0;
}

```


## 结构体指针

结构体指针是一个变量，它存储了结构体变量的内存地址。使用结构体指针可以更高效地访问结构体成员。

**注意事项：**
* 结构体指针使用星号（*）声明。
* 访问结构体指针指向的成员时，使用箭头操作符（->）。
* 结构体指针可以用来传递结构体变量到函数中，而不需要复制整个结构体。
* 
**示例**
```c
#include <stdio.h>
#include <string.h>

// 定义Person结构体
struct Person {
    char name[50];
    int age;
    float height;
};

int main() {
    // 声明结构体变量
    struct Person person1 = {"Alice Smith", 30, 5.7f};

    // 声明结构体指针并指向person1
    struct Person *ptr = &person1;

    // 使用结构体指针访问成员
    printf("Name: %s\n", ptr->name); // 使用箭头操作符访问成员
    printf("Age: %d\n", ptr->age);
    printf("Height: %.2f\n", ptr->height);

    return 0;
}

```




## 联合体的定义与使用



联合体是一种特殊的存储类，它允许在相同的内存位置存储不同的数据类型，但在任意时刻只能存储其中一个类型的值。


**注意事项：**
* 联合体以 union 关键字定义。
* 联合体的所有成员共享同一块内存。
* 联合体的大小是其最大成员的大小。
* 赋值给联合体的一个成员会覆盖其他成员的值。


**示例**
```c
#include <stdio.h>

// 定义一个联合体
union Value {
    int intVal;
    float floatVal;
    char charVal;
};

int main() {
    // 声明联合体变量
    union Value value;

    // 使用联合体
    value.intVal = 123; // 存储整数值
    printf("Integer: %d\n", value.intVal);

    // 覆盖整数值，存储浮点数值
    value.floatVal = 456.789f;
    printf("Float: %f\n", value.floatVal);

    // 覆盖浮点数值，存储字符值
    value.charVal = 'A';
    printf("Char: %c\n", value.charVal);

    // 注意：由于联合体成员共享内存，以下打印可能不会显示正确的整数值
    printf("Integer (after char): %d\n", value.intVal);

    return 0;
}
```

在联合体的使用中，要注意一旦一个新的成员被赋值，之前存储的值就会丢失，因为所有成员共享同一块内存。


## 作业

编写一个C语言程序，实现以下功能：

1. 定义一个结构体 Student，包含姓名（字符数组）、年龄（整型）和成绩（浮点型）。
2. 声明一个结构体数组 students，包含5个 Student 结构体元素。
3. 使用循环初始化结构体数组，从用户输入获取每个学生的信息。
4. 使用另一个循环打印出所有学生的信息。
5. 计算并打印所有学生的平均成绩。

.. details::答案代码

    ```c
    #include <stdio.h>

    // 定义Student结构体
    struct Student {
        char name[50];
        int age;
        float grade;
    };

    int main() {
        struct Student students[5];
        float sum = 0.0f;
        int i;

        // 初始化结构体数组
        for (i = 0; i < 5; i++) {
            printf("Enter information for student %d:\n", i + 1);
            printf("Name: ");
            scanf("%49s", students[i].name); // 限制输入长度以避免溢出
            printf("Age: ");
            scanf("%d", &students[i].age);
            printf("Grade: ");
            scanf("%f", &students[i].grade);
            sum += students[i].grade; // 累加成绩
        }

        // 打印所有学生的信息
        printf("\nList of students:\n");
        for (i = 0; i < 5; i++) {
            printf("Student %d: %s, Age: %d, Grade: %.2f\n", i + 1, students[i].name, students[i].age, students[i].grade);
        }

        // 计算并打印平均成绩
        float average = sum / 5;
        printf("\nAverage grade of all students: %.2f\n", average);

        return 0;
    }
    ```
    > 在这个程序中，我们首先定义了一个 Student 结构体，然后声明了一个包含5个 Student 结构体元素的数组 students。通过循环，我们从用户那里获取每个学生的信息，并将这些信息存储在数组中。同时，我们累加所有学生的成绩以计算平均成绩。最后，我们打印出所有学生的信息和平均成绩。

    > 这个程序是一个简单的命令行应用程序，它假设用户会按照提示输入正确的信息。在实际应用中，可能需要添加更多的错误检查和异常处理。





