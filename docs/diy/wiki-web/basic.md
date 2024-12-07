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
