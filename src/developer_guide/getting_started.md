# 开发入门

欢迎加入**MetaMystia**的开发。本指南面向具备一定软件开发经验的开发者，假设您熟悉C#及.NET生态，但可能尚未接触过Il2Cpp游戏、逆向工程或Mod开发。文档将覆盖项目编译、工具准备，以及最基础的逆向分析流程，帮助您建立完整的开发环境与认知框架。

## 编译项目

在开始之前，请确保您的系统满足以下条件，并按顺序完成配置。

1. **.NET 10 SDK**：
   [https://dotnet.microsoft.com/zh-cn/download/dotnet/10.0](https://dotnet.microsoft.com/zh-cn/download/dotnet/10.0)

2. 一份《[东方夜雀食堂](https://store.steampowered.com/app/1584090)》的**合法拷贝**（Steam版本）。

3. 克隆**MetaMystia**仓库：
   [https://github.com/MetaMikuAI/MetaMystia](https://github.com/MetaMikuAI/MetaMystia)

4. 下载最新的**BepInEx-Unity.IL2CPP-win-x64**：
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

    并将其完整解压至游戏的安装根目录（即 `Touhou Mystia Izakaya.exe` 所在目录）。

5. 打开项目文件`MetaMystia.csproj`，将游戏的安装路径填写到`<GamePath>`标签中：

    ```xml
    <GamePath>D:\SteamLibrary\steamapps\common\Touhou Mystia Izakaya</GamePath>
    ```

    该路径用于在编译阶段定位Il2Cpp生成的中间产物与符号文件。

6. 启动游戏一次，在进入主菜单后退出。此步骤用于触发BepInEx及Il2Cpp相关文件的初始化生成。

7. 使用任意支持.NET Solution的IDE（如Visual Studio）打开仓库根目录下的`MetaMystia.sln`。

8. 编译项目，确认能够成功生成`MetaMystia.dll`。

## 安装工具

为了进行较为高效的Mod开发与逆向分析，建议提前准备以下工具。

### 核心工具

#### IDA Pro

用于对`GameAssembly.dll`进行反汇编分析，并在必要时进行动态调试。对于Il2Cpp游戏，IDA是理解底层执行逻辑的重要工具。

- 官方网站：[https://hex-rays.com/ida-pro](https://hex-rays.com/ida-pro)

> [!NOTE]
> IDA Free版本亦可完成基础分析，但功能受限。推荐使用Pro版本以获得更完整的交叉引用、类型系统与脚本支持。本文不提供任何破解或规避授权的方式。

#### dnSpy

用于静态分析.NET程序集。在Il2Cpp场景下，主要用于查看Il2CppDumper生成的Dummy DLL，以快速理解类结构、字段布局与方法签名。

- GitHub仓库：[https://github.com/dnSpy/dnSpy](https://github.com/dnSpy/dnSpy)

#### Il2CppDumper

用于分析Il2Cpp生成的二进制文件，自动还原符号信息，并生成供dnSpy与IDA使用的辅助文件。

- GitHub仓库：[https://github.com/Perfare/Il2CppDumper](https://github.com/Perfare/Il2CppDumper)

### 推荐插件（可选）

#### IDA-Pro-MCP

该插件允许AI Agent通过MCP接口访问IDA数据库，可用于辅助定位函数、理解控制流或加速分析过程。

- 安装参考：[https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation](https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation)

#### dnSpy.Cpp2IL

dnSpy插件，用于将Cpp2IL的分析结果整合进dnSpy视图，在查看Il2Cpp还原代码时提供更丰富的信息。

- 安装参考：[https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install](https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install)

## 逆向分析准备

本节介绍如何利用上述工具，对游戏的Il2Cpp产物进行一次基础、可复用的分析准备流程。完成本节后，您应当能够在dnSpy中浏览游戏逻辑结构，并在IDA中进行符号化的反汇编分析。

### 使用Il2CppDumper还原符号

1. 运行`Il2CppDumper.exe`。

2. 按照提示依次加载以下文件：
    - 游戏目录下的`GameAssembly.dll`
    - `Touhou Mystia Izakaya_Data/il2cpp_data/Metadata/global-metadata.dat`

3. 等待工具完成自动分析。完成后将生成多个输出目录，其中后续步骤主要使用：
    - `DummyDll/`

### 导入dnSpy

1. 将Il2CppDumper生成的`DummyDll/Assembly-CSharp.dll`导入dnSpy。

2. 通过该文件，您可以较为直观地查看游戏逻辑中的类定义、字段名称以及方法签名，并定位其在dll中的虚拟地址。

### 导入IDA Pro

1. 使用IDA Pro打开`GameAssembly.dll`，等待其完成初始自动分析（首次加载耗时可能较长）。

2. 在IDA中点击`File -> Script file`，运行Il2CppDumper生成的`ida_with_struct_py3.py`脚本。

3. 根据脚本提示，依次选择生成的`script.json`与`il2cpp.h`文件，耐心等待符号与结构信息导入完成。

    ![IDA运行脚本步骤](./getting_started.assets/image-20251231124728238.png)

4. 导入完成后，关闭IDA并**保存数据库**。在保存对话框中，建议勾选`Collect`选项，以保留完整的分析信息。

    ![IDA保存对话框](./getting_started.assets/image-20251231125239242.png)

5. 额外备份生成的`GameAssembly.dll.i64`数据库文件

> [!TIP]
> 动态调试时由于**ASLR**，模块的运行时基址（如 `0x7FFF25021000`）会与静态分析时的地址（如 `0x180001000`）不同，容易造成地址对照混乱。保留一份原始静态数据库可以避免IDA的Rebase影响静态分析。
