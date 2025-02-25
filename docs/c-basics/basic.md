---
title: 基本概念
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-07
    author: 老怪鸽
    version: 1.0
    content: 更新了基本文档
---

## 预处理器

C语言使用预处理器来处理源代码中的预处理指令，如 `#include` 用于包含头文件，`#define` 用于宏定义等。

```c

#include <stdio.h> // 预处理器指令，用于包含标准输入输出库的头文件
//使用printf时需要定义

```

## 语法规则

C语言程序是按顺序执行的，这意味着程序中的语句是从上到下逐条执行的，除非有控制流语句（如循环、分支等）改变执行顺序。

* C语言是区分大小写的，这意味着 `main` 和 `Main` 是不同的标识符。
* 每条语句通常以分号 `;` 结尾。
* 注释可以用 // 开始单行注释，或者用 `/* ... */` 包围多行注释。

## 标识符与关键字

**标识符** 是程序员用来定义`变量`、`函数`或`其他用户定义项`的 **名称**。标识符的命名规则如下：

* 必须以字母（a-z, A-Z）或下划线（_）开头。
* 后续字符可以是字母、数字（0-9）或下划线。
* 标识符是大小写敏感的。
* 标识符不能是关键字。

**关键字** 是C语言预定义的具有特定意义的单词，它们用于表示基本的语言构造和功能。例如：

---

| 类别         | 关键字列表                                                                                     |
|------------|--------------------------------------------------------------------------------------------|
| 数据类型     | char, int, float, double, short, long, signed, unsigned, void, _Bool, _Complex, _Imaginary |
| 存储类       | auto, register, static, extern, typedef, volatile, const                                      |
| 控制语句     | if, else, switch, case, default, while, do, for, break, continue, goto, return             |
| 结构化数据   | struct, union, enum                                                                           |
| 其他         | sizeof, typeof, static_assert, _Alignas, _Alignof (部分为C11标准引入)                        |

---

> 有那么多的关键字记不住怎么办？没事，如果你在代码中将关键字用于关键字功能外的其他功能，通常都是会报错了，当报错时，你就该意识到你的标识符定义可能是关键字了。

## 数据类型

C语言中的数据类型用于指定**变量**存储的数据种类和大小。基本数据类型包括：

| 数据类型名称 | 数据类型 | 字节大小 | 常规数据范围 |
|--------------|----------|----------|--------------|
| 有符号字符型 | char     | 1        | -128 到 127  |
| 无符号字符型 | unsigned char | 1 | 0 到 255 |
| 有符号整型   | int      | 4        | -2,147,483,648 到 2,147,483,647 |
| 无符号整型   | unsigned int | 4 | 0 到 4,294,967,295 |
| 有符号短整型 | short    | 2        | -32,768 到 32,767 |
| 无符号短整型 | unsigned short | 2 | 0 到 65,535 |
| 有符号长整型 | long     | 4        | -2,147,483,648 到 2,147,483,647 |
| 无符号长整型 | unsigned long | 4 | 0 到 4,294,967,295 |
| 单精度浮点型 | float    | 4        | 约为 -3.4E38 到 3.4E38（6-7位精度） |
| 双精度浮点型 | double   | 8        | 约为 -1.7E308 到 1.7E308（15-16位精度） |
| 扩展精度浮点型 | long double | 8 或 12 或 16 | 更大的范围和精度 |

---

.. details::字符型\整型\短整型\长整型\浮点型的扩展说明

    **字符型（char）**
        表示范围：通常是从 -128 到 127（有符号），或者从 0 到 255（无符号）。
        用途：用于存储单个字符或小的整数值。
        关键字：char，unsigned char（无符号），signed char（有符号，通常默认）。
    **整型（int）**
        表示范围：通常是 -2,147,483,648 到 2,147,483,647。
        用途：用于存储整数，是最常用的整数类型。
        关键字：int，unsigned int（无符号），signed int（有符号，通常默认）。
    **短整型（short int）**
        表示范围：通常是 -32,768 到 32,767。
        用途：当整型太大，而字符型不足以满足需求时使用。
        关键字：short，short int，unsigned short（无符号），signed short（有符号，通常默认）。
    **长整型（long int）**
        表示范围：对于32位通常是 -2,147,483,648 到 2,147,483,647，对于64位通常是 -9,223,372,036,854,775,808 到 9,223,372,036,854,775,807。
        用途：用于需要比普通整型更大范围的整数。
        关键字：long，long int，unsigned long（无符号），signed long（有符号，通常默认）。
    **浮点型（float）**
        表示范围：大约是 -3.4E+38 到 +3.4E+38。
        精度：大约是6-7位十进制数。
        用途：用于存储带有小数点的数值，但精度不如双精度浮点型。
        关键字：float
    **双精度浮点型（double）**
        表示范围：大约是 -1.7E+308 到 +1.7E+308。
        精度：大约是15位十进制数。
        用途：用于需要更高精度和更大范围的浮点数。
        关键字：double
    **长双精度浮点型（long double）**
        表示范围：比双精度浮点型更大。
        精度：比双精度浮点型更高。
        用途：用于需要极高精度和非常大范围的浮点数。
        关键字：long double

