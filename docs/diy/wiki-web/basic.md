---
title: wiki网站搭建
keywords: keyword1, keyword2
desc: description for this article
show_source: false
update:
  - date: 2024-12-05
    author: 老怪鸽
    version: 1.0.1
    content: 更新了基本文档
---

## 基本架构

使用 teedoc框架搭建，使用github的pages部署而成。

## teedoc介绍

**简而全的开源静态网站/文档/博客生成器**

1. 使用  Markdown 或者 jupyter notebook 书写，自动生成 HTML 页面

2. 使用 python 编写， 跨平台， 使用 pip 即可安装， 支持插件安装及自定义插件

3. 支持多文档，每篇文档有单独的目录，也可以多版本。你的大量文档再也不用散落在各个域名下了！同时支持轻量博客系统

4. 默认主题为高效阅读而设计，提供主题插件支持，同时支持自定义 css、js，能通过页面指定 id 精确控制任何一个页面元素的样式

5. 并行构建，充分利用处理器性能，文档渲染就在一瞬间，支持浏览器实时预览修改

6. 生成的都是静态页面，拷贝到服务器即可完成部署，SEO 友好，比如 页关键词自定义、sitemap自动生成等

## teedoc相关资料

官网: teedoc.neucrack.com 或 teedoc.github.io

本文档源文件: github.com/teedoc/teedoc.github.io

源码: https://github.com/teedoc/teedoc 如果你喜欢这个项目，请务必登录 github 给项目点个 star

以下场景可使用teedoc：

* 建文档网站，并且最好支持放多份文档（比如你有一本叫Python学习和C++学习两本书，它们都有单独的目录, teedoc则是书库）
* 文档和网页页面共存，支持自定义HTML页面
* 建WiKi网站
* 建个人或者企业知识库
* 建个人或者企业网站
* 博客

## 使用teedoc的企业案例


| 网站 | 简介 | 站点源文档 |
| ---- | --- | --- |
|[teedoc 官网](https://teedoc.github.io) | 好用的文档网站生成工具 | [teedoc/teedoc.github.io](https://github.com/teedoc/teedoc.github.io) |
|[MaixPy](https://maixpy.sipeed.com)     |  边缘 AI 计算 Python SDK | [sipeed/MaixPy_DOC](https://github.com/sipeed/MaixPy_DOC) |
|[Sipeed Wiki](https://wiki.sipeed.com)  | Sipeed 官方Wiki | [sipeed/sipeed_wiki](https://github.com/sipeed/sipeed_wiki) |
|[teedoc.github.io/re0-web-teedoc/](https://teedoc.github.io/re0-web-teedoc/) | 从 gitbook 转到 teedoc 的示例网站 | [teedoc/re0-web-teedoc](https://github.com/teedoc/re0-web-teedoc) |
|[QuecPython](https://python.quectel.com/doc/) | QuecPython 文档中心 | [gitee](https://gitee.com/quecpython/Community-document) [github](https://github.com/quecpython/Community-document)  |
| [BPI Steam Doc](https://bpi-steam.com/)             | BananaPi, Steam团队的文档（Wiki），包含了开源软件和开源硬件资料，AIOT资料等等 | [BPI-STEAM/BPI-Doc](https://github.com/BPI-STEAM/BPI-Doc) |
| [udbg](https://udbg.github.io/) |  基于Lua的二进制调试/分析工具 | [udbg/udbg.github.io](https://github.com/udbg/udbg.github.io) |
| [VastUtils](https://sakurajimamaii.github.io/VastDocs/) | 一款加快你安卓开发的安卓工具集 | [SakurajimaMaii/VastDocs](https://github.com/SakurajimaMaii/VastDocs) |

期待你的使用， 欢迎[提交 issue](https://github.com/teedoc/teedoc.github.io/issues) 或者 PR 来添加你的网站

## 快速搭建wiki网站

### 安装 python3

需要先安装Python3 （仅支持 Python3）

比如在Ubuntu上：

```sh
sudo apt install python3 python3-pip git
```
Windows 和 macOS请到[官网下载](https://www.python.org/downloads/)

### 安装 teedoc

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

### 新建工程

新建一个空目录用来放文档工程

```sh
mkdir my_site
cd my_site
teedoc init
```
选择1，也就是minimal模板进行生成， 也可以直接`teedoc -d my_site --template=minimal init`进行生成

这会在 `my_site` 目录下自动生成一些基础文件


### 安装插件

这会根据`site_config.json`中的`plugins`的插件设置安装插件

```sh
cd my_site
teedoc install
```
插件也是以 `python` 包的形式发布的， 所以这会从 `pypi.org` 下载对应的插件，同样，也可以使用其它源，比如清华 tuna 源： `teedoc -i https://pypi.tuna.tsinghua.edu.cn/simple install`


### 构建 `HTML` 页面并起一个`HTTP`服务

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