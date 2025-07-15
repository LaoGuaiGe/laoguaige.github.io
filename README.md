# hardwareDocsHubWEB

## 介绍
搭建的个人硬件文档记录中心网站，主要方向为: 嵌入式，MCU、linux、markdown、git、python、C/C++。

域名：[wiki.hdochub.com](wiki.hdochub.com)、[laoguaige.github.io](laoguaige.github.io)

项目来源[teedoc](https://github.com/teedoc/teedoc):https://github.com/teedoc/teedoc

网站搭建文档：https://teedoc.github.io/

## 快速搭建wiki

### 一、安装 python3

需要先安装Python3 （仅支持 Python3）

比如在Ubuntu上：

```sh
sudo apt install python3 python3-pip git
```
Windows 和 macOS请到[官网下载](https://www.python.org/downloads/)

### 二、安装 teedoc

打开终端(Windows按Ctrl+R输入cmd)，输入：

```sh
pip3 install teedoc
```

以后使用以下命令来更新软件：

```sh
pip3 install teedoc --upgrade
```
如果你的网络使用 pypi.org 速度很慢，可以选择其它源，比如清华 tuna 源： `pip3 install teedoc -i https://pypi.tuna.tsinghua.edu.cn/simple`

现在你可以在终端使用 `teedoc` 命令了

如果不能，请检查是不是`Python`可执行目录没有加入到环境变量 `PATH`,
比如可能在 `~/.local/bin`

### 三、新建工程

新建一个空目录用来放文档工程

```sh
mkdir my_site
cd my_site
teedoc init
```
选择1，也就是minimal模板进行生成， 也可以直接`teedoc -d my_site --template=minimal init`进行生成

这会在 `my_site` 目录下自动生成一些基础文件


### 四、安装插件

这会根据`site_config.json`中的`plugins`的插件设置安装插件

```sh
cd my_site
teedoc install
```
插件也是以 `python` 包的形式发布的， 所以这会从 `pypi.org` 下载对应的插件，同样，也可以使用其它源，比如清华 tuna 源： `teedoc -i https://pypi.tuna.tsinghua.edu.cn/simple install`


### 五、构建 `HTML` 页面并起一个`HTTP`服务

```sh
teedoc serve
```
这个命令会先构建所有`HTML`页面以及拷贝资源文件，然后起一个`HTTP`服务
如果只需要生成页面，使用

```sh
teedoc build
```
在显示 `Starting server at 0.0.0.0:2333 ....` 后，就可以了

打开浏览器访问: `http://127.0.0.1:2333`

同时可以看到目录下多了一个`out`目录，里面就是生成的静态网站内容，直接拷贝到服务器使用`nginx`或者`apache`进行部署即可