> 请注意，数据范围可能因不同的编译器和平台而异，例如，在某些系统上，int 可能是32位的，而在其他系统上可能是16位的。同样，long 类型在某些平台上可能是64位的。
> 为了确保跨平台的一致性，可以使用标准头文件 <limits.h> 和 <float.h> 来获取确切的数据类型大小和范围。

不知道大家有没有发现一个现象，使用`unsigned`修饰的数据类型都是正数，通常我们是叫中无符号型，表示没有负数的意思，例如：

```c
unsigned char temp = 0; //表示该temp为无符号整型数据，数据范围是 0 到 4,294,967,295
char value = 0;         //表示该value为有符号字符型数据，数据范围是 -128 到 127
```

>! 当变量参与到正负的运算时，这个变量的定义很重要，不能使用无符号的变量进行运算，不然无法得到负数。

## 变量与常量

### 变量

**变量**是存储数据的标识符，它的值可以在程序执行期间改变。

```c
int age; // 声明一个整型变量age
age = 30; // 给变量age赋值
```

.. details::变量的使用
    **1. 声明与初始化**
        在使用变量之前，必须先声明它。
        > (声明也叫定义，就是通过给变量定义一个数据类型，让变量知道它是干什么的)
        尽可能对变量进行初始化，以避免不确定的初始值。
        >（比如在声明时赋值为0，这个涉及到后面的全局变量和局部变量的概念）
    **2. 作用域**
        了解变量的作用域（全局变量、局部变量）。
        避免在不同的作用域中使用相同的变量名，以免产生混淆。
    **3. 命名规则**
        使用有意义的变量名，使其能够反映变量的用途。不要定义什么a,b,c。别人看不懂。
        遵守一致的命名约定（如驼峰命名法`MyValue`、下划线分隔`my_value`等）。
    **4. 类型一致**
        避免在不同类型之间进行不恰当的赋值，除非进行了显式类型转换。比如 `12 + 3.1415` 赋值给一个整型的变量，那么最终的结果还是一个整形的数据。
    **5. 修改与访问**
        不要在多个地方随意修改全局变量，这可能导致难以追踪的bug。
        尽量减少变量的使用范围，局部变量比全局变量更安全。（通过定义函数返回的方式获取变量）


### 常量

**常量**是固定值的标识符，一旦定义后其值不能更改。用`const`定义的参数就是常量。

```c
const float PI = 3.14159; // 声明一个常量PI
```

.. details::常量的使用

    **1. 定义常量**
    使用`#define`或`const`关键字来定义常量。
    对于数值常量，使用`const`可以提供类型安全。
    **2. 命名约定**
    常量名通常使用`大写字母`，并用下划线分隔单词（如MAX_VALUE）。
    **3. 使用常量**
    使用常量代替硬编码的值，以提高代码的可读性和可维护性。
    *如果一个值在程序中多次出现并且是固定的，应该将其定义为常量*。
    **4. 不可变性**
    一旦定义了常量，就不应该修改它的值。
    对于const定义的常量，编译器会确保其值不被修改。
    **5. 类型安全**
    使用const关键字定义常量时，应该指定类型，以避免类型隐式转换可能带来的问题。

## 运算符与表达式

运算符是用于执行某种操作或计算的特殊符号。C语言中有很多运算符，下面将一一介绍。

### 算术运算符

| 运算符 | 符号 | 例子|
|--------|------| --|
| 加法   | `+`  | value = 1 + 1, value==2 |
| 减法   | `-`  | value = 2 - 1, value==1 |
| 乘法   | `*`  | value = 2 * 2, value==4 |
| 除法   | `/`  | value = 2 / 2, value==1 |
| 取模   | `%`  | value = 2 % 2, value==0 |

算术运算符用于执行基本的数学运算，如加法、减法、乘法、除法和取模（求余数，只取第一个余数）。

### 关系运算符

| 运算符 | 符号 |
|--------|------|
| 等于   | `==` |
| 不等于 | `!=` |
| 小于   | `<`  |
| 大于   | `>`  |
| 小于等于 | `<=` |
| 大于等于 | `>=` |

关系运算符用于比较两个值，并返回一个布尔结果（真或假）。

### 逻辑运算符

| 运算符 | 符号 | 描述 |  例子  |
|--------|------| -- | -- |
| 逻辑与 | `&&` | 如果&&两边的条件都成立则为真，否则为假 |  ( 1 && 0 ) 假 <br> ( 1 && 1 ) 真  |
| 逻辑或 | `\|\|` | 如果\|\|两边的条件有一个成立则为真，否则为假 | ( 1 && 0 ) 真 <br> ( 0 && 0 ) 假  |
| 逻辑非 | `!`  | 使用!会将真的条件改为假，假的条件改为真 | ( !1  ) 假 <br> ( !0 ) 真  |

