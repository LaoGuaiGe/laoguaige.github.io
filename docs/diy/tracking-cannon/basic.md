---
title: 舰防炮介绍
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-05
    author: 老怪鸽
    version: 1.0.1
    content: 更新了基本文档
  - date: 2025-06-27
    author: 老怪鸽
    version: 1.0.2
    content: 更新了PID和滤波章节
---

## 项目背景

项目参考来源：

**【给玩具枪加装云台和人脸识别功能，实现目标自动识别锁定功能】 **

<iframe src="//player.bilibili.com/player.html?isOutside=true&aid=986378786&bvid=BV1at4y1c7kt&cid=858044263&p=1" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true" style="width:43vw;height:34vw;min-width: 85%;"></iframe>

原作者是采用的 `opencv` 作为识别方案，而 `opencv` 需要运行在电脑的操作系统上，不是很方便。而最近正好看到立创开发板的 `K230-AI` 开发板在找内测，有幸联系到并且参与其中。

将决定以 `K230` 为主要核心，控制二维舵机云台作为`运动装置`、板载摄像头识别物品功能作为`瞄准装置`、电动玩具枪作为`发射装置`等，以实现自动追踪炮台的功能。

## 硬件设计

### 硬件准备

1. **二维舵机云台**

    ![图 3](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-22-32-10.png)  
    地址：https://item.taobao.com/item.htm?_u=l2t4uge5db1c&id=560120308139
2. **电动玩具枪**
   
    ![图 2](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-22-31-08.png)  
    地址：https://item.taobao.com/item.htm?_u=l2t4uge530d9&id=684699922229

3. **K230-AI识别开发板**

    ![图 0](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-22-29-03.png)  
    地址：https://lckfb.com/project/detail/lckfb-lspi-k230-1g-canmv?param=baseInfo
  
4. **辅助工具**

    螺丝批套装、热胶枪、杜邦线等。


### 硬件连接

![图 4](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-22-54-53.png)  

电动玩具枪也是可以通过开关控制的，只需要通过继电器的方式，连接到GPIO上是可以控制开枪的，这里我因为没有买继电器所以我就先不画。

.. details::K230排针接口示意图，点击展开
    ![图 5](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-22-57-24.png)  


## 软件设计

K230的快速入门请参考：https://wiki.lckfb.com/zh-hans/lushan-pi-k230/quick-start.html

请按照上面的链接，完成开发板的组装、`CanMV` 固件烧录、电脑连接等操作。我在后面将不会介绍什么是 `IDE` ，以及如何连接。

### IDE显示图像

显示图像在K230的固件中一共支持4种，分别是 `HDMI` 的 `VGA` ， `HDMI` 的 `1080P` 、`LCD`、`IDE` 等。我们先了解怎么将摄像头采集到的画面显示在 `IDE` 的**图像缓冲区**。

