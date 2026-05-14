# HDocHub - 个人知识分享站

学广而闻多，则不求于人。

基于 [teedoc](https://github.com/teedoc/teedoc) 搭建的个人技术文档中心，主要方向：嵌入式、MCU、Linux、C/C++、Python、Markdown、Git。

## 在线访问

- 主站：https://wiki.hdochub.com

## 内容导航

| 板块 | 说明 |
|------|------|
| C语言参考手册 | C语言基础入门，帮助新手快速上手 |
| MarkDown语法手册 | 基于 teedoc 的 Markdown 语法总结 |
| 单片机入门手册 | STM32、ESP32、MSPM0、GD32、RP2040 等外设例程 |
| DIY项目合集 | 从软件到硬件，从系统到裸机 |
| 在线工具 | 浏览器端开发辅助工具（OLED_UI 仿真器等） |

## 本地部署

### 环境要求

- Python 3.x
- pip

### 安装步骤

```bash
# 安装 teedoc
pip install teedoc

# 克隆项目
git clone https://github.com/LaoGuaiGe/laoguaige.github.io.git
cd laoguaige.github.io

# 安装插件
teedoc install

# 本地预览
teedoc serve
```

浏览器打开 http://127.0.0.1:2333 即可预览。

如果 pypi 速度慢，可使用清华源：

```bash
pip install teedoc -i https://pypi.tuna.tsinghua.edu.cn/simple
teedoc -i https://pypi.tuna.tsinghua.edu.cn/simple install
```

### 构建部署

```bash
teedoc build
```

构建产物在 `out/` 目录，将其内容部署到 Nginx/Apache 或任何静态托管服务即可。

## 项目结构

```
├── site_config.json    全局配置（路由、插件）
├── config/             导航栏、页脚、主题配置
├── docs/               文档内容
│   ├── c-basics/       C语言
│   ├── markdown/       Markdown
│   ├── mcu/            单片机
│   ├── diy/            DIY项目
│   └── tools/          在线工具
├── pages/index/        首页
└── static/             静态资源（CSS、JS、图片、在线工具）
```

## 致谢

- [teedoc](https://github.com/teedoc/teedoc) - 静态文档网站生成器