逻辑运算符用于组合或修改布尔表达式，逻辑与（`&&`）和逻辑或（`||`）用于组合两个条件，逻辑非（`!`）用于反转条件的布尔值。

### 表达式

表达式是由运算符和操作数组成的语句，它计算出一个值。

```c
int a = 5, b = 3;
int sum = a + b; // 这是一个表达式，计算a和b的和
```

下面举一些例子：

```c
5 > 3 && 2 < 4
答案: True

7 == 7 || 8 != 8
答案: True

!(10 < 20)
答案: False

12 / 4 == 3 && 5 * 2 > 9
答案: True

2 + 3 * 4 < 15
答案: False (因为3 * 4先计算，得到12，然后2 + 12 = 14，14不小于15)

'a' == 'A' || 'b' < 'c'
答案: True (因为'a' != 'A'为False，但'b' < 'c'为True，所以整体为True)

!(100 % 3 == 1) && 10 / 2 >= 5
答案: True (因为100 % 3 == 1为False，所以!False为True，且10 / 2等于5，5 >= 5为True)

3.14 > 2.71 && 2.71 < 3.14
答案: True

```

## 类型转换

类型转换是指将一种数据类型的变量转换为另一种数据类型。在C语言中，类型转换可以是隐式的，也可以是显式的。

```c
int num = 5;
double result = num + 3.5; // num会被隐式转换为double类型
```

显式类型转换（也称为类型强制转换）：

```c
double num = 3.14;
int intNum = (int)num; // 显式将double类型的num转换为int类型
```

## 输入与输出

在C语言中，输入是指程序从用户或其他外部源接收数据的过程，而输出是指程序将数据发送到用户或其他外部设备的过程。

### 输出（Output）

在C语言中，`printf` 函数是最常用的输出函数之一。它用于在控制台上打印格式化的字符串。`printf` 函数可以包含格式化占位符，如` %d` 用于整数，`%f` 用于浮点数，`%s` 用于字符串等。

### 输入（Input）

输入通常使用 `scanf` 函数来完成，它是C语言标准库中的一个函数，用于从标准输入（通常是键盘）读取格式化的数据。`scanf` 函数使用格式化字符串来指定输入数据的类型和格式。

### 输入输出例子

**读取并打印一个整数。**

```c
#include <stdio.h>

int main() {
    int number;

    printf("请输入一个整数: ");
    scanf("%d", &number); // 读取一个整数

    printf("您输入的整数是: %d\n", number); // 打印这个整数

    return 0;
}
```

**读取并打印两个浮点数，然后计算它们的和。**
```c
#include <stdio.h>

int main() {
    float num1, num2, sum;

    printf("请输入两个浮点数，用空格隔开: ");
    scanf("%f %f", &num1, &num2); // 读取两个浮点数

    sum = num1 + num2; // 计算和

    printf("您输入的两个浮点数分别是: %.2f 和 %.2f\n", num1, num2);
    printf("它们的和是: %.2f\n", sum); // 打印和

    return 0;
}
```

## 作业

**温度转换程序**

编写一个C语言程序，该程序能够将用户输入的摄氏度（Celsius）转换为华氏度（Fahrenheit）并输出结果。转换公式如下：

> 华氏度 = 摄氏度 * 9/5 + 32

**要求：**

程序开始时，应提示用户输入摄氏度值。

输入后，程序应计算对应的华氏度值。

输出结果应包括原始的摄氏度值和转换后的华氏度值，格式如下：
```c
摄氏度: XX
华氏度: YY
```

其中 XX 是用户输入的摄氏度值，YY 是计算出的华氏度值。

**示例：**

如果用户输入 25，则程序输出应为：

```c
摄氏度: 25
华氏度: 77
```

请根据上述要求编写完整的C语言程序。

.. details::答案代码
    ```c
    #include <stdio.h>

    int main() {
        float celsius, fahrenheit;

        // 提示用户输入摄氏度
        printf("请输入摄氏度值: ");
        scanf("%f", &celsius);

        // 计算华氏度
        fahrenheit = celsius * 9.0 / 5.0 + 32;

        // 输出结果
        printf("摄氏度: %.2f\n", celsius);
        printf("华氏度: %.2f\n", fahrenheit);

        return 0;
    }
    ```
    这段代码首先包含了标准输入输出头文件 stdio.h，然后在 main 函数中定义了两个浮点变量 celsius 和 fahrenheit。程序通过 printf 函数提示用户输入摄氏度值，并通过 scanf 函数读取用户输入的值。接着，使用给定的公式计算华氏度，并通过 printf 函数输出摄氏度和华氏度的值。最后，main 函数返回 0 表示程序正常结束。