根据 `K230` 资料的[Sensor例程讲解](https://developer.canaan-creative.com/k230_canmv/dev/zh/example/media/sensor.html) ，提取出 **摄像头的初始化** `+` **采集图像的代码**。

```py
# Camera 示例
import time
import os
import sys

from media.sensor import *
from media.display import *
from media.media import *

DETECT_WIDTH = 640
DETECT_HEIGHT = 480

sensor = None

try:
    # 配置摄像头的图像大小
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 摄像头传感器复位
    sensor.reset()
    # 设置图像是否镜像
    # sensor.set_hmirror(False)
    # 设置图像是否翻转
    # sensor.set_vflip(False)
    # 设置通道0的图像输出尺寸
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    #设置通道0输出格式为RGB565（彩色图像）
    sensor.set_pixformat(Sensor.RGB565)
    # Init媒体管理器
    MediaManager.init()
    # 传感器启动运行
    sensor.run()

    while True:
        sensor.snapshot() #获取一帧图像
        
except KeyboardInterrupt as e:
    print(f"user stop")
except BaseException as e:
    print(f"Exception '{e}'")
finally:
    # sensor stop run
    if isinstance(sensor, Sensor):
        sensor.stop()

    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)

    # release media buffer
    MediaManager.deinit()

```


根据[Display例程讲解](https://developer.canaan-creative.com/k230_canmv/dev/zh/example/media/display.html)，提取出将**图像显示到 `IDE` 上的代码**。

```python
import time, os, gc, sys, math

from media.sensor import *
from media.display import *
from media.media import *

DETECT_WIDTH = 640
DETECT_HEIGHT = 480

try:
    #配置图像显示方式为IDE显示，显示的宽高为DETECT_WIDTH+DETECT_HEIGHT，帧率100fps
    Display.init(Display.VIRT, width = DETECT_WIDTH, height = DETECT_HEIGHT, fps = 100)
    
    while True:
        Display.show_image(img) #显示一个图像，这个img是摄像头采集的一帧图像
        
except KeyboardInterrupt as e:
    print(f"user stop")
except BaseException as e:
    print(f"Exception '{e}'")
finally:
    # 清除显示缓存
    Display.deinit()

    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)
```


将这两个代码一整合，就得到了将图像显示到 `IDE` 中的代码：


```python
import time
import os
import sys

from media.sensor import *
from media.display import *
from media.media import *

DETECT_WIDTH = 640
DETECT_HEIGHT = 480

sensor = None

try:
    # 配置摄像头的图像大小
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 摄像头传感器复位
    sensor.reset()
    # 设置图像是否镜像
    # sensor.set_hmirror(False)
    # 设置图像是否翻转
    # sensor.set_vflip(False)
    # 设置通道0的图像输出尺寸
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    #设置通道0输出格式为RGB565（彩色图像）
    sensor.set_pixformat(Sensor.RGB565)
    #配置图像显示方式为IDE显示，显示的宽高为DETECT_WIDTH+DETECT_HEIGHT，帧率100fps
    Display.init(Display.VIRT, width = DETECT_WIDTH, height = DETECT_HEIGHT, fps = 100)
    # Init媒体管理器
    MediaManager.init()
    # 传感器启动运行
    sensor.run()

    while True:
       img = sensor.snapshot() #获取一帧图像
       Display.show_image(img) #显示摄像头采集的图像
        
except KeyboardInterrupt as e:
    print(f"user stop")
except BaseException as e:
    print(f"Exception '{e}'")
finally:
    # sensor stop run
    if isinstance(sensor, Sensor):
        sensor.stop()
    # deinit display
    Display.deinit()
    
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)

    # release media buffer
    MediaManager.deinit()
```

大家可以运行上面的例程看看，在 `CanMV IDE` 中会不会显示出K230开发板摄像头的画面。

### 颜色识别

K230是一个AI视觉芯片，根据官网资料可以知道，其可以通过摄像头识别出很多东西，比如人脸、形状、颜色、物品、水果等等，这里我比较熟练使用的是**颜色识别**，就先以颜色识别为例，获取指定颜色的目标方位。

而我们能够获取颜色的方位，那就可以根据官方例程推举出识别其他东西时，怎么获取对应识别目标的方位了。

根据  `canMV-K230 IDE` 自带的颜色识别例程，整理出关键的代码。

以下是颜色识别例程：

```python
# Find Blobs Example
#
# This example shows off how to find blobs in the image.
import time, os, gc, sys

from media.sensor import *
from media.display import *
from media.media import *

DETECT_WIDTH = ALIGN_UP(320, 16)
DETECT_HEIGHT = 240

sensor = None

def camera_init():
    global sensor

    # construct a Sensor object with default configure
    sensor = Sensor(width=DETECT_WIDTH,height=DETECT_HEIGHT)
    # sensor reset
    sensor.reset()
    # set hmirror
    # sensor.set_hmirror(False)
    # sensor vflip
    # sensor.set_vflip(False)

    # set chn0 output size
    sensor.set_framesize(width=DETECT_WIDTH,height=DETECT_HEIGHT)
    # set chn0 output format
    sensor.set_pixformat(Sensor.RGB565)
    # use IDE as display output
    Display.init(Display.VIRT, width= DETECT_WIDTH, height = DETECT_HEIGHT,fps=100,to_ide = True)
    # init media manager
    MediaManager.init()
    # sensor start run
    sensor.run()

def camera_deinit():
    global sensor
    # sensor stop run
    sensor.stop()
    # deinit display
    Display.deinit()
    # sleep
    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)
    # release media buffer
    MediaManager.deinit()

def capture_picture():

    fps = time.clock()
    while True:
        fps.tick()
        try:
            os.exitpoint()
            global sensor
            img = sensor.snapshot()#获取图像

            # 设置颜色阈值
            thresholds = [[0, 80, 40, 80, 10, 80]]      # 红色的阈值，这样代码就只识别红色
            # 从图像中查找颜色，根据阈值进行对比，当阈值一致时，将对应颜色的各个参数/位置等保存到blobs变量中
            blobs=img.find_blobs(thresholds ,pixels_threshold= 500)
            # 从blobs中遍历各个被识别到的阈值一样的颜色，将遍历到的颜色参数赋值给blob
            for blob in blobs:
                # 调用画矩形API，填入遍历到的颜色4个角的位置，设置矩形框的颜色为RGB的RG全色
                img.draw_rectangle(blob[0], blob[1], blob[2], blob[3], color = (255, 255, 0))

            # 显示图像
            Display.show_image(img)
            img = None

            gc.collect()
            print(fps.fps()) #输出帧率
        except KeyboardInterrupt as e:
            print("user stop: ", e)
            break
        except BaseException as e:
            print(f"Exception {e}")
            break

def main():
    os.exitpoint(os.EXITPOINT_ENABLE)
    camera_is_init = False
    try:
        print("camera init")
        camera_init()
        camera_is_init = True
        print("camera capture")
        capture_picture()
    except Exception as e:
        print(f"Exception {e}")
    finally:
        if camera_is_init:
            print("camera deinit")
            camera_deinit()

if __name__ == "__main__":
    main()

```

**分析：**

其实主要就是 [find_blobs](https://developer.canaan-creative.com/k230_canmv/dev/zh/api/openmv/image.html#find-blobs)  `API`，它会去图像中查找我们设置的阈值的颜色，找到 一个就记录起来成为一个对象，找到一个就记一个，然后我们就可以对该颜色对象为所欲为了。

但是这个例程还是有一点问题，也不能说是问题，只是不符合我们的要求，我们的要求是只识别一个颜色。毕竟我们只有一个炮台，识别再多个也只能打一个。那么问题来了，这个例程是会将图像中识别到的颜色都画框并记录，类似以下现象：（识别浅蓝色）

![图 6](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-23-09-37.png)  


图中的白色矩形框+白色十字就是表示的识别到的颜色。现在识别出了那么多个目标，我们只有一个炮口怎么办？**我们可以优先找到最大的，最近的一个开炮！**而在图像的世界里，在多个目标中，像素越多的，说明离摄像头越近！那就是最大的目标！

以下是在一堆识别到的图像中，找到最大像素的图像代码：**(只写关键的了)**

```python
# 拍摄一张图片
img = sensor.snapshot()

# 查找图像中满足红色阈值（red_threshold）的区域
blobs = img.find_blobs([red_threshold], pixels_threshold=200, area_threshold=200, merge=True)

# 如果找到了至少一个blob
if blobs:
    # 从blobs中找到最大像素点的blob
    largest_blob = max(blobs, key=lambda b: b.pixels())

    # 只对最大像素点的目标画框，框的颜色是RGB中的R（红色）
    img.draw_rectangle(largest_blob.rect(), color=(255, 0, 0))
    # 在框内画十字，标记中心点
    img.draw_cross(largest_blob.cx(), largest_blob.cy(), color=(255, 0, 0))
   
    # 将位置和宽高格式化为字符串
    wz = "x={}, y={}, w={}, h={}".format(x_offset, y_offset, largest_blob.w(), largest_blob.h())
    
    # 图像上显示位置和宽高信息的字符串，字符的大小是32
    img.draw_string_advanced(0,0,32,wz)
```

> 上面代码中的阈值注释虽然是红色阈值，但是我实际上用的是绿色的阈值


现在我们就已经完成了目标定位的任务了，上面的代码中找到了最大像素的目标，并且输出它对于摄像头图像大小的X轴Y轴位置。

![图 7](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-23-09-46.png)  


我还加了一些辅助内容，比如给图像的中心画一个绿色的十字。其他内容具体看源码 `main.py`。


### 舵机控制

舵机控制的基本原理，参考该博主的文章：[舵机篇（一）舵机原理](https://blog.csdn.net/weixin_38288325/article/details/132366604?fromshare=blogdetail&sharetype=blogdetail&sharerId=132366604&sharerefer=PC&sharesource=qq_51930953&sharefrom=from_link)

舵机控制简单来说，就是输入一个20ms周期的PWM给他，通过调整高电平占空比实现舵机的旋转。

> 频率等于周期的倒数，所以 `20ms`  周期 = `1 / 20`  = `50 Hz`  频率

在庐山派K230开发板引出的PWM中，PWM只有5个，分别是PWM0~PWM4。只有特定的引脚支持PWM功能，具体见下图：

![图 5](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-22-57-24.png)  

在我们的舵机案例中，使用的是 `GPIO46` 、 `GPIO47` 上的，`PWM2` 和 `PWM3`。

在代码中初始化PWM参数如果下：

> 配置方法具体说明，请参考立创开发板wiki：[庐山派开发板资料-PWM](https://wiki.lckfb.com/zh-hans/lushan-pi-k230/basic/pwm.html)

```python
from machine import PWM, FPIOA, Pin

# 配置排针引脚号12，芯片引脚号为47的排针复用为PWM通道3输出
pwm_io1 = FPIOA()
pwm_io1.set_function(47, FPIOA.PWM3)
# 初始化PWM参数
pwm_ud = PWM(3, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 3~12

# 配置排针引脚号32，芯片引脚号为46的排针复用为PWM通道2输出
pwm_io2 = FPIOA()
pwm_io2.set_function(46, FPIOA.PWM2)
# 初始化PWM参数
pwm_lr = PWM(2, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 2~13

pwm_lr.duty(7.5)    #旋转到中间
pwm_ud.duty(7.7)    #旋转到中间

```

在案例中，我将左右旋转的舵机命名为  `pwm_lr`  ，上下旋转的舵机命名为  `pwm_ud`  。

在上面的案例中还有一个地方需要说明，我为了让舵机一上电就默认旋转到中间，设置了两个舵机动作：

```python
pwm_lr.duty(7.5)    #旋转到中间
pwm_ud.duty(7.7)    #旋转到中间
```

这里的 `7.5` 指的是占空比的百分比，即7.5%的高电平占空比。我们来求一下，为什么7.5是中间。我们现在知道了以下参数：

* PWM周期为 `20 ms`
* PWM频率为 `50 Hz`
* 高电平的占空比为 `7.5%`

求我们当前旋转的角度。

根据180度旋转的舵机控制原理，可以知道舵机旋转角度和周期的关系如下图：

![图 8](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-21-23-39-34.png)  

我们只要控制在20ms的周期内的高电平时间，就可以控制舵机的旋转角度。

那么获取高电平时间公式如下：

<center> 高电平时间 = PWM周期 × 占空比 </center> 

参照之前的参数 带入得到：

<center> 高电平时间 = 20 ms × 0.075（7.5%） </center> 

高电平的时间是 `1.5` 毫秒 。

而 `1.5 ms` 就是控制舵机旋转到0度。所以代码中设置 `7.5%` 的占空比就是让舵机旋转到中间（舵机最左是-90度，中间是0度，最右是90度）。

而上下旋转的舵机占空比，我设置为了7.7%，这个是我的测试值，测试出来的舵机旋转比较接近中间的值，大家自行测试。

---

现在180度的舵机，我们将其分成为 `-90~90度` 的范围。我们还要知道3个参数：

1. 最大角度 `90度` 时我们要设置多少占空比；

2. 最小角度 `-90度` 时我们要设置多少占空比；

3. 中间角度 `0度` 时我们要设置多少占空比；

经过我自己实测，上下动作的舵机占空比范围是 `2.5~12.5%` 的占空比，`2.5% `占空比时角度最小，`12.5%` 占空比时角度最大，`7.5%` 占空比时角度居中。

> **为什么不直接用理论值计算？而是要手动测试呢？**
> 这个是因为舵机云台结构的原因，比如上下旋转的舵机我们设置旋转为了0度，但是因为结构上的原因，舵机转不到0度，它被结构框体卡死了，这个就是赌死现象：没有转到0度，舵机就一直转。
> 为了防止堵死的现象出现，就需要我们手动测试一个安全的旋转范围。


这里以Y轴举例(Y轴就是上下旋转的舵机)，现在Y轴的范围在摄像头采集的图像中是 `0 ~ 479` 个像素，屏幕的中心值就是 `480/2=240` ，而Y轴的范围是从 `0` 开始的，所以我们得减一，屏幕的中心值就是 `239` 。我们以屏幕中心为参考，

**当Y轴的值小于239时**，我们就判断识别物体是上方；

**当Y轴的值大于239时**，我们就判断识别物体是下方；

**当Y轴的值等于239时**，我们就判断识别的物体是Y轴中心；

![图 9](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-22-00-00-10.png)  


我个人觉得全部是正数的范围，不方便我们去处理舵机，0 ~ 238是上方，239是中间，240 ~ 379是下方，这样不好带入到我们后面的舵机控制中。为了更加方便我自己，我将其Y轴范围修改如下：

| 数值范围 | 说明 |
| :---: | :---: |
| -239~0 | 上方 |
| 0 | 中间 |
| 0~239 | 下方 |

这样分布后我们就知道负数是上，正数是下，我们要让舵机尽量往中间（就是0的位置）移动。

实现的代码：
> 实现了X轴和Y轴距离中心的位置反馈

```python
# 如果找到了至少一个blob
if blobs:
    # 找到最大的blob
    largest_blob = max(blobs, key=lambda b: b.pixels())

    # 画框
    img.draw_rectangle(largest_blob.rect(), color=(255, 0, 0))
    # 在框内画十字，标记中心点
    img.draw_cross(largest_blob.cx(), largest_blob.cy(), color=(255, 0, 0))

    # 计算相对于屏幕中心的X轴和Y轴的偏移量
    x_offset = largest_blob.cx() - img.width() // 2
    y_offset = largest_blob.cy() - img.height() // 2

    # 屏幕显示位置信息和像素大小，包含正负号
    wz = "x={}, y={}, w={}, h={}".format(x_offset, y_offset, largest_blob.w(), largest_blob.h())
    img.draw_string_advanced(0,0,32,wz)
```

>! **接下来我们来考虑一个问题：如何将Y轴的数值反馈给舵机让它按照我们设置的方向动作？**

接下来了解一下我的想法，我们要让舵机往Y轴的中心 0 去动作。

当识别物体Y轴为-239 ~ 0时，我们让舵机向下，直到识别物体Y轴的数值为0；
当识别物体Y轴为0 ~ 239 时，我们让舵机向上，直到识别物体Y轴的数值为0；

**现在这个Y轴就是舵机角度与目标方位的误差！我们要让误差尽量保持为0！** 

首先是考虑如何解决数值不对等问题。舵机的范围是 `2.5 ~ 12.5`，Y轴的范围是 `-239 ~ +239` ，我们要将Y轴的数值压缩到 `2.5 ~ 12.5` 的范围。可以通过以下代码实现：

```python
# DETECT_WIDTH = 640
# DETECT_HEIGHT = 480
# min_duty = 2.5      #最小占空比
# max_duty = 12.5     #最大占空比
## 将Y轴偏移数值转换为占空比的函数
def input_to_duty_cycle(input_min, input_max, input_value):
    # 定义输入输出范围
#    input_min = -(DETECT_HEIGHT // 2)
#    input_max = (DETECT_HEIGHT // 2)
    output_min = min_duty
    output_max = max_duty
    
    # 检查输入是否越界
    if input_value < input_min or input_value > input_max:
        raise ValueError(f"输入值必须在 {input_min} 和 {input_max} 之间")
    
    # 计算线性映射公式
    slope = (output_max - output_min) / (input_max - input_min)
    output_value = output_min + (input_value - input_min) * slope
    
    return output_value
```

现在解决了这个数值不对等问题，舵机的居中角度是 `7.5`，当识别物体在上方时，舵机的数值输出小于 `7.5` ; 当识别物体在下方时，舵机的数值输出大于7.5;

完整代码：

```python
import time, os, gc, sys, math,utime
from machine import PWM, FPIOA, Pin, UART
from media.sensor import *
from media.display import *
from media.media import *
from pid import PID

DETECT_WIDTH = 640
DETECT_HEIGHT = 480

sensor = None

###############################舵机配置#####################################################
# 2.5 = -90度 7.5 = 0度 12.5 = 90度
min_duty = 2.5      #最小占空比
max_duty = 12.5     #最大占空比
mid_duty = 7.5      # 中间值，对应于0度
pwm_lr = None

# 配置排针引脚号12，芯片引脚号为47的排针复用为PWM通道3输出
pwm_io1 = FPIOA()
pwm_io1.set_function(47, FPIOA.PWM3)
# 初始化PWM参数
pwm_ud = PWM(3, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 3~12

# 配置排针引脚号32，芯片引脚号为46的排针复用为PWM通道2输出
pwm_io2 = FPIOA()
pwm_io2.set_function(46, FPIOA.PWM2)
# 初始化PWM参数
pwm_lr = PWM(2, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 2~13

pwm_lr.duty(7.5)    #旋转到中间
pwm_ud.duty(7.7)    #旋转到中间
##########################################################################################

## 将Y轴偏移数值转换为占空比的函数
def input_to_duty_cycle(input_min, input_max, input_value):
    # 定义输入输出范围
#    input_min = -(DETECT_HEIGHT // 2)
#    input_max = (DETECT_HEIGHT // 2)
    output_min = min_duty
    output_max = max_duty
    
    # 检查输入是否越界
    if input_value < input_min or input_value > input_max:
        raise ValueError(f"输入值必须在 {input_min} 和 {input_max} 之间")
    
    # 计算线性映射公式
    slope = (output_max - output_min) / (input_max - input_min)
    output_value = output_min + (input_value - input_min) * slope
    
    return output_value
    
try:
    # 初始化摄像头
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 传感器复位
    sensor.reset()
    # 开启镜像
    sensor.set_hmirror(True)#False
    # sensor vflip
    sensor.set_vflip(True)#False True
    # 设置图像一帧的大小
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 设置图像输出格式为彩色的RGB565
    sensor.set_pixformat(Sensor.RGB565)
    # 使用IDE显示图像
    Display.init(Display.VIRT, width = DETECT_WIDTH, height = DETECT_HEIGHT, fps = 100)
    # 初始化媒体管理器
    MediaManager.init()
    # 摄像头传感器开启运行
    sensor.run()

    # 定义要识别颜色的阈值，这里需要根据你的具体情况调整
    # 你可以通过尝试不同的阈值来找到最适合你的物体颜色值
    red_threshold = (0, 42, 17, 94, -6, 50)

    while True:
        # 拍摄一张图片
        img = sensor.snapshot()
        # 查找图像中满足红色阈值的区域
        blobs = img.find_blobs([red_threshold], pixels_threshold=200, area_threshold=200, merge=True)

        # 如果找到了至少一个blob
        if blobs:
            # 找到最大的blob
            largest_blob = max(blobs, key=lambda b: b.pixels())
            # 画框
            img.draw_rectangle(largest_blob.rect(), color=(255, 0, 0))
            # 在框内画十字，标记中心点
            img.draw_cross(largest_blob.cx(), largest_blob.cy(), color=(255, 0, 0))

            # 计算相对于屏幕中心的X轴和Y轴的偏移量
            x_offset = largest_blob.cx() - img.width() // 2
            y_offset = largest_blob.cy() - img.height() // 2

            # 屏幕显示位置信息和像素大小，包含正负号
            wz = "x={}, y={}, w={}, h={}".format(x_offset, y_offset, largest_blob.w(), largest_blob.h())
            img.draw_string_advanced(0,0,32,wz)

            duty_ud_value = input_to_duty_cycle(-(DETECT_HEIGHT // 2), (DETECT_HEIGHT // 2), y_offset)
            print(duty_ud_value)
        # 中心画十字
        img.draw_cross(img.width() // 2, img.height() // 2, color=(0, 255, 0), size=10, thickness=3)
        # IDE显示图片
        Display.show_image(img)

except KeyboardInterrupt as e:
    print(f"user stop")
except BaseException as e:
    print(f"Exception {e}")
finally:
    # sensor stop run
    if isinstance(sensor, Sensor):
        sensor.stop()
    # deinit display
    Display.deinit()

    if isinstance(pwm_lr, PWM):
        pwm_lr.deinit()

    # release media buffer
    MediaManager.deinit()

    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)
```


![图 9](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-22-53-07.gif)  


如果我们将摄像头固定在舵机上，舵机移动的时候，我们的摄像头也移动。那按照想法就是屏幕跟舵机一起动，这样就能够稳定的固定到中心，实现了识别瞄准功能。

将这个代码直接应用到舵机上的效果:

GIF动图（没有PID的直接控制）
![图 15](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-03-47.gif)  



### PID自动控制

大家根据上面的舵机控制章节，应该是可以实现最简单的舵机追踪功能，但是大家会发现有不稳定或者抖动的现象，比如我举一些例子：

1. 当识别目标快速运动时，舵机的运动速度不会跟着识别目标的速度而进行变化，一直保持一个速度；
2. 超调现象。误差已经到0了，但是因为舵机的旋转惯性，（假设的，实际的舵机速度一直不变惯性很小）导致会超出0误差，比如-1 -> 0 -> 1，因为惯性从0到1了，又从 1 -> 0 -> -1，导致怎么都不能正常的误差为0，舵机一直抖。

这个时候我们就要了解一个最常用的控制算法：**PID算法**。

---

#### PID介绍

PID控制器，即比例-积分-微分控制器，是一种广泛应用于工业控制系统中的**反馈回路控制器**。它通过控制系统的偏差（设定值与实际值之间的差）来调节控制变量，使得系统达到或维持在一个预定的状态。PID控制器由三个基本控制动作组成：`比例（Proportional）`、`积分（Integral）` 和 `微分（Derivative）` ，下面详细介绍这三个部分：

**比例（P）控制**
比例控制的作用是根据设定值与实际值之间的误差（e），进行比例放大后作为控制输出。其数学表达式为：

<center> P = Kp * e </center>

其中，`Kp` 是比例增益，决定了比例控制的强度。比例控制的特点是动作快速直接，**但通常会存在一个稳态误差，即系统稳定后，输出值与设定值之间仍会有一定的差距。**

.. details::误差的说明，点击展开
    根据设定值与实际值之间的误差（e），应该很好理解 ，我们之前的舵机控制章节就说明了误差的概念，尽可能的让误差为0。
    实际值就是摄像头识别物体的方位；
    设定值就是摄像头采集的图像中心；
    我们要让图像中心接近物体方位。让它们的误差越来越小，直到为0。

.. details::稳态误差的说明，点击展开
    即系统稳定后，输出值与设定值之间仍会有一定的差距。就是误差值明明是0了，但是实际上却是在1~2之间徘徊，就是到不了0。



**积分（I）控制**
积分控制的作用是对偏差进行积分运算，**以消除稳态误差**。积分作用考虑了误差的历史累积，其数学表达式为

<center> 

![图 12](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-22-00-35-56.png)  

</center>

> 你也可以这么看这个参数：I = Ki * e的历史累积  

其中，`Ki` 是积分增益。积分控制能够消除稳态误差，**但可能会引起系统的响应速度变慢，并且可能造成系统的超调和振荡。**



.. details::超调和振荡的说明，点击展开
	**超调** 意味着系统输出超过了设定值，比如你的舵机值设定范围是`2.5~12.5%` ，但是PID计算的结果超过了12.5，变成15？20？100？或者更高，这个是严重的问题；
    **振荡** 则是指系统在设定值附近反复波动，就是猛过头了，反应过激，刹车不了。





**微分（D）控制**
微分控制的作用是根据误差变化的速率（即偏差的微分）来进行控制，以预测误差的未来趋势。微分作用的数学表达式为：

<center> 

![图 11](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-22-00-35-06.png)  

</center>

其中，`Kd` 是微分增益。微分控制有助于减少系统的超调和振荡，提高系统的动态性能，**但它对噪声敏感，可能会放大控制信号中的噪声。**



.. details::噪声的说明，点击展开
    噪声就是干扰，我们用电机速度PID做一个例子，当前我们速度为0，我们设置目标速度为10，通过PID的计算，电机旋转速度会逐渐接近10，这个时候你去手动干预它，让电机不能转，这个就是干扰，你干扰了电机的运动，电机的速度变慢了，导致PID的误差在时间上一直越来越大，那么PID为了让电机速度更快接近目标，PID计算的值就越来越大，电机的旋转力度就越来越大，直到挣脱你的束缚。那对噪声敏感，表示的就是你干扰了一下，PID就崩溃了，对噪声产生过大的反应，导致控制输出不稳定。



**PID控制器的基本形式**

将上述三个控制作用结合起来，PID控制器的理论基本形式可以表示为：

<center> 

![图 13](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-22-00-37-48.png)  

</center>

其中 `u(t)` 是控制器的输出，`e(t)` 是在时间t时的偏差。通过PID我们就能够让舵机动作的更加快速，稳定的到达我们设置的目标位置。

#### PID公式转为代码
上面的原理部分大家看看就可以了，我们从实际应用入手。首先将以上PID数学公式转化为代码公式：

```python
out = (Kp * p) + (Ki * i) + (Kd * d)
```

整理参数，参数分为静态参数和动态参数：

```python
#静态参数
Kp = 0
Ki = 0
Kd = 0
#动态参数
i = 0			#积分I
e = 0			#当前误差
last_e = 0		#之前误差
max_out = 0		#最大输出

```

将代码公式一一拆分，得到下面的PID的计算函数：

```PYTHON
 def pid_calc(reference, feedback):#reference=目标位置	feedback=当前位置
        last_e = e  #更新之前的误差
        e = reference - feedback #通过当前值和目标值计算获取新的误差

        #计算比例P
        p = e * Kp

        #计算积分I
        i += e * Ki

        #计算微分D
        d = (e - last_e) * Kd
        
        #计算PID输出
        out = p + i + d

        #输出限制
        if out > max_out:
            out =   max_out
        elif out < -max_out:
            out = -max_out

        return out
```

> ! 注意，PID计算是要实时的，请确保PID的计算不会被阻塞太久；积分`I`是累加的，必须是全局变量；

现在PID部分的代码基本完成了，接下来是最重要的如何使用PID。我将PID的代码给封装成为了一个库文件上传到K230里面。

```python
class PID:
    def __init__(self, kp, ki, kd, maxI, maxOut):
        #静态参数
        self.kp = kp
        self.ki = ki
        self.kd = kd
        #动态参数
        self.change_p = 0
        self.change_i = 0
        self.change_d = 0

        self.max_change_i = maxI    #积分限幅
        self.maxOutput = maxOut     #输出限幅

        self.error_sum = 0  #当前误差
        self.last_error = 0 #之前误差

    def change_zero(self):#PID变化累计的参数清零
        self.change_p = 0
        self.change_i = 0
        self.change_d = 0

    def pid_calc(self, reference, feedback):#reference=目标位置	feedback=当前位置
        self.last_error = self.error_sum
        self.error_sum = reference - feedback #获取新的误差

        #计算微分
        dout = (self.error_sum - self.last_error) * self.kd

        #计算比例
        pout = self.error_sum * self.kp

        #计算积分
        self.change_i += self.error_sum * self.ki

        #积分限幅
        if self.change_i > self.max_change_i :
            self.change_i = self.max_change_i
        elif self.change_i < -self.max_change_i:
            self.change_i = -self.max_change_i

        #计算输出
        self.output = pout + dout + self.change_i

        #输出限幅
        if self.output > self.maxOutput:
            self.output =   self.maxOutput
        elif self.output < -self.maxOutput:
            self.output = -self.maxOutput

        return self.output
```

将上面的代码保存，并且对整个文件命名为 pid.py，完成后上传到K230的sdcard文件夹里面。

![图 16](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-08-12.png)  

接下来是如何使用这个库。在我们的main.py代码中，引入该文件：
```python
from pid import PID
```

然后创建 PID 对象，并对其静态参数进行设置：

```python
lr_kp = 0.013
lr_ki = 0.0008
lr_kd = 0.016
lr_max_out = 12.5 #最大输出
pid_lr = PID(lr_kp, lr_ki, lr_kd, 10, lr_max_out) #创建左右电机的PID对象

ud_kp = 0.013
ud_ki = 0.00091
ud_kd = 0.02
ud_max_out = 12.5 #最大输出
pid_ud = PID(ud_kp, ud_ki, ud_kd, 10, ud_max_out) #创建上下电机的PID对象
```

创建 PID 对象后，应用到我们的舵机动作代码中，我将关键代码取出分析：

```python
# 如果找到了至少一个目标色块
        if blobs:
            # 找到最大的目标色块
            largest_blob = max(blobs, key=lambda b: b.pixels())

            # 给目标色块画框标记出来
            img.draw_rectangle(largest_blob.rect(), color=(255, 0, 0))
            # 在标记框内画十字，标记中心点
            img.draw_cross(largest_blob.cx(), largest_blob.cy(), color=(255, 0, 0))

            # 计算目标色块相对于屏幕中心的X轴和Y轴的偏移量
            x_offset = largest_blob.cx() - img.width() // 2
            y_offset = largest_blob.cy() - img.height() // 2

            # 在屏幕显示目标色块的位置信息和像素大小，包含正负号
            wz = "x={}, y={}, w={}, h={}".format(x_offset, y_offset, largest_blob.w(), largest_blob.h())
         	# 显示字符串
            img.draw_string_advanced(0,0,32,wz)

            # 根据中心偏移量计算PWM的PID
            # 0为目标值，x_offset表示当前设定值
            pid_lr_value = pid_lr.pid_calc(0,x_offset)
            pid_ud_value = pid_ud.pid_calc(0,y_offset)
			''' 关键点一 '''
            # 将PID值转换为舵机的范围并且输出实际的占空比
            duty_lr_value = input_to_duty_cycle(pid_lr_value)
            duty_ud_value = input_to_duty_cycle(pid_ud_value)
			''' 关键点二 '''
            # 根据计算后的占空比控制舵机动作
            #pwm_lr.duty(duty_lr_value)
            #pwm_ud.duty(duty_ud_value)
```

> lr表示左右旋转的舵机，ud表示上下旋转的舵机。

大家可以在上面的代码中看到 **关键点一** 和 **关键点二** 的注释，在关键点一的位置可以通过`print`输出一下`PID`计算后的值`pid_lr_value`；在关键点二的位置输出实际占空比值`duty_lr_value`。

```python
print(f"pid_lr_value={pid_lr_value}, pid_ud_value={pid_ud_value}\r\n")
print(f"duty_lr_value={duty_lr_value}, duty_ud_value={duty_ud_value}\r\n")
```
![图 17](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-18-34.gif)  

#### PID调参

当大家取消舵机动作的注释并下载执行后，会发现这个PID的效果并不理想，有的反应慢，有的反应快，有的基本没有动。这个是因为我们没有调好PID。

![图 19](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-36-26.gif)  

那如何调整好PID的参数呢？

在实际应用中，需要对PID控制器的参数 `Kp \ Ki \ Kd` 进行调整，以达到理想的控制效果。这通常通过以下步骤进行：

*  **先设定比例增益 `Kp`** ：使系统响应快速，但可能会出现稳态误差。
*  **调整积分增益 `Ki`** ：消除稳态误差，但要注意超调和振荡。
*  **最后调整微分增益 `Kd`** ：改善系统的动态行为，减少超调和振荡。

我调试 PID 是通过串口 和 [Vofa+工具](https://www.vofa.plus/)。Vofa+是一款上位机工具，我个人认为目前对这个项目来说最大的作用是显示出数据波形变化。

<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-23-55.png" width="1200"></th>
  </tr>
  <tr>
      <th><center>Vofa+ 上位机界面</center></th>
  </tr>  
</thead>
</table>


目前我还不知道K230的单步调试手段，所以只能盲调PID：设置一个P\I\D值，然后看PID输出的数据曲线和目标数据曲线的差别。如果误差很大，则重新设置一个P\I\D值继续调到误差小为止。

当然，如果有时间和精力，也可以自己写一套通过串口调整参数的代码。

**硬件连接**

> 图中的这个带金边的模块是CH340的USB转串口模块，是很常用的东西了。这个因为没有找到更好的实物图，就找了这个，现在这个图模块上的RXD和TXD接到一起了，实际连接的时候是**不要短接在一起的，** 切记。

![图 20](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-38-08.png)  

我们通过下面的代码测试一下k230的串口发送功能 和 vofa+的使用：

> K230的串口知识和使用方法，参考立创开发板的[庐山派串口章节教程](https://wiki.lckfb.com/zh-hans/lushan-pi-k230/basic/uart.html)

```python
from machine import UART
from machine import FPIOA

# 配置引脚
fpioa = FPIOA()
fpioa.set_function(5, FPIOA.UART2_TXD)
fpioa.set_function(6, FPIOA.UART2_RXD)

# 初始化UART2，波特率115200，8位数据位，无校验，1位停止位
uart = UART(UART.UART2, baudrate=115200, bits=UART.EIGHTBITS, parity=UART.PARITY_NONE, stop=UART.STOPBITS_ONE)

# 要发送的字符串
message = "Hello,LuShan-Pi!\r\n"

# 通过UART发送数据
uart.write(message)

# 释放UART资源
uart.deinit() 
```
效果图：
![图 21](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-39-15.png)

#### Vofa+的使用

这里就介绍Vofa+的数据接收协议 和 波形的显示方法。

**接收协议**

比较常用的是 FireWater协议，其协议格式如下：
```txt
<any>:ch0,ch1,ch2,...,chN\n
```

参数说明：

| 元素 | 描述  |
| -- | --  |
| **\<any\>** |  表示数据名称，可以自定义|
|  **:** | 必须加英文冒号，不然解析不了数据，就不会显示在Vofa+上。|
| **ch0~chN** | ch表示通道数据，0~N表示是第几个通道的数据。比如我要发送两个浮点数据（float）到vofa+显示波形，分别是1.2 和 21.4。那么就可以写为 `float:1.2,21.4\n`，这样就可以显示两个数据。|
|  **,** |  表示每一个数据之间的间隔|
|  **\n** | 结尾必须加\n，不然解析不了数据，就不会显示在Vofa+上。|


示例：
```c
float:1.2,21.4\n
temp:25.3\n
sensor:0.5,1.7,3.2\n
```

>! **关键注意事项**
>! 1. ​**​冒号不能省略​**​：数据名称后必须立即跟英文冒号（`:`）
>! 2. ​**​逗号分隔数据​**​：多个数值必须用英文逗号（`,`）分隔
>! 3. ​**​结尾必须有`\n`​**​：换行符是数据结束的强制标记
>! 4. ​**​通道顺序​**​：数据值的顺序对应通道索引（第一个值=ch0，第二个值=ch1，以此类推）

<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-46-26.png" width="1200"></th>
  </tr>
  <tr>
      <th><center>Vofa+ 上关于 FireWater 协议的描述</center></th>
  </tr>  
</thead>
</table>

#### 波形显示

在 Vofa+ 的左侧边栏找控件，将波形图控件拉出到放置区即可。

<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-47-31.png" width="1200"></th>
  </tr>
  <tr>
      <th><center>放置波形图控件</center></th>
  </tr>  
</thead>
</table>

我们可以通过 Vofa+ 本身自己带的 Demo 数据测试能不能显示出波形。

不过 Vofa+ 接收到数据后，还不能马上显示在波形图上，还需要我们配置波形的输入数据。

<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-49-46.png" width="600"></th>
	  <th><img src="../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-49-21.png" width="600"></th>
  </tr>
  <tr>
      <th><center>放大波形画面</center></th>
	  <th><center>设置波形的输入显示数据</center></th>
  </tr>  
</thead>
</table>

不出意外的话，你应该会显示下面的画面：

> 5个通道的数据，不断更新就可以得到波形。

<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-26-23-53-08.png" width="1200"></th>
  </tr>
  <tr>
      <th><center>波形显示画面</center></th>
  </tr>  
</thead>
</table>

现在各位就可以自行调试你的PID啦。

#### 加PID后的效果及代码
如果你发现你往左，而舵机往右，说明极性反了，让参数变成负数即可。

如果你发现响应速度慢，那就加大 Kp 值。

如果你发现，图像的中心跟目标的中心始终有误差，那你就加大 Ki 值；如果舵机一直在目标位置反复横跳抖动，那你就减小 Ki 值。

如果你想实现了PID的基本快速追踪，想让它更快，那就调整 Kd 值。


这个是我的调试结果：

![图 27](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-27-00-27-29.gif)  

实现这个效果的代码：

```python 
import time, os, gc, sys, math,utime
from machine import PWM, FPIOA, Pin, UART
from media.sensor import *
from media.display import *
from media.media import *
from pid import PID

DETECT_WIDTH = 640
DETECT_HEIGHT = 480

sensor = None

###############################舵机配置#####################################################
# 2.5 = -90度 7.5 = 0度 12.5 = 90度
min_duty = 2.5      #最小占空比
max_duty = 12.5     #最大占空比
mid_duty = 7.5      # 中间值，对应于0度
pwm_lr = None

# 配置排针引脚号12，芯片引脚号为47的排针复用为PWM通道3输出
pwm_io1 = FPIOA()
pwm_io1.set_function(47, FPIOA.PWM3)
# 初始化PWM参数
pwm_ud = PWM(3, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 3~12

# 配置排针引脚号32，芯片引脚号为46的排针复用为PWM通道2输出
pwm_io2 = FPIOA()
pwm_io2.set_function(46, FPIOA.PWM2)
# 初始化PWM参数
pwm_lr = PWM(2, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 2~13

pwm_lr.duty(7.5)    #旋转到中间
pwm_ud.duty(4)    #旋转到中间
##########################################################################################

###############################PID配置#####################################################
lr_kp = 0.17
lr_ki = 0.016
lr_kd = 0
lr_max_out = DETECT_WIDTH//2		#PID最大输出
pid_lr = PID(lr_kp, lr_ki, lr_kd, lr_max_out, lr_max_out)

ud_kp = 0.17
ud_ki = 0.016
ud_kd = 0
ud_max_out = DETECT_HEIGHT//2		#PID最大输出
pid_ud = PID(ud_kp, ud_ki, ud_kd, ud_max_out, ud_max_out)
##########################################################################################

## 将Y轴偏移数值转换为占空比的函数
def input_to_duty_cycle(input_min, input_max, input_value):
    # 定义输入输出范围
#    input_min = -(DETECT_HEIGHT // 2)
#    input_max = (DETECT_HEIGHT // 2)
    output_min = min_duty
    output_max = max_duty
    
    # 检查输入是否越界
    if input_value < input_min or input_value > input_max:
        raise ValueError(f"输入值必须在 {input_min} 和 {input_max} 之间")
    
    # 计算线性映射公式
    slope = (output_max - output_min) / (input_max - input_min)
    output_value = output_min + (input_value - input_min) * slope
    
    return output_value
    
try:
    # 初始化摄像头
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 传感器复位
    sensor.reset()
    # 开启镜像
    sensor.set_hmirror(True)#False
    # sensor vflip
    sensor.set_vflip(True)#False True
    # 设置图像一帧的大小
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 设置图像输出格式为彩色的RGB565
    sensor.set_pixformat(Sensor.RGB565)
    # 使用IDE显示图像
    Display.init(Display.VIRT, width = DETECT_WIDTH, height = DETECT_HEIGHT, fps = 100)
    # 初始化媒体管理器
    MediaManager.init()
    # 摄像头传感器开启运行
    sensor.run()

    # 定义要识别颜色的阈值，这里需要根据你的具体情况调整
    # 你可以通过尝试不同的阈值来找到最适合你的物体颜色值
    red_threshold = (0, 42, 17, 94, -6, 50)

    while True:
        # 拍摄一张图片
        img = sensor.snapshot()
        # 查找图像中满足红色阈值的区域
        blobs = img.find_blobs([red_threshold], pixels_threshold=200, area_threshold=200, merge=True)

        # 如果找到了至少一个blob
        if blobs:
            # 找到最大的blob
            largest_blob = max(blobs, key=lambda b: b.pixels())
            # 画框
            img.draw_rectangle(largest_blob.rect(), color=(255, 0, 0))
            # 在框内画十字，标记中心点
            img.draw_cross(largest_blob.cx(), largest_blob.cy(), color=(255, 0, 0))

            # 计算相对于屏幕中心的X轴和Y轴的偏移量
            x_offset = largest_blob.cx() - img.width() // 2
            y_offset = largest_blob.cy() - img.height() // 2

            # 屏幕显示位置信息和像素大小，包含正负号
            wz = "x={}, y={}, w={}, h={}".format(x_offset, y_offset, largest_blob.w(), largest_blob.h())
            img.draw_string_advanced(0,0,32,wz)

            # 根据中心偏移量计算PWM的PID
            # 0为目标值，x_offset表示当前设定值
            pid_lr_value = pid_lr.pid_calc(0,x_offset)
            pid_ud_value = pid_ud.pid_calc(0,y_offset)
            ''' 关键点一 '''
            # 将PID值转换为舵机的范围并且输出实际的占空比
            duty_lr_value = input_to_duty_cycle(-(DETECT_WIDTH // 2), (DETECT_WIDTH // 2), pid_lr_value)
            duty_ud_value = input_to_duty_cycle(-(DETECT_HEIGHT // 2), (DETECT_HEIGHT // 2), pid_ud_value)
            print(f"pid_lr_value={pid_lr_value}, pid_ud_value={pid_ud_value}\r\n")
            print(f"duty_lr_value={duty_lr_value}, duty_ud_value={duty_ud_value}\r\n")
            ''' 关键点二 '''
            # 根据计算后的占空比控制舵机动作
            pwm_lr.duty(duty_lr_value)
            pwm_ud.duty(duty_ud_value)
        # 中心画十字
        img.draw_cross(img.width() // 2, img.height() // 2, color=(0, 255, 0), size=10, thickness=3)
        # IDE显示图片
        Display.show_image(img)

except KeyboardInterrupt as e:
    print(f"user stop")
except BaseException as e:
    print(f"Exception &#039;{e}&#039;")
finally:
    # sensor stop run
    if isinstance(sensor, Sensor):
        sensor.stop()
    # deinit display
    Display.deinit()

    if isinstance(pwm_lr, PWM):
        pwm_lr.deinit()

    # release media buffer
    MediaManager.deinit()

    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)
```


### 数据滤波

相信大家在调试的时候，会发现识别物体的中心位置跳变非常频繁，识别的物体明明根本没有动，但是因为识别代码的问题，识别的位置一直在变动，有时候变动小，有时候变动大。这个变动会影响到我们的PID计算，导致舵机不稳定：识别到物体后，明明舵机已经指向识别物体的中心了，但是舵机还是会有一些动作调整，导致一直动，都不停的。

那为了解决这个问题，我们就可以使用滤波的方式，将数据跳变不大的时候，过滤掉。最简单的滤波就是采集多次然后取平均值，这个平均值就是滤波后的结果。

如果你的PID没有调好，那也可以直接用滤波，应该也可以实现一个比较不错的效果。

这里我用一个比较常用的滤波算法：**`一阶低通滤波算法`**。

我将代码封装成为了一个库文件，将下面代码保存并命名为 filter.py，完成后上传到K230的sdcard文件夹里面。

```python
#一阶低通滤波器
class LowPassFilter:
    def __init__(self, alpha):
        self.alpha = alpha  # 滤波器的系数，0 < alpha <= 1
        self.last_output = None

    def update(self, value):
        if self.last_output is None:
            # 初始化滤波器的输出
            self.last_output = value
        else:
            # 更新滤波器的输出
            self.last_output = self.alpha * value + (1 - self.alpha) * self.last_output
        return self.last_output

```
![图 28](../../static/images/docs/diy/tracking-cannon/basic/basic-2025-06-27-00-52-59.png)  

接下来是介绍如何使用这个滤波算法，首先使用前先导入库：

```python
from filter import LowPassFilter
```

然后初始化滤波参数：

```python
#滤波
alpha = 0.1  # 滤波器系数，您可以根据需要调整这个值
lr_filter = LowPassFilter(alpha) # 左右舵机滤波器
```

接着在关键代码中调用API函数 `.update`，比如我采集的位置数据是 pid_lr_value，我要对其滤波则输入pid_lr_value，API`.update`返回的数值就是滤波后的数值：

```python

# 对目标物体的中心位置进行滤波
filter_lr_value = lr_filter.update(x_offset)
filter_ud_value = ud_filter.update(y_offset)

```

实现效果：

![图 10](../../static/images/docs/diy/tracking-cannon/basic/basic-2024-12-22-00-06-01.gif)  

完整代码：

```python 
import time, os, gc, sys, math,utime
from machine import PWM, FPIOA, Pin, UART
from media.sensor import *
from media.display import *
from media.media import *
from pid import PID
from filter import LowPassFilter

DETECT_WIDTH = 640
DETECT_HEIGHT = 480

sensor = None

###############################舵机配置#####################################################
# 2.5 = -90度 7.5 = 0度 12.5 = 90度
min_duty = 2.5      #最小占空比
max_duty = 12.5     #最大占空比
mid_duty = 7.5      # 中间值，对应于0度
pwm_lr = None

# 配置排针引脚号12，芯片引脚号为47的排针复用为PWM通道3输出
pwm_io1 = FPIOA()
pwm_io1.set_function(47, FPIOA.PWM3)
# 初始化PWM参数
pwm_ud = PWM(3, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 3~12

# 配置排针引脚号32，芯片引脚号为46的排针复用为PWM通道2输出
pwm_io2 = FPIOA()
pwm_io2.set_function(46, FPIOA.PWM2)
# 初始化PWM参数
pwm_lr = PWM(2, 50, 50, enable=True)  # 默认频率50Hz,占空比50% 2~13

pwm_lr.duty(7.5)    #旋转到中间
pwm_ud.duty(7.7)    #旋转到中间
##########################################################################################

###############################PID配置#####################################################
lr_kp = 0.17
lr_ki = 0.016
lr_kd = 0
lr_max_out = DETECT_WIDTH//2		#PID最大输出
pid_lr = PID(lr_kp, lr_ki, lr_kd, lr_max_out, lr_max_out)

ud_kp = 0.17
ud_ki = 0.016
ud_kd = 0
ud_max_out = DETECT_HEIGHT//2		#PID最大输出
pid_ud = PID(ud_kp, ud_ki, ud_kd, ud_max_out, ud_max_out)
##########################################################################################

###############################一阶低通滤波器配置############################################
alpha = 0.1  # 滤波器系数，您可以根据需要调整这个值
lr_filter = LowPassFilter(alpha) # 左右舵机滤波器
ud_filter = LowPassFilter(alpha) # 上下舵机滤波器
##########################################################################################

## 将Y轴偏移数值转换为占空比的函数
def input_to_duty_cycle(input_min, input_max, input_value):
    # 定义输入输出范围
#    input_min = -(DETECT_HEIGHT // 2)
#    input_max = (DETECT_HEIGHT // 2)
    output_min = min_duty
    output_max = max_duty
    
    # 检查输入是否越界
    if input_value < input_min or input_value > input_max:
        raise ValueError(f"输入值必须在 {input_min} 和 {input_max} 之间")
    
    # 计算线性映射公式
    slope = (output_max - output_min) / (input_max - input_min)
    output_value = output_min + (input_value - input_min) * slope
    
    return output_value
    
try:
    # 初始化摄像头
    sensor = Sensor(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 传感器复位
    sensor.reset()
    # 开启镜像
    sensor.set_hmirror(True)#False
    # sensor vflip
    sensor.set_vflip(True)#False True
    # 设置图像一帧的大小
    sensor.set_framesize(width = DETECT_WIDTH, height = DETECT_HEIGHT)
    # 设置图像输出格式为彩色的RGB565
    sensor.set_pixformat(Sensor.RGB565)
    # 使用IDE显示图像
    Display.init(Display.VIRT, width = DETECT_WIDTH, height = DETECT_HEIGHT, fps = 100)
    # 初始化媒体管理器
    MediaManager.init()
    # 摄像头传感器开启运行
    sensor.run()

    # 定义要识别颜色的阈值，这里需要根据你的具体情况调整
    # 你可以通过尝试不同的阈值来找到最适合你的物体颜色值
    red_threshold = (0, 42, 17, 94, -6, 50)

    while True:
        # 拍摄一张图片
        img = sensor.snapshot()
        # 查找图像中满足红色阈值的区域
        blobs = img.find_blobs([red_threshold], pixels_threshold=400, area_threshold=400, merge=True)

        # 如果找到了至少一个blob
        if blobs:
            # 找到最大的blob
            largest_blob = max(blobs, key=lambda b: b.pixels())
            # 画框
            img.draw_rectangle(largest_blob.rect(), color=(255, 0, 0))
            # 在框内画十字，标记中心点
            img.draw_cross(largest_blob.cx(), largest_blob.cy(), color=(255, 0, 0))

            # 计算相对于屏幕中心的X轴和Y轴的偏移量
            x_offset = largest_blob.cx() - img.width() // 2
            y_offset = largest_blob.cy() - img.height() // 2
            
            # 屏幕显示位置信息和像素大小，包含正负号
            wz = "x={}, y={}, w={}, h={}".format(x_offset, y_offset, largest_blob.w(), largest_blob.h())
            img.draw_string_advanced(0,0,32,wz)

            # 对目标物体的中心位置进行滤波
            filter_lr_value = lr_filter.update(x_offset)
            filter_ud_value = ud_filter.update(y_offset)

            # 根据中心偏移量计算PWM的PID
            # 0为目标值，x_offset表示当前设定值
            pid_lr_value = pid_lr.pid_calc(0,filter_lr_value)
            pid_ud_value = pid_ud.pid_calc(0,filter_ud_value)
            
            # 将PID值转换为舵机的范围并且输出实际的占空比
            duty_lr_value = input_to_duty_cycle(-(DETECT_WIDTH // 2), (DETECT_WIDTH // 2), pid_lr_value)
            duty_ud_value = input_to_duty_cycle(-(DETECT_HEIGHT // 2), (DETECT_HEIGHT // 2), pid_ud_value)
            
            # 根据计算后的占空比控制舵机动作
            pwm_lr.duty(duty_lr_value)
            pwm_ud.duty(duty_ud_value)
        # 中心画十字
        img.draw_cross(img.width() // 2, img.height() // 2, color=(0, 255, 0), size=10, thickness=3)
        # IDE显示图片
        Display.show_image(img)

except KeyboardInterrupt as e:
    print(f"user stop")
except BaseException as e:
    print(f"Exception &#039;{e}&#039;")
finally:
    # sensor stop run
    if isinstance(sensor, Sensor):
        sensor.stop()
    # deinit display
    Display.deinit()

    if isinstance(pwm_lr, PWM):
        pwm_lr.deinit()

    # release media buffer
    MediaManager.deinit()

    os.exitpoint(os.EXITPOINT_ENABLE_SLEEP)
    time.sleep_ms(100)
```


