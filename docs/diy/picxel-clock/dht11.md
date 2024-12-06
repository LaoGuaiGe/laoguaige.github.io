---
title: 温湿度读取
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-05
    author: 老怪鸽
    version: 1.0.1
    content: 更新了基本文档
---

## 工程创建
---
在VSCode中打开PlatformIO扩展创建名为`dht11`的 `Espressif ESP32-S3-DevKitM-1` 工程。

关于详细图文创建工程的过程请参考👉[RTC时钟驱动](ds1302.md)章节的工程创建小节。

## 安装驱动库
---

往工程中安装来自``Adafruit``的``DHT sensor library``库。

可以打开``platformio.ini``文件，验证工程是否已经安装上了``DHT11``的驱动库。

关于详细图文安装驱动库的过程请参考👉[RTC时钟驱动](ds1302.md)章节的安装驱动库小节。

## 编辑代码
---
打开工程下的src文件夹下的main.cpp。


输入以下代码：

```c
#include <Arduino.h>
#include <Adafruit_Sensor.h>
#include <DHT.h> //温湿度传感器驱动库

//DHT11温湿度传感器相关定义
#define DHTPIN 4 //传感器引脚连接4
#define DHTTYPE DHT11 //传感器支持DHT11, DHT12, DHT21, DHT22, AM2301


DHT dht(DHTPIN, DHTTYPE); //初始化温湿度传感器

//湿度 和 温度 的全局变量
float humidity=0, temperature=0;

//温湿度传感器数值读取
void readDHT(void) 
{
  //读取温度参数保存到全局变量中
  humidity = dht.readHumidity();
  //读取湿度参数保存到全局变量中
  temperature = dht.readTemperature();

  //判断温湿度数据是否是非数字
  if (isnan(humidity) || isnan(temperature)) {
    Serial.println("Failed to read from DHT sensor!");
    return;
  }
}

void setup() 
{
  //串口初始化
  Serial.begin(9600);
  //DHT11初始化
  dht.begin();
}

void loop() 
{
  char disp_buf[50] = {0};
  
  readDHT(); //读取温湿度参数

  //格式化字符串
  sprintf(disp_buf, "temperature=%02.0d C", (int)temperature);
  //输出温度
  Serial.println(disp_buf);

  //格式化字符串
  sprintf(disp_buf, "humidity=%02.0d %%", (int)humidity);
  //输出湿度
  Serial.println(disp_buf);

  delay(1000);
}
```

## 硬件连接
---

![图 0](../../static/images/docs/diy/picxel-clock/dht11/dht11-2024-12-05-23-08-38.png)  

> 这里其实我是做了电路设计的，如果你发现读取不到数据，可以尝试将模块VDD或者VCC接到开发板的5V看看。
> ![图 1](../../static/images/docs/diy/picxel-clock/dht11/dht11-2024-12-05-23-08-44.png)  



## 代码验证
---
代码编写完成之后，将ESP32S3开发板接入电脑下载代码，然后打开串口监视器查看现象。

> 下载步骤请参考👉[RTC时钟驱动](ds1302.md)章节的代码验证小节。


可以看到温湿度数据读取显示正常。

![图 2](../../static/images/docs/diy/picxel-clock/dht11/dht11-2024-12-05-23-09-58.png)  

>! 说明：如果你根据代码操作运行不起来，可以下载👉[例程](https://gitee.com/laoguaige/esp32-s3-r8-n8-pixel-clock/tree/master/example/dht11)看看

