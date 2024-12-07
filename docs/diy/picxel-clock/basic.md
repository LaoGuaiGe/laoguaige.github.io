---
title: ESP32S3像素时钟
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-05
    author: 老怪鸽
    version: 1.0.1
    content: 更新了基本文档
---


## 实物展示

![图 21](../../static/images/docs/diy/picxel-clock/basic/basic-2024-12-05-22-14-05.png)  

---

![图 22](../../static/images/docs/diy/picxel-clock/basic/basic-2024-12-05-22-14-25.png)  

---

![图 23](../../static/images/docs/diy/picxel-clock/basic/basic-2024-12-05-22-14-30.png)  

---

![图 24](../../static/images/docs/diy/picxel-clock/basic/basic-2024-12-05-22-14-35.png)  

## 介绍
基于立创·ESP32S3R8N8开发板制作的像素时钟。

## 软件架构
VSCode下的platformIO + arduino环境。 

## 器件清单
1. 1个 ESP32S3R8N8开发板
2. 1个 DHT11温湿度传感器
3. 1个 DS1302时钟模块
4. 1个 8*32大小WS2812彩灯矩阵
5. 1个 MAX4466 运算放大器/音频采集模块
6. 1个 按钮
7. 1个 SU-03T语音识别模块+配套的喇叭和麦克风（咪头）
8. 1个 振动小电机
9. 1个 光敏电阻+1K电阻

## 硬件连接

<div style="text-align:center;">
  <table style="margin:auto; width:100%">
  <tr>
    <td style="text-align:center"><strong>模块名称</strong></td>
    <td style="text-align:center">模块引脚</td>
    <td style="text-align:center">ESP32S3R8N8管脚</td>
  </tr>

  <tr>
    <td rowspan="2">DS1307</td>    
    <td>SDA</td> 
    <td>3</td> 
  </tr>
    
  <tr>
    <td style="text-align:center">SCL</td>
    <td style="text-align:center">2</td>
  </tr>
  
  <tr>
    <td>DHT11</td>    
    <td>OUT</td> 
    <td>4</td> 
  </tr>

  <tr>
    <td>WS2812</td>    
    <td>DIN</td> 
    <td>8</td> 
  </tr>   

  <tr>
    <td>MAX4466</td>    
    <td>OUT</td> 
    <td>1</td> 
  </tr>   

  <tr>
    <td>按钮</td>    
    <td>KEY</td> 
    <td>0</td> 
  </tr>  

  <tr>
    <td rowspan="2">SU-03T语音识别模块</td>    
    <td>B2</td> 
    <td>13</td> 
  </tr>
  <tr>
    <td style="text-align:center">B3</td>
    <td style="text-align:center">12</td>
  </tr>


  <tr>
    <td>振动电机（需要三极管驱动）</td>    
    <td>MOTOR</td> 
    <td>11</td> 
  </tr>  

  <tr>
    <td>光敏电阻（需要1k电阻分压）</td>    
    <td>light</td> 
    <td>5</td> 
  </tr>  

  <tr>
    <td rowspan="3">共用部分</td>    
    <td>3V3(MAX4466, DHT11, 光敏电阻, DS1302)</td> 
    <td>3V3</td> 
  </tr>
  <tr>
    <td style="text-align:center">5V (WS2812, SU-03T, 振动电机)</td>
    <td style="text-align:center">5V</td>
  </tr>
  <tr>
    <td style="text-align:center">GND(全部) </td>
    <td style="text-align:center">GND</td>
  </tr>
</table>
</div>

## 原理图

**V1.0.1版-原理图**

![图 25](../../static/images/docs/diy/picxel-clock/basic/basic-2024-12-05-22-15-00.png)  

## 待完善问题
1. 如果天气获取失败，应该显示获取失败。
2. 板子发热，大概是一直开启WIFI的问题。
3. WIFI配网没有好看的HTML界面，进入配网时像素时钟没有UI显示。
4. 亮度自动调节功能与天气界面的今明日切换的渐灭渐亮冲突了
   
## 部分代码参考

https://wokwi.com/projects/383363216212925441

https://gitee.com/adamhxx/arduino-open-source/tree/master/ESP32C3-CLOCK 

https://github.com/sf122458/ESP32C3-PixelClock

https://github.com/pfalcon/uzlib

## 更新时间

> 一次更新时间：2024-4-24

> 二次更新时间：2024-7-28 

> 三次更新时间：2024-8-7  
新增WIFI配网但是没有添加动画有BUG，配网的HTML界面没有完善

> 四次更新时间：2024-8-8
新增亮度自动调节功能，但是发现与天气界面的今明日切换的渐灭渐亮冲突了，有BUG

> 五次更新时间：2024-8-16
新增振动电机功能，初始化完振动一次，按下按键就振动一次。解决配网时会自动连接上一个wifi导致无法配网问题，删除自动连接wifi部分。发现无法进行第二次配网的BUG

> 六次更新时间：2024-8-24
新增语音识别功能，语音命令表见main.cpp文件的注释

> 七次更新时间：2024-8-31
新增语音识别例程和教程文档