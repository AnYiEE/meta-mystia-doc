# ResourceEx Module

[**ResourceEx**](https://github.com/MetaMikuAI/MetaMystia/tree/main/ResourceEx)是MetaMystia提供的资源扩展模块，旨在帮助创作者为《东方夜雀食堂》添加**自定义资源内容**。

目前，ResourceEx已支持配置：

- 稀客基本信息
- 图鉴描述
- 立绘贴图
- 携带金钱
- 评价语句
- 闲聊语句
- 食物与酒水的喜好与厌恶标签
- 食物与酒水的点单需求
- 出没地点
- 角色小人贴图
- 自定义角色对话包内容
- 自定义原料、食谱与食物

配合对应的在线工具，即使不具备复杂开发环境，也可以较为轻松地制作扩展资源。

## 配套工具

为了降低资源制作门槛，项目提供了**MetaMystia-ResourceEx-Editor**——一个面向创作者的**在线资源描述文件编辑器**，用于创建和编辑扩展资源描述文件（`ResourceEx.json`）。

该工具具备以下特点：

- 可视化编辑资源描述，无需手写JSON
- 无需本地开发环境，浏览器即可使用
- 适合希望尝试自定义内容或参与制作的玩家与创作者

相关链接：

- GitHub：[https://github.com/MetaMikuAI/MetaMystia-ResourceEx-Editor](https://github.com/MetaMikuAI/MetaMystia-ResourceEx-Editor)
- 在线体验：[https://editor.meta-mystia.izakaya.cc](https://editor.meta-mystia.izakaya.cc)

## 演示

![示例图片1](./use_resource-ex.assets/531355090-29c4d18b-2201-4ca5-8e0b-149882682493.png)

![示例图片2](./use_resource-ex.assets/531355118-2534e0c8-d3fe-4342-ac3d-7cd1d550c305.png)

![示例图片3](./use_resource-ex.assets/531355131-7cac9dd1-1adc-4973-bc07-caf2fda07b43.png)

![示例图片4](./use_resource-ex.assets/531355180-682f7460-2d3d-4fb8-930b-647e2e70bac4.png)

![示例图片5](./use_resource-ex.assets/image-20260110224843328.png)

![示例图片6](./use_resource-ex.assets/image-20260110224858165.png)

> （演示视频将在后续补充）

## 使用方法

### 资源包构建

您无需手动管理目录结构、图片资源及`ResourceEx.json`文件，推荐直接使用[MetaMystia-ResourceEx-Editor](https://editor.meta-mystia.izakaya.cc)在线工具生成。

## 注意事项

1. 角色ID分配规则：
    - 0–999：游戏原有资源
    - 1000–5999：DLC资源
    - 6000-8999: 为原游戏预留的扩展段
    - 9000–11999：MetaMystia保留扩展段
    - 12000及以上：创作者自定义资源

> [!CAUTION]
> 请避免使用0–11999范围内的ID。建议以每1000为一个独立创作区间，减少冲突。
>
> 也可以向MetaMystia开发团队申请专属ID段，以确保资源包的唯一性。

## 对话展示与触发

当前ResourceEx仅负责**加载并注入对话数据**，尚未提供完整的对话触发逻辑。

对于自行编写逻辑或调试的开发者，暂时可通过`WebDebugger`的简易`Console`手动触发指定对话包：

```csharp
MetaMystia.Dialog.ShowResourceExPackage("YourDialogPackageName", null)
```

## 关于版权

本项目及其开发者**不拥有**`/ResourceEx/MetaMystia/`目录下所包含资源的版权。

相关资源版权归以下原作者及团队所有：

- 《东方夜雀食堂》：[https://store.steampowered.com/app/1584090/](https://store.steampowered.com/app/1584090/)
- 《东方秋神牧场》：[https://www.bilibili.com/video/av115196056114538](https://www.bilibili.com/video/av115196056114538)
- 创作团队**二色幽紫蝶**：[https://space.bilibili.com/86865890](https://space.bilibili.com/86865890)

部分文案引用自：

- 东方夜雀食堂动画版EX短篇预览：[https://www.bilibili.com/video/BV1FfH7zpEw1](https://www.bilibili.com/video/BV1FfH7zpEw1)

如您希望成为新的资源包创作者，请确保：

- 您对所使用的素材拥有合法版权，或已获得原作者的二次创作授权
- 不侵害**二色幽紫蝶**及任何第三方创作者的合法权益
- 严格遵循《[东方Project使用规定](https://www.bilibili.com/opus/400555526272745308)》
