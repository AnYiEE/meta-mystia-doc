# 如何安装

## 下载安装BepInEx

在[BepInEx Be](https://builds.bepinex.dev/projects/bepinex_be) 选择适用于《[东方夜雀食堂](https://store.steampowered.com/app/1584090/)》的**IL2cpp**版本。

绝大多数玩家可能需要下载图中所示的版本：

![BepInEx版本列表](./how_to_install.assets/image-20251231114022353.png)

解压压缩包内容至游戏根目录，解压后目录结构应如下所示：

```tree
Touhou Mystia Izakaya
├─BepInEx
├─dotnet
├─Touhou Mystia Izakaya_Data
├─东方夜雀食堂 头像&表情包 ~ Avatar Image
├─.doorstop_version
├─baselib.dll
├─changelog.txt
├─doorstop_config.ini
├─GameAssembly.dll
├─Touhou Mystia Izakaya.exe
├─UnityCrashHandler64.exe
├─UnityPlayer.dll
└─winhttp.dll
```

运行游戏，出现黑色控制台即为安装成功，首次启动可能需要一定时间。

## 下载安装Mod

从[GitHub](https://github.com/MetaMikuAI/MetaMystia/releases)（推荐）或[本站服务器](https://url.izakaya.cc/getMetaMystia)下载最新的**MetaMystia.dll**并将其放入`BepInEx/plugins`目录。

启动游戏，游戏左下角出现白色小字即为安装成功：

![成功安装后的输出](./how_to_install.assets/image-20251231115308622.png)
