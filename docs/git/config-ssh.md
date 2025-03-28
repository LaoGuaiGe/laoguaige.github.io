# 如何配置 SSH 管理多个 Git 仓库

## 1. Why SSH ?

在使用 github 时或者免密登录到远程服务器时，总要使用到 SSH 这个工具来创建密钥并进行连接，那什么是 SSH 呢，我们先来看一下它的简单定义：


> SSH是一种加密协议，全称为Secure Shell，用于安全地远程登录到服务器或其他远程设备上执行命令或传输文件。它提供了一种安全的加密通信机制，使得远程登录和文件传输等操作不会被恶意攻击者窃取或篡改，确保了数据的保密性和完整性。SSH采用公钥密码学技术，能够有效地防止被中间人攻击或网络窃听。


举例来说，如果我们要使用 Github 这种 git 代码托管平台的话，首先本地要生成一个 SSH `私钥`(如`id_rsa`) 和 `公钥`(如 `id_rsa.pub`)，然后将 `公钥` 填写到 Github 的 SSH Key 管理面板中。

当我们向 Github 推送代码的时候会首先发起身份校验。此时，本地会将用户信息通过 SSH `私钥` 执行『签名』操作。当签名信息发送到 Github 的时候，Github 就会使用用户保存在平台上的 `公钥` 来校验签名信息，使用 `私钥` 签名信息只能由对应的 `公钥` 进行校验，因此如果 Github 对签名校验通过，就可以认证当前的用户对代码仓库拥有响应的操作权限，之后就可以让用户提交的代码入库了，整体流程如下图：


<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/git/config-ssh/99dc87436db35884ea0bb96cce0ac8cc7a9cc5481beeb3d37bd12e7199e98274.png" width="1200"></th>
  </tr>
  <tr>
      <th><center>整体流程图</center></th>
  </tr>  
</thead>
</table>

> 关于公钥和私钥，是『非对称加密』相关的内容，公钥通常用于 内容加密 或 认证签名，是可以在服务器与客户端之间进行传播的；而私钥是用来 解密公钥加密的内容 或 对内容进行签名 用的

综上，SSH 采用非对称加密的方式来完成客户端与服务器端的认证并建立通信连接，因此可以被用于客户端与 git 平台之间的认证，以及远程服务器之间的免密认证。

## 2. 配置单个 Git 账户

首先，我们来简单复习一下如何配置单个 git 账户。

对于单个 git 账户的场景非常简单，假如我们是一个萌新开发者，想要往 Github 上上传项目（这里我们仅探讨 SSH 协议的方式），那么首先我们要在本地安装 OpenSSH 以及 git。

> 一般 Linux 类操作系统、MacOS 都已经自带了 ssh 和 git，不需要单独安装。windows 操作系统参考 [官方说明](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_install_firstuse?tabs=gui&pivots=windows-server-2025) 来开启 OpenSSH，git 则可以直接访问 [官网](https://git-scm.com/) 进行安装

安装完 git 之后打开终端，我们先要使用 git 指令为全局设置一个 git 账户和邮箱：

```c
git config --global user.email YourEmailAdress
git config --global user.name YourUserName
```

> 这里 git 的用户名和密码跟你的 Github 账号没有强关联，Github 的账号只是你登录平台用的，而这里的 git 用户名和邮箱是用来标记代码是哪个用户写的。

安装完 OpenSSH 之后打开操作系统上的终端（windows 操作系统推荐使用 git bash 或者 cmder），我们执行第一步：生成一对 SSH 密钥：

```c
ssh-keygen -t rsa -C "YourEmailAdress"
```

这个指令的意思是使用 `ssh-keygen` 生成密钥，`-t` 参数密钥的加密方式是 rsa，`-C` 参数可以为密钥指定备注，通常备注可以为你的邮箱，或者你也可以写成你要连接的远程服务器名（总之不重要）。

输入完成之后会进入一个交互式终端界面，首先会询问你的密钥文件名称：

```c
Enter file in which to save the key (/Users/username/.ssh/id_rsa):
```

我们可以使用回车跳过，那么密钥文件名称就自动生成为 id_加密方式，如 id_rsa。

之后会提示用户输入密码：

```c
Enter passphrase (empty for no passphrase):
```

这个密码是用来保护你的私钥的，我们这里避免麻烦可以直接跳过。

生成完成之后，我们在终端中使用 cat 指令，输出生成的公钥内容：

```c
cat ~/.ssh/id_rsa.pub
```

> 公钥的内容为一串长字符串，字符串的末尾为你输入的密钥备注

之后我们访问 Github 的用户设置界面，并来到 SSH and GPG keys 面板


<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/git/config-ssh/9ff8d4a278f00ae34df7a840daeca3278ae6209b1b755872491b062b2f83747a.png" width="1200"></th>
  </tr>
  <tr>
      <th><center>SSH and GPG keys 面板</center></th>
  </tr>  
</thead>
</table>

点击 New SSH key ，之后将前面输出的公钥内容粘贴到 输入框中：
 
<table>
<thead>
  <tr>
      <th><img src="../../static/images/docs/git/config-ssh/a62e8c69f18b7b8fdac2e5f38122900eec42d972d9a0e8659cd36bbb66e7c4f4.png" width="1200"></th>
  </tr>
  <tr>
      <th><center>SSH and GPG keys 面板</center></th>
  </tr>  
</thead>
</table>

之后我们输入 `ssh -T git@github.com` 如果提示 `You've successfully authenticated` 就说明成功与 Github 建立了授权链接，你就可以往你的 Github 仓库推送代码了